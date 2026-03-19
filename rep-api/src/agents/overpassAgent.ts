/**
 * Overpass / OpenStreetMap Data Agent for REP
 *
 * Purpose: Fetch raw POI data from OpenStreetMap via Overpass API
 *
 * CRITICAL: This agent is fetch-only. It does NOT:
 * - Aggregate or count POIs
 * - Spatial join to census tracts
 * - Apply governance rules
 *
 * All OSM data flows:
 * Overpass Agent (fetch) → Backend ETL (spatial join, aggregate) → Governance Agent (check) → Frontend (display)
 *
 * Supported POI types for REP:
 * - Fast food restaurants (amenity=fast_food)
 * - Alcohol/liquor stores (shop=alcohol, shop=beverages with explicit alcohol)
 * - Grocery stores & farmers markets (shop=supermarket, shop=convenience, shop=greengrocer)
 *
 * References:
 * - Overpass API: https://overpass-api.de/
 * - OSM Amenities: https://wiki.openstreetmap.org/wiki/Key:amenity
 * - OSM Shops: https://wiki.openstreetmap.org/wiki/Key:shop
 */

import { ExternalAPIResponse } from "./types";

/**
 * Overpass API configuration
 */
const OVERPASS_API_CONFIG = {
  baseUrl: "https://overpass-api.de/api/interpreter",
  // Rate limit: max 2 requests per 10 seconds per IP
  // Add delays between requests to be respectful
  requestDelayMs: 5000,
  // Timeout for individual requests
  timeoutMs: 30000,
};

/**
 * Supported POI types for REP health equity analysis
 * Defined using Overpass QL filters
 */
const SUPPORTED_POI_TYPES = {
  fast_food: {
    description: "Fast food restaurants",
    overpassFilter: "amenity=fast_food",
    category: "burden", // Not inherently positive or negative, but relevant to diet/equity
  },
  alcohol: {
    description: "Alcohol/liquor stores",
    overpassFilter: '(shop=alcohol OR (shop=beverages AND "brewery"~"yes|only"))',
    category: "burden",
  },
  supermarket: {
    description: "Grocery stores and supermarkets",
    overpassFilter: "shop=supermarket",
    category: "asset",
  },
  farmers_market: {
    description: "Farmers markets",
    overpassFilter: "amenity=marketplace",
    category: "asset",
  },
  convenience: {
    description: "Convenience stores (may have limited fresh food)",
    overpassFilter: "shop=convenience",
    category: "mixed",
  },
  greengrocer: {
    description: "Greengrocers / produce stores",
    overpassFilter: "shop=greengrocer",
    category: "asset",
  },
  public_transport: {
    description: "Bus stops, transit stations (access indicator)",
    overpassFilter: "public_transport=stop_position",
    category: "asset",
  },
  health_clinic: {
    description: "Clinics and health facilities",
    overpassFilter: "amenity=clinic OR amenity=health_center",
    category: "asset",
  },
};

/**
 * In-memory cache for Overpass responses
 * In production, use Redis or similar
 * TTL: 30 days (OSM data changes frequently but not daily)
 */
const OVERPASS_CACHE = new Map<
  string,
  { data: unknown; timestamp: Date }
>();
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Track last request time to respect rate limits
 */
let lastRequestTime = 0;

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: Date): boolean {
  return Date.now() - timestamp.getTime() < CACHE_TTL_MS;
}

/**
 * Respect Overpass rate limiting
 * Wait if necessary before making next request
 */
async function waitForRateLimit(): Promise<void> {
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  if (timeSinceLastRequest < OVERPASS_API_CONFIG.requestDelayMs) {
    const waitTime = OVERPASS_API_CONFIG.requestDelayMs - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
}

/**
 * Fetch POI data from Overpass API for a geographic bounding box
 * Returns raw GeoJSON features (no aggregation)
 *
 * @param poiType One of the supported POI types
 * @param bbox Bounding box as [minLon, minLat, maxLon, maxLat]
 * @returns Raw Overpass API response (GeoJSON-ish)
 *
 * Example:
 *   const response = await fetchPOIData(
 *     "fast_food",
 *     [-122.3, 37.8, -122.2, 37.9]  // Oakland, CA area
 *   );
 */
export async function fetchPOIData(
  poiType: keyof typeof SUPPORTED_POI_TYPES,
  bbox: [number, number, number, number]
): Promise<ExternalAPIResponse> {
  if (!SUPPORTED_POI_TYPES[poiType]) {
    throw new Error(
      `Unsupported POI type: ${poiType}. Supported types: ${Object.keys(
        SUPPORTED_POI_TYPES
      ).join(", ")}`
    );
  }

  // Build cache key
  const cacheKey = `overpass:${poiType}:${bbox.join(",")}`;

  // Check cache
  const cached = OVERPASS_CACHE.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return {
      source: "osm",
      rawData: cached.data,
      httpStatus: 200,
      fetchedAt: cached.timestamp,
      cacheKey,
    };
  }

  // Respect rate limiting
  await waitForRateLimit();
  lastRequestTime = Date.now();

  // Build Overpass QL query
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const overpassFilter = SUPPORTED_POI_TYPES[poiType].overpassFilter;

  const overpassQuery = `
    [out:json];
    (
      node[${overpassFilter}](${minLat},${minLon},${maxLat},${maxLon});
      way[${overpassFilter}](${minLat},${minLon},${maxLat},${maxLon});
      relation[${overpassFilter}](${minLat},${minLon},${maxLat},${maxLon});
    );
    out center;
  `.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      OVERPASS_API_CONFIG.timeoutMs
    );

    const response = await fetch(OVERPASS_API_CONFIG.baseUrl, {
      method: "POST",
      body: overpassQuery,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Overpass API returned ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();

    // Cache the result
    OVERPASS_CACHE.set(cacheKey, { data, timestamp: new Date() });

    return {
      source: "osm",
      rawData: data,
      httpStatus: response.status,
      fetchedAt: new Date(),
      cacheKey,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch POI data from Overpass for bbox=${bbox.join(
        ","
      )}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Fetch multiple POI types in a single bounding box
 * Useful for comprehensive neighborhood analysis
 *
 * @param poiTypes Array of POI types to fetch
 * @param bbox Bounding box as [minLon, minLat, maxLon, maxLat]
 * @returns Map of POI type to API response
 */
export async function fetchMultiplePOITypes(
  poiTypes: (keyof typeof SUPPORTED_POI_TYPES)[],
  bbox: [number, number, number, number]
): Promise<Map<string, ExternalAPIResponse>> {
  const results = new Map<string, ExternalAPIResponse>();

  for (const poiType of poiTypes) {
    const response = await fetchPOIData(poiType, bbox);
    results.set(poiType, response);
  }

  return results;
}

/**
 * Get metadata about supported POI types
 * Used for validation and documentation
 *
 * @param poiType POI type code
 * @returns POI metadata or null if not supported
 */
export function getPOITypeMetadata(
  poiType: string
): (typeof SUPPORTED_POI_TYPES)[keyof typeof SUPPORTED_POI_TYPES] | null {
  return (
    (SUPPORTED_POI_TYPES as Record<string, unknown>)[poiType] || null
  );
}

/**
 * List all supported POI types
 * Used for UI/documentation
 *
 * @returns Array of supported POI types with descriptions
 */
export function listSupportedPOITypes(): Array<{
  code: string;
  description: string;
  category: string;
}> {
  return Object.entries(SUPPORTED_POI_TYPES).map(([code, metadata]) => ({
    code,
    description: metadata.description,
    category: metadata.category,
  }));
}

/**
 * Clear Overpass cache (for testing or manual refresh)
 */
export function clearOverpassCache(): void {
  OVERPASS_CACHE.clear();
}

/**
 * Get cache statistics (for monitoring)
 */
export function getOverpassStatistics(): {
  cacheSize: number;
  cachedQueries: string[];
} {
  return {
    cacheSize: OVERPASS_CACHE.size,
    cachedQueries: Array.from(OVERPASS_CACHE.keys()),
  };
}

/**
 * EXAMPLE: How to use this agent
 *
 * // Fetch fast food restaurants in Oakland, CA
 * const response = await fetchPOIData(
 *   "fast_food",
 *   [-122.3, 37.8, -122.2, 37.9]
 * );
 *
 * // response.rawData contains Overpass API response
 * // This is raw data: no counting, no spatial joining
 * // Pass it to backend ETL for aggregation to tracts
 *
 * // Fetch multiple POI types
 * const multiResponse = await fetchMultiplePOITypes(
 *   ["fast_food", "supermarket", "alcohol"],
 *   [-122.3, 37.8, -122.2, 37.9]
 * );
 */
