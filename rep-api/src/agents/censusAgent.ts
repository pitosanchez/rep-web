/**
 * Census / ACS Data Agent for REP
 *
 * Purpose: Fetch raw data from US Census Bureau (ACS) APIs
 *
 * CRITICAL: This agent is fetch-only. It does NOT:
 * - Aggregate data
 * - Apply governance rules
 * - Transform data for display
 *
 * All Census data flows:
 * Census Agent (fetch) → Backend ETL (aggregate, suppress) → Governance Agent (check) → Frontend (display)
 *
 * Supported variables:
 * - B17001: Poverty (universe: population for whom poverty status is determined)
 * - B15003: Educational attainment
 * - B19001: Household income
 * - B25003: Housing tenure (owner/renter)
 * - S0101: Age and sex (demographic profile)
 *
 * References:
 * - Census API: https://api.census.gov/
 * - ACS Variable List: https://www.census.gov/data/developers/data-sets/acs-5year.html
 */

import { ExternalAPIResponse } from "./types";

/**
 * Census API configuration
 * API key should be stored in environment variables
 */
const CENSUS_API_CONFIG = {
  baseUrl: "https://api.census.gov/data",
  apiKey: process.env.CENSUS_API_KEY,
  // 5-year ACS is preferred for stability (not 1-year)
  dataset: "acs/acs5",
  vintage: 2022, // Latest available
};

/**
 * Supported Census variables for REP
 * Each variable definition includes:
 * - description: what it measures
 * - source: which Census product
 * - universe: the population it describes
 */
const SUPPORTED_VARIABLES = {
  B17001_002E: {
    description: "Population for whom poverty status is determined",
    table: "B17001",
    source: "ACS 5-year",
  },
  B17001_001E: {
    description: "Income in the past 12 months below poverty level",
    table: "B17001",
    source: "ACS 5-year",
  },
  B15003_001E: {
    description: "Population age 25 and over",
    table: "B15003",
    source: "ACS 5-year",
  },
  B15003_022E: {
    description: "Population with Bachelor's degree or higher",
    table: "B15003",
    source: "ACS 5-year",
  },
  B19001_001E: {
    description: "Household income (total households)",
    table: "B19001",
    source: "ACS 5-year",
  },
  B19001_002E: {
    description: "Household income < $10,000",
    table: "B19001",
    source: "ACS 5-year",
  },
  B25003_001E: {
    description: "Total housing units",
    table: "B25003",
    source: "ACS 5-year",
  },
  B25003_002E: {
    description: "Owner-occupied housing units",
    table: "B25003",
    source: "ACS 5-year",
  },
};

/**
 * In-memory cache for Census API responses
 * In production, use Redis or similar
 * TTL: 7 days (Census data is released annually)
 */
const CENSUS_CACHE = new Map<string, { data: unknown; timestamp: Date }>();
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: Date): boolean {
  return Date.now() - timestamp.getTime() < CACHE_TTL_MS;
}

/**
 * Fetch ACS data for census tracts
 * Returns raw API response (no transformation)
 *
 * @param state FIPS state code (e.g., "06" for California)
 * @param county FIPS county code (e.g., "001" for Alameda County)
 * @param variables Array of Census variable codes (e.g., ["B17001_002E", "B19001_001E"])
 * @returns Raw Census API response
 *
 * Example:
 *   const response = await fetchCensusData("06", "001", ["B17001_002E", "B19001_001E"]);
 */
export async function fetchCensusData(
  state: string,
  county: string,
  variables: string[]
): Promise<ExternalAPIResponse> {
  if (!CENSUS_API_CONFIG.apiKey) {
    throw new Error(
      "CENSUS_API_KEY environment variable not set. Get a key from https://api.census.gov/data/key_signup.html"
    );
  }

  // Build cache key
  const cacheKey = `census:${state}:${county}:${variables.sort().join(",")}`;

  // Check cache
  const cached = CENSUS_CACHE.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return {
      source: "census",
      rawData: cached.data,
      httpStatus: 200,
      fetchedAt: cached.timestamp,
      cacheKey,
    };
  }

  // Build query
  const variablesList = variables.join(",");
  const url = `${CENSUS_API_CONFIG.baseUrl}/${CENSUS_API_CONFIG.vintage}/${CENSUS_API_CONFIG.dataset}?
get=${variablesList}&for=tract:*&in=state:${state}+county:${county}&key=${CENSUS_API_CONFIG.apiKey}`.replace(
    /\s+/g,
    ""
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Census API returned ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();

    // Cache the result
    CENSUS_CACHE.set(cacheKey, { data, timestamp: new Date() });

    return {
      source: "census",
      rawData: data,
      httpStatus: response.status,
      fetchedAt: new Date(),
      cacheKey,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch Census data for state=${state}, county=${county}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Fetch Census data for a specific geography (state, county, or tract)
 * Convenience wrapper for common queries
 *
 * @param geoid Geographic identifier (e.g., "06001" for Alameda County)
 * @param geographyLevel "county" | "tract"
 * @param variables Variables to fetch
 * @returns Raw Census API response
 */
export async function fetchCensusDataForGeography(
  geoid: string,
  geographyLevel: "county" | "tract",
  variables: string[]
): Promise<ExternalAPIResponse> {
  const state = geoid.substring(0, 2);
  const county = geoid.substring(2, 5);

  if (geographyLevel === "county") {
    return fetchCensusData(state, county, variables);
  } else {
    // For tract, fetch all tracts in the county and let consumer filter
    return fetchCensusData(state, county, variables);
  }
}

/**
 * Get metadata about supported Census variables
 * Used for validation and documentation
 *
 * @param variableCode Census variable code (e.g., "B17001_002E")
 * @returns Variable metadata or null if not supported
 */
export function getCensusVariableMetadata(
  variableCode: string
): (typeof SUPPORTED_VARIABLES)[keyof typeof SUPPORTED_VARIABLES] | null {
  return (
    (SUPPORTED_VARIABLES as Record<string, unknown>)[variableCode] || null
  );
}

/**
 * Validate that requested variables are supported
 * (As a safety check, reject unsupported variables)
 *
 * @param variables Variable codes to validate
 * @returns { valid: boolean, unsupported: string[] }
 */
export function validateCensusVariables(
  variables: string[]
): { valid: boolean; unsupported: string[] } {
  const unsupported = variables.filter(
    v => !getCensusVariableMetadata(v)
  );

  return {
    valid: unsupported.length === 0,
    unsupported,
  };
}

/**
 * Clear Census cache (for testing or manual refresh)
 */
export function clearCensusCache(): void {
  CENSUS_CACHE.clear();
}

/**
 * Get cache statistics (for monitoring)
 */
export function getCensusStatistics(): {
  cacheSize: number;
  cachedGeographies: string[];
} {
  return {
    cacheSize: CENSUS_CACHE.size,
    cachedGeographies: Array.from(CENSUS_CACHE.keys()),
  };
}

/**
 * EXAMPLE: How to use this agent
 *
 * const response = await fetchCensusDataForGeography(
 *   "06001", // Alameda County, California
 *   "county",
 *   ["B17001_001E", "B17001_002E", "B19001_001E"]
 * );
 *
 * // response.rawData contains the Census API response
 * // This is raw data: no aggregation, no interpretation
 * // Pass it to backend ETL, then governance agent
 */
