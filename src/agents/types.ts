/**
 * Shared type definitions for REP agent system
 * These types enforce the governance model across all agents
 */

/**
 * Geographic context for any data operation
 * Ensures we track resolution and aggregation level
 */
export interface GeographicContext {
  // FIPS code for the geography (5 digits for tract, 3 for county)
  geoid: string;
  // "tract" | "county" | "zip" (preferred: tract)
  resolutionLevel: "tract" | "county" | "zip" | "state";
  // Census Bureau name (e.g., "Census Tract 1234, County, State")
  name?: string;
  // True if this was downgraded from higher resolution
  isDowngraded: boolean;
}

/**
 * A dataset before governance checks
 * Raw data should never leave the backend without passing through
 * the Data Governance Agent
 */
export interface RawDataset {
  geographies: GeographicContext[];
  metrics: Record<string, number | null>;
  // Raw cell counts (never shown to users)
  cellCounts: Record<string, number>;
  // Metadata: where did this come from?
  source: "census" | "osm" | "user_story" | "computational";
  timestamp: Date;
}

/**
 * A dataset AFTER governance checks
 * Safe to render, narrate, or export
 */
export interface GovernanceApprovedDataset extends RawDataset {
  // Which rules were applied?
  appliedRules: string[];
  // Was this downgraded? From what?
  downgradedFrom?: "tract" | "county" | "zip";
  // Metadata about suppressions or uncertainty
  warnings: GovernanceWarning[];
  // Timestamp of governance check
  governanceCheckedAt: Date;
}

/**
 * Governance warnings explain what was hidden or modified
 */
export interface GovernanceWarning {
  type: "suppression" | "downgrade" | "uncertainty" | "contextual";
  message: string; // Human-readable explanation
  affectedMetrics?: string[];
}

/**
 * Result of a governance check
 */
export interface GovernanceCheckResult {
  // true if the data can be shown to users
  isAllowed: boolean;
  // If blocked or modified, why?
  decisions: GovernanceDecision[];
  // If approved, the safe dataset
  approvedData?: GovernanceApprovedDataset;
  // If blocked, what should we tell users?
  userMessage?: string;
}

/**
 * Individual governance decision with reasoning
 */
export interface GovernanceDecision {
  rule: string; // e.g., "minimum_cell_size", "geography_downgrade"
  outcome: "allowed" | "blocked" | "downgraded" | "flagged";
  reason: string;
  affectedData?: string[];
}

/**
 * Context passed to the LLM Narrative Agent
 * Contains ONLY pre-aggregated, governance-approved data
 */
export interface NarrativeContext {
  // The geography we're describing
  geography: GeographicContext;
  // Pre-aggregated metrics (percents, ratios, indices)
  metrics: Record<string, number | null>;
  // Human-readable metric names
  metricLabels: Record<string, string>;
  // Warnings from governance check
  warnings: GovernanceWarning[];
  // Confidence levels: "high", "medium", "low"
  confidence: Record<string, "high" | "medium" | "low">;
  // Asset-based context (community resources, strengths)
  assets?: Record<string, string | number>;
  // Burden context (environmental factors)
  burdens?: Record<string, string | number>;
}

/**
 * Output from the LLM Narrative Agent
 */
export interface Narrative {
  // Plain-language summary
  summary: string;
  // What this map DOES show
  whatItShows: string[];
  // What this map DOES NOT show (critical for equity)
  whatItDoesNotShow: string[];
  // Key insights (qualified, not causal)
  insights: string[];
  // Uncertainty language
  uncertaintyStatement: string;
  // Asset framing (solutions, strengths, resources)
  assetContext?: string;
}

/**
 * User role in REP
 * Controls what data resolution and exports they can access
 */
export type UserRole = "public" | "researcher" | "community_partner" | "admin";

/**
 * Permission policy for a given role
 */
export interface RolePermissions {
  role: UserRole;
  // Minimum resolution they can view
  minResolution: "tract" | "county" | "zip" | "state";
  // Can they export data?
  canExport: boolean;
  // Can they see raw cell counts?
  canSeeCellCounts: boolean;
  // Can they see internal governance decisions?
  canSeeGovernanceMetadata: boolean;
  // Can they add annotations?
  canAnnotate: boolean;
}

/**
 * External API response (raw, unevaluated)
 */
export interface ExternalAPIResponse {
  source: "census" | "osm";
  rawData: unknown;
  httpStatus: number;
  fetchedAt: Date;
  cacheKey?: string;
}

/**
 * Burden Index: a composite indicator of environmental and structural factors
 */
export interface BurdenIndex {
  geoid: string;
  // Composite score (0–100)
  score: number;
  // Components with weights
  components: Record<string, { value: number; weight: number }>;
  // How many factors contributed?
  factorCount: number;
  // Confidence in this calculation
  confidence: "high" | "medium" | "low";
  // When was this computed?
  computedAt: Date;
}
