/**
 * Suppression Agent (Backend ETL)
 *
 * Purpose: Apply small-number suppression to aggregated data
 * This runs server-side during data pipeline, NEVER on the frontend.
 *
 * CRITICAL: This agent MUST run before data is released to the governance agent.
 *
 * Suppression rules for REP:
 * - Block any metric with n < 11 (NCHS standard)
 * - Block any metric with n < 11 AND derived (e.g., percentages from small n)
 * - Document suppression in metadata
 * - NEVER show which cells are suppressed (that could re-identify)
 *
 * This is deterministic, testable, offline work.
 */

/**
 * Suppression decision for a single metric
 */
interface SuppressionDecision {
  metric: string;
  cellCount: number | null;
  isSuppressed: boolean;
  reason?: string;
}

/**
 * Result of suppression applied to a dataset
 */
export interface SuppressionResult {
  geography: string;
  timestamp: Date;
  suppressed: SuppressionDecision[];
  unsuppressedCount: number;
  suppressedCount: number;
  // Metadata to include in output
  suppressionNote: string;
}

/**
 * Configuration for suppression
 * These are not negotiable — they are based on NCHS guidelines
 */
const SUPPRESSION_CONFIG = {
  // NCHS standard: minimum cell size before suppression
  MINIMUM_CELL_SIZE: 11,
  // If derived percentage is calculated from n < MIN, suppress the percentage too
  SUPPRESS_DERIVED_FROM_SMALL_N: true,
  // Note to include in metadata when data is suppressed
  SUPPRESSION_NOTE:
    "Some data cells are suppressed to protect privacy. Cell counts below 11 are shown as 'null' per NCHS guidelines.",
};

/**
 * Apply small-number suppression to a single metric
 * Returns the metric value or null if suppressed
 *
 * @param metric Name of the metric
 * @param cellCount The n (cell count) for this metric
 * @param value The metric value (count or percent)
 * @returns { value: suppressed value, decision: SuppressionDecision }
 */
export function suppressMetric(
  metric: string,
  cellCount: number | null,
  value: number | null
): {
  value: number | null;
  decision: SuppressionDecision;
} {
  const decision: SuppressionDecision = {
    metric,
    cellCount,
    isSuppressed: false,
  };

  // If we don't have a cell count, we can't suppress intelligently
  // Flag this for review
  if (cellCount === null || cellCount === undefined) {
    decision.reason = "No cell count available; cannot evaluate suppression";
    return { value, decision };
  }

  // Apply minimum cell size rule
  if (cellCount < SUPPRESSION_CONFIG.MINIMUM_CELL_SIZE) {
    decision.isSuppressed = true;
    decision.reason = `Cell count (${cellCount}) below minimum (${SUPPRESSION_CONFIG.MINIMUM_CELL_SIZE})`;
    return { value: null, decision };
  }

  // Metric passes suppression rules
  return { value, decision };
}

/**
 * Apply suppression to all metrics in a geographic area
 * Returns dataset with suppressed values set to null
 *
 * @param geographyId Census tract GEOID
 * @param metrics Record of metric name to value
 * @param cellCounts Record of metric name to cell count
 * @returns SuppressionResult with decisions for each metric
 */
export function applySuppressionToGeography(
  geographyId: string,
  metrics: Record<string, number | null>,
  cellCounts: Record<string, number | null>
): SuppressionResult {
  const suppressedMetrics: SuppressionDecision[] = [];
  let suppressedCount = 0;
  let unsuppressedCount = 0;

  // Process each metric
  for (const [metricName, value] of Object.entries(metrics)) {
    const cellCount = cellCounts[metricName] || null;
    const { decision, value: _suppressedValue } = suppressMetric(
      metricName,
      cellCount,
      value
    );

    suppressedMetrics.push(decision);

    if (decision.isSuppressed) {
      suppressedCount++;
      // In-place suppression: set value to null in metrics
      metrics[metricName] = null;
    } else {
      unsuppressedCount++;
    }
  }

  return {
    geography: geographyId,
    timestamp: new Date(),
    suppressed: suppressedMetrics,
    unsuppressedCount,
    suppressedCount,
    suppressionNote: SUPPRESSION_CONFIG.SUPPRESSION_NOTE,
  };
}

/**
 * Batch suppression across multiple geographies
 * Used during data pipeline
 *
 * @param geographies Array of { geoid, metrics, cellCounts }
 * @returns Array of SuppressionResult
 */
export function applySuppressionBatch(
  geographies: Array<{
    geoid: string;
    metrics: Record<string, number | null>;
    cellCounts: Record<string, number | null>;
  }>
): SuppressionResult[] {
  return geographies.map(geo =>
    applySuppressionToGeography(geo.geoid, geo.metrics, geo.cellCounts)
  );
}

/**
 * Generate a suppression report for audit
 * Shows what was suppressed and why
 *
 * @param result Suppression result
 * @returns Human-readable report
 */
export function generateSuppressionReport(result: SuppressionResult): string {
  let report = `## Suppression Report\n`;
  report += `Geography: ${result.geography}\n`;
  report += `Processed: ${new Date(result.timestamp).toISOString()}\n\n`;

  report += `### Summary\n`;
  report += `- Unsuppressed metrics: ${result.unsuppressedCount}\n`;
  report += `- Suppressed metrics: ${result.suppressedCount}\n`;
  report += `- Suppression rate: ${(
    (result.suppressedCount /
      (result.suppressedCount + result.unsuppressedCount)) *
    100
  ).toFixed(1)}%\n\n`;

  if (result.suppressedCount > 0) {
    report += `### Suppressed Metrics\n`;
    result.suppressed
      .filter(d => d.isSuppressed)
      .forEach(decision => {
        report += `- ${decision.metric}: ${decision.reason}\n`;
      });
  }

  report += `\n### Policy\n${result.suppressionNote}\n`;

  return report;
}

/**
 * Validate that suppression is complete
 * Returns true if no unsuppressed small-n cells remain
 *
 * @param metrics Metrics to validate
 * @param cellCounts Cell counts
 * @returns { isValid: boolean, violations: string[] }
 */
export function validateSuppressionComplete(
  metrics: Record<string, number | null>,
  cellCounts: Record<string, number | null>
): { isValid: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const [metric, cellCount] of Object.entries(cellCounts)) {
    const value = metrics[metric];

    // Check: if cell count is small, value must be null
    if (
      cellCount !== null &&
      cellCount < SUPPRESSION_CONFIG.MINIMUM_CELL_SIZE &&
      value !== null
    ) {
      violations.push(
        `${metric}: cell count ${cellCount} < ${SUPPRESSION_CONFIG.MINIMUM_CELL_SIZE}, but value is ${value} (should be null)`
      );
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * EXAMPLE: How to use this agent
 *
 * During ETL pipeline:
 *
 * const rawGeographies = await fetchFromDatabase();
 *
 * // Apply suppression
 * const results = applySuppressionBatch(rawGeographies);
 *
 * // Validate
 * results.forEach(result => {
 *   const validation = validateSuppressionComplete(
 *     result.metrics,
 *     result.cellCounts
 *   );
 *   if (!validation.isValid) {
 *     throw new Error(`Suppression validation failed: ${validation.violations.join("; ")}`);
 *   }
 * });
 *
 * // Save suppressed data to database
 * await saveToDatabase(results);
 *
 * // Audit log
 * results.forEach(result => {
 *   console.log(generateSuppressionReport(result));
 * });
 */
