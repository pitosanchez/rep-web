/**
 * Role-Based Access Control (RBAC) for REP
 *
 * Lightweight permission model for REP.
 * Controls what data resolution and exports each role can access.
 *
 * This is NOT AI-based. Roles are simple, human-defined policies.
 *
 * Roles:
 * - public: Anyone visiting the site
 * - researcher: Academic, nonprofit researchers (requires signup + verification)
 * - community_partner: Community organizations (requires partnership agreement)
 * - admin: REP team members
 */

import { UserRole, RolePermissions } from "../agents/types";

/**
 * Permission policies by role
 * These define what data and features each role can access
 */
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  public: {
    role: "public",
    // Public can see aggregated neighborhood-level data only
    minResolution: "county",
    // No raw data export
    canExport: false,
    // No cell counts (privacy)
    canSeeCellCounts: false,
    // No governance internals
    canSeeGovernanceMetadata: false,
    // No annotations
    canAnnotate: false,
  },

  researcher: {
    role: "researcher",
    // Researchers can see tract-level data (better for analysis)
    minResolution: "tract",
    // Can export aggregated data in standard formats (CSV, GeoJSON)
    canExport: true,
    // Can see cell counts (needed for statistical analysis)
    canSeeCellCounts: true,
    // Can see suppression decisions (needed to understand data quality)
    canSeeGovernanceMetadata: true,
    // Cannot annotate (data integrity)
    canAnnotate: false,
  },

  community_partner: {
    role: "community_partner",
    // Community partners see tract-level data about their neighborhoods
    minResolution: "tract",
    // Can export (for presentations, reports)
    canExport: true,
    // No cell counts (privacy-protective, plus community orgs may not need raw counts)
    canSeeCellCounts: false,
    // Can see why data is suppressed (to explain gaps to community)
    canSeeGovernanceMetadata: true,
    // Can add qualitative annotations/stories (subject to moderation)
    canAnnotate: true,
  },

  admin: {
    role: "admin",
    // Admin sees everything at all resolutions
    minResolution: "tract",
    // Can export all data
    canExport: true,
    // Can see raw counts for QA
    canSeeCellCounts: true,
    // Can audit governance decisions
    canSeeGovernanceMetadata: true,
    // Can manage annotations
    canAnnotate: true,
  },
};

/**
 * Check if a user has a specific permission
 *
 * @param role User role
 * @param permission Permission to check
 * @returns true if user has permission
 */
export function hasPermission(
  role: UserRole,
  permission:
    | "canExport"
    | "canSeeCellCounts"
    | "canSeeGovernanceMetadata"
    | "canAnnotate"
): boolean {
  const policy = ROLE_PERMISSIONS[role];
  return policy[permission] as boolean;
}

/**
 * Check if a user can view data at a specific resolution
 *
 * @param role User role
 * @param requestedResolution Requested geography resolution (tract, county, etc.)
 * @returns true if user can view data at this resolution
 */
export function canViewResolution(
  role: UserRole,
  requestedResolution: "tract" | "county" | "zip" | "state"
): boolean {
  const policy = ROLE_PERMISSIONS[role];
  const resolutionHierarchy = ["state", "county", "zip", "tract"];

  const userIndex = resolutionHierarchy.indexOf(policy.minResolution);
  const requestedIndex = resolutionHierarchy.indexOf(requestedResolution);

  // User can view if requested resolution is equal to or more aggregated than their minimum
  return requestedIndex <= userIndex;
}

/**
 * Get the full permission policy for a role
 *
 * @param role User role
 * @returns RolePermissions object
 */
export function getPermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if a role can access a specific metric
 * Some sensitive metrics might require higher access levels
 *
 * @param role User role
 * @param metric Metric name
 * @returns true if user can view this metric
 */
export function canAccessMetric(
  role: UserRole,
  metric: "poverty" | "education" | "housing" | "health" | "poi_density"
): boolean {
  // For now, all authenticated roles can see all metrics
  // Future: add metric-level restrictions if needed
  return role !== "public" || ["poverty", "education", "housing"].includes(metric);
}

/**
 * Apply role-based data filtering
 * Returns a version of the dataset appropriate for the user's role
 *
 * @param dataset Governance-approved dataset
 * @param role User role
 * @returns Filtered dataset (or error if user lacks access)
 */
export function filterDatasetByRole(
  dataset: {
    resolutionLevel: string;
    metrics: Record<string, number | null>;
    cellCounts?: Record<string, number>;
  },
  role: UserRole
): { dataset: typeof dataset; blockedFields: string[] } | null {
  const policy = ROLE_PERMISSIONS[role];

  // Check resolution level
  if (
    !canViewResolution(role, dataset.resolutionLevel as "tract" | "county" | "zip" | "state")
  ) {
    return null; // User cannot view this resolution
  }

  const blockedFields: string[] = [];
  const filteredDataset = { ...dataset };

  // Remove cell counts if user cannot see them
  if (!policy.canSeeCellCounts && filteredDataset.cellCounts) {
    delete filteredDataset.cellCounts;
    blockedFields.push("cellCounts");
  }

  return {
    dataset: filteredDataset,
    blockedFields,
  };
}

/**
 * Generate audit log entry for data access
 * Track who accessed what data
 *
 * @param userId User ID (or null for anonymous)
 * @param role User role
 * @param datasetId Dataset accessed
 * @returns Audit log entry
 */
export function logDataAccess(
  userId: string | null,
  role: UserRole,
  datasetId: string
): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    userId: userId || "anonymous",
    role,
    datasetId,
    action: "data_access",
  };
}

/**
 * Check if a user can modify data (admin only)
 *
 * @param role User role
 * @returns true if user is admin
 */
export function canModifyData(role: UserRole): boolean {
  return role === "admin";
}

/**
 * EXAMPLE: How to use this module
 *
 * // Check if user can export
 * if (hasPermission(userRole, "canExport")) {
 *   // Show export button
 * }
 *
 * // Filter dataset by role
 * const result = filterDatasetByRole(approvedDataset, userRole);
 * if (!result) {
 *   // User cannot view this data
 *   res.status(403).json({ error: "Access denied" });
 *   return;
 * }
 *
 * // Log access
 * logDataAccess(userId, userRole, datasetId);
 */
