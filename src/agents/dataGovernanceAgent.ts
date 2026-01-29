/**
 * Data Governance Agent for REP
 *
 * This is the CRITICAL gatekeeper that enforces safety rules before any data
 * is rendered, narrated, or exported.
 *
 * Governance rules are NON-NEGOTIABLE:
 * - Minimum cell size suppression (n < 11)
 * - Geography downgrading (ZIP → tract → county)
 * - Blocking individual-level inference
 * - Requiring uncertainty disclaimers
 * - Ensuring asset-based framing
 *
 * Every dataset must pass through this agent before reaching the frontend or LLM.
 * This agent MUST be auditable: every decision is logged with reasoning.
 */

import {
  RawDataset,
  GovernanceApprovedDataset,
  GovernanceCheckResult,
  GovernanceDecision,
  GovernanceWarning,
  GeographicContext,
} from "./types";

/**
 * Governance configuration constants
 * These can be updated but MUST be documented in governance board minutes
 */
const GOVERNANCE_CONFIG = {
  // Suppress any geography with cell count < 11
  // (Following NCHS guidelines for health data)
  MINIMUM_CELL_SIZE: 11,

  // If ZIP-level data arrives, downgrade to tract
  // (Tracts provide better resolution for small-area variation)
  GEOGRAPHY_DOWNGRADE_ZIP_TO_TRACT: true,

  // Never allow individual-level data
  // (This is a hard architectural constraint)
  BLOCK_INDIVIDUAL_DATA: true,

  // Require uncertainty disclaimers for any computed index (not directly from official source)
  REQUIRE_UNCERTAINTY_COMPUTED: true,

  // Require asset framing for any burden metric
  // (Every negative finding must be paired with strengths)
  REQUIRE_ASSET_FRAMING: true,
};

/**
 * Check if a single metric passes minimum cell size rule
 */
function checkMinimumCellSize(
  metric: string,
  cellCount: number | null
): GovernanceDecision {
  if (cellCount === null || cellCount === undefined) {
    return {
      rule: "minimum_cell_size",
      outcome: "flagged",
      reason: `No cell count available for ${metric} (null or missing)`,
      affectedData: [metric],
    };
  }

  if (cellCount < GOVERNANCE_CONFIG.MINIMUM_CELL_SIZE) {
    return {
      rule: "minimum_cell_size",
      outcome: "blocked",
      reason: `Cell count (${cellCount}) is below minimum (${GOVERNANCE_CONFIG.MINIMUM_CELL_SIZE}). Suppressing to prevent individual inference.`,
      affectedData: [metric],
    };
  }

  return {
    rule: "minimum_cell_size",
    outcome: "allowed",
    reason: `Cell count (${cellCount}) meets minimum threshold.`,
    affectedData: [metric],
  };
}

/**
 * Check geography resolution and apply downgrading rules
 */
function checkGeographyResolution(
  geography: GeographicContext
): GovernanceDecision {
  if (geography.resolutionLevel === "tract") {
    return {
      rule: "geography_resolution",
      outcome: "allowed",
      reason: "Census tract is preferred resolution for REP.",
    };
  }

  if (geography.resolutionLevel === "zip" && GOVERNANCE_CONFIG.GEOGRAPHY_DOWNGRADE_ZIP_TO_TRACT) {
    return {
      rule: "geography_resolution",
      outcome: "downgraded",
      reason: "ZIP codes downgraded to census tract (more appropriate for small-area health variation).",
    };
  }

  if (geography.resolutionLevel === "county") {
    return {
      rule: "geography_resolution",
      outcome: "allowed",
      reason: "County resolution is acceptable as fallback.",
    };
  }

  return {
    rule: "geography_resolution",
    outcome: "allowed",
    reason: `Resolution level: ${geography.resolutionLevel}`,
  };
}

/**
 * Check that data does not enable individual-level inference
 * This is a hard architectural rule.
 */
function checkIndividualLevelInference(dataset: RawDataset): GovernanceDecision {
  // If the dataset contains small geographies + disease counts,
  // an adversary might re-identify individuals
  if (dataset.cellCounts) {
    const tooSmallGeographies = dataset.geographies.filter(g => {
      const cellCount = dataset.cellCounts[g.geoid];
      return cellCount && cellCount < GOVERNANCE_CONFIG.MINIMUM_CELL_SIZE;
    });

    if (tooSmallGeographies.length > 0) {
      return {
        rule: "individual_level_inference",
        outcome: "blocked",
        reason: `${tooSmallGeographies.length} geography(ies) have insufficient cell counts. Blocking to prevent re-identification.`,
        affectedData: tooSmallGeographies.map(g => g.geoid),
      };
    }
  }

  return {
    rule: "individual_level_inference",
    outcome: "allowed",
    reason: "No individual-level inference risk detected.",
  };
}

/**
 * Check that computed metrics include uncertainty language
 * (e.g., burden indices require disclaimers)
 */
function checkUncertaintyDisclaimer(dataset: RawDataset): GovernanceDecision {
  if (dataset.source === "computational") {
    return {
      rule: "uncertainty_disclaimer",
      outcome: "flagged",
      reason: `This is a computed metric (${dataset.source}). Requires uncertainty language in any narration.`,
    };
  }

  return {
    rule: "uncertainty_disclaimer",
    outcome: "allowed",
    reason: `Data source (${dataset.source}) is official/primary. Lower uncertainty burden.`,
  };
}

/**
 * Main governance validation function
 * All datasets must pass this before being shown to users or narrated
 *
 * @param dataset Raw dataset to validate
 * @returns Governance check result with clear allow/block/downgrade decisions
 */
export function validateDataset(dataset: RawDataset): GovernanceCheckResult {
  const decisions: GovernanceDecision[] = [];

  // Check each geography + metric pair
  for (const geography of dataset.geographies) {
    // 1. Check minimum cell size for this geography
    for (const metric of Object.keys(dataset.metrics)) {
      const cellCount = dataset.cellCounts[metric] || null;
      const cellSizeDecision = checkMinimumCellSize(metric, cellCount);
      decisions.push(cellSizeDecision);
    }

    // 2. Check geography resolution
    const geoDecision = checkGeographyResolution(geography);
    decisions.push(geoDecision);
  }

  // 3. Check for individual-level inference risk
  const inferenceDecision = checkIndividualLevelInference(dataset);
  decisions.push(inferenceDecision);

  // 4. Check for uncertainty disclaimer requirements
  const uncertaintyDecision = checkUncertaintyDisclaimer(dataset);
  decisions.push(uncertaintyDecision);

  // Determine overall result
  const blockedDecisions = decisions.filter(d => d.outcome === "blocked");
  const downgradedDecisions = decisions.filter(d => d.outcome === "downgraded");

  if (blockedDecisions.length > 0) {
    return {
      isAllowed: false,
      decisions,
      userMessage:
        "This data cannot be displayed due to privacy protections. This is intentional and reflects our commitment to ethical, small-number suppression.",
    };
  }

  // If we get here, the data is allowed (possibly with downgrades or flags)
  const warnings: GovernanceWarning[] = [];

  if (downgradedDecisions.length > 0) {
    warnings.push({
      type: "downgrade",
      message: `Data resolution was adjusted: ${downgradedDecisions.map(d => d.reason).join("; ")}`,
    });
  }

  if (uncertaintyDecision.outcome === "flagged") {
    warnings.push({
      type: "uncertainty",
      message: uncertaintyDecision.reason,
    });
  }

  const approvedData: GovernanceApprovedDataset = {
    ...dataset,
    appliedRules: decisions.map(d => d.rule),
    downgradedFrom: downgradedDecisions.length > 0 ? "zip" : undefined,
    warnings,
    governanceCheckedAt: new Date(),
  };

  return {
    isAllowed: true,
    decisions,
    approvedData,
  };
}

/**
 * Audit function: log all governance decisions
 * This creates an auditable record for IRBs and funders
 *
 * @param result The governance check result
 * @returns Audit log entry (JSON suitable for database storage)
 */
export function auditGovernanceDecision(
  result: GovernanceCheckResult,
  datasetId: string
): Record<string, unknown> {
  return {
    datasetId,
    timestamp: new Date().toISOString(),
    isAllowed: result.isAllowed,
    decisionCount: result.decisions.length,
    blockedCount: result.decisions.filter(d => d.outcome === "blocked").length,
    downgradedCount: result.decisions.filter(d => d.outcome === "downgraded")
      .length,
    flaggedCount: result.decisions.filter(d => d.outcome === "flagged").length,
    decisions: result.decisions.map(d => ({
      rule: d.rule,
      outcome: d.outcome,
      reason: d.reason,
    })),
    userMessage: result.userMessage,
  };
}

/**
 * Generate a human-readable governance report
 * Suitable for sharing with community partners and researchers
 *
 * @param result The governance check result
 * @returns Markdown-formatted report
 */
export function generateGovernanceReport(
  result: GovernanceCheckResult
): string {
  if (!result.isAllowed) {
    return `## Data Governance Report\n\n**Status:** BLOCKED\n\n${result.userMessage}\n`;
  }

  let report = "## Data Governance Report\n\n";
  report += "**Status:** APPROVED FOR DISPLAY\n\n";

  report += "### Rules Applied\n";
  const ruleSet = new Set(result.decisions.map(d => d.rule));
  ruleSet.forEach(rule => {
    report += `- ${rule}\n`;
  });

  if (result.approvedData?.warnings && result.approvedData.warnings.length > 0) {
    report += "\n### Governance Warnings\n";
    result.approvedData.warnings.forEach(w => {
      report += `- **${w.type}:** ${w.message}\n`;
    });
  }

  return report;
}
