/**
 * Geography Utilities for REP
 *
 * Helpers for working with census geographies, bounding boxes, and geographic codes.
 *
 * Key concepts:
 * - GEOID: Federal Information Processing Standards (FIPS) code
 *   - State (2) + County (3) + Tract (6) = 11 digits for census tract
 *   - State (2) + County (3) = 5 digits for county
 * - Census tracts are the preferred unit for REP (better resolution than ZIPs)
 * - Bounding boxes are [minLon, minLat, maxLon, maxLat]
 */

import { GeographicContext } from "../agents/types";

/**
 * Validate a GEOID format
 * Returns true if the GEOID is valid
 *
 * @param geoid Geographic identifier
 * @param expectedLength Expected length (5 for county, 11 for tract)
 * @returns true if valid
 */
export function isValidGEOID(
  geoid: string,
  expectedLength?: 5 | 11
): boolean {
  // GEOIDs must be numeric strings
  if (!geoid || !/^\d+$/.test(geoid)) return false;

  // If length specified, check it
  if (expectedLength && geoid.length !== expectedLength) return false;

  // Accept 5-digit (county) or 11-digit (tract) GEOIDs
  if (expectedLength === undefined && geoid.length !== 5 && geoid.length !== 11) {
    return false;
  }

  return true;
}

/**
 * Extract components from a census tract GEOID (11 digits)
 * Format: SSCCCTTTTTT (SS = state, CCC = county, TTTTTT = tract)
 *
 * @param tractGEOID 11-digit tract GEOID
 * @returns { state, county, tract } or null if invalid
 */
export function parseTractGEOID(
  tractGEOID: string
): { state: string; county: string; tract: string } | null {
  if (!isValidGEOID(tractGEOID, 11)) return null;

  return {
    state: tractGEOID.substring(0, 2),
    county: tractGEOID.substring(2, 5),
    tract: tractGEOID.substring(5, 11),
  };
}

/**
 * Extract components from a county GEOID (5 digits)
 * Format: SSCCC (SS = state, CCC = county)
 *
 * @param countyGEOID 5-digit county GEOID
 * @returns { state, county } or null if invalid
 */
export function parseCountyGEOID(
  countyGEOID: string
): { state: string; county: string } | null {
  if (!isValidGEOID(countyGEOID, 5)) return null;

  return {
    state: countyGEOID.substring(0, 2),
    county: countyGEOID.substring(2, 5),
  };
}

/**
 * Get the county GEOID from a tract GEOID
 * (Drop the tract portion)
 *
 * @param tractGEOID 11-digit tract GEOID
 * @returns 5-digit county GEOID or null if invalid
 */
export function getTractCountyGEOID(tractGEOID: string): string | null {
  const parsed = parseTractGEOID(tractGEOID);
  return parsed ? `${parsed.state}${parsed.county}` : null;
}

/**
 * Get U.S. FIPS state code from GEOID
 *
 * @param geoid Any valid GEOID
 * @returns 2-digit FIPS state code
 */
export function getStateFromGEOID(geoid: string): string | null {
  if (!isValidGEOID(geoid)) return null;
  return geoid.substring(0, 2);
}

/**
 * Get county FIPS code from tract GEOID
 *
 * @param tractGEOID 11-digit tract GEOID
 * @returns 3-digit FIPS county code
 */
export function getCountyFromTractGEOID(tractGEOID: string): string | null {
  const parsed = parseTractGEOID(tractGEOID);
  return parsed ? parsed.county : null;
}

/**
 * Build a geographic context object
 * Used when creating datasets
 *
 * @param geoid Geographic identifier
 * @param resolutionLevel Geographic resolution
 * @param name Human-readable name (optional)
 * @returns GeographicContext object
 */
export function buildGeographicContext(
  geoid: string,
  resolutionLevel: "tract" | "county" | "zip" | "state",
  name?: string
): GeographicContext {
  return {
    geoid,
    resolutionLevel,
    name: name || `${resolutionLevel} ${geoid}`,
    isDowngraded: false,
  };
}

/**
 * Downgrade a geographic context to a less specific resolution
 * (Used by governance agent when data is insufficient at fine resolution)
 *
 * @param context Original context
 * @param newResolution Coarser resolution (e.g., tract → county)
 * @returns New context with downgrade flag
 */
export function downgradeGeography(
  context: GeographicContext,
  newResolution: "county" | "state"
): GeographicContext {
  // Validate downgrade is coarser
  const hierarchy = ["state", "county", "tract"];
  const originalIndex = hierarchy.indexOf(context.resolutionLevel);
  const newIndex = hierarchy.indexOf(newResolution);

  if (newIndex >= originalIndex) {
    throw new Error(
      `Cannot downgrade from ${context.resolutionLevel} to ${newResolution} (must be coarser)`
    );
  }

  // Get appropriate GEOID for new resolution
  let newGEOID = context.geoid;
  if (newResolution === "county" && context.resolutionLevel === "tract") {
    newGEOID = getTractCountyGEOID(context.geoid) || context.geoid;
  }

  return {
    geoid: newGEOID,
    resolutionLevel: newResolution,
    name: context.name?.replace(
      context.resolutionLevel,
      newResolution
    ),
    isDowngraded: true,
  };
}

/**
 * Calculate bounding box for a given geography
 * (In production, use a database lookup)
 *
 * This is a placeholder. In reality, use Census Bureau or OSM bbox data.
 *
 * @param geoid Geographic identifier
 * @returns [minLon, minLat, maxLon, maxLat] or null if not found
 */
export function getGeographyBoundingBox(
  geoid: string
): [number, number, number, number] | null {
  // TODO: Implement by querying a bbox database
  // For now, return null to indicate not yet implemented
  return null;
}

/**
 * Validate a bounding box format
 *
 * @param bbox [minLon, minLat, maxLon, maxLat]
 * @returns true if valid
 */
export function isValidBoundingBox(
  bbox: unknown
): bbox is [number, number, number, number] {
  if (!Array.isArray(bbox) || bbox.length !== 4) return false;
  return bbox.every(n => typeof n === "number");
}

/**
 * Calculate the center point of a bounding box
 *
 * @param bbox [minLon, minLat, maxLon, maxLat]
 * @returns [centerLon, centerLat]
 */
export function getBoundingBoxCenter(
  bbox: [number, number, number, number]
): [number, number] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}

/**
 * Estimate if a point is within a bounding box
 * Simple check (not accounting for projection or edge cases)
 *
 * @param point [lon, lat]
 * @param bbox [minLon, minLat, maxLon, maxLat]
 * @returns true if point is within bbox
 */
export function isPointInBoundingBox(
  point: [number, number],
  bbox: [number, number, number, number]
): boolean {
  const [lon, lat] = point;
  const [minLon, minLat, maxLon, maxLat] = bbox;

  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
}

/**
 * Get human-readable geographic name from GEOID
 * (In production, use a database lookup)
 *
 * @param geoid Geographic identifier
 * @returns Human-readable name or null if not found
 */
export function getGeographyName(geoid: string): string | null {
  // TODO: Implement by querying a geography names database
  // For now, return null to indicate not yet implemented
  return null;
}

/**
 * FIPS state codes (2-digit)
 * Used for validation and lookup
 */
export const US_STATE_FIPS_CODES: Record<string, string> = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "12": "Florida",
  "13": "Georgia",
  // ... (add remaining states as needed)
};

/**
 * Get state name from FIPS code
 *
 * @param fipsCode 2-digit FIPS code
 * @returns State name or null if invalid
 */
export function getStateNameFromFIPS(fipsCode: string): string | null {
  return US_STATE_FIPS_CODES[fipsCode] || null;
}

/**
 * EXAMPLE: How to use this module
 *
 * // Parse a tract GEOID
 * const parts = parseTractGEOID("06001403100");
 * // { state: "06", county: "001", tract: "403100" }
 *
 * // Get the county GEOID
 * const countyGEOID = getTractCountyGEOID("06001403100");
 * // "06001"
 *
 * // Build a geographic context
 * const context = buildGeographicContext(
 *   "06001403100",
 *   "tract",
 *   "Census Tract 4031, Alameda County, CA"
 * );
 */
