/**
 * Geospatial Type Definitions
 *
 * This file contains type definitions for GeoJSON and geographic data.
 * Currently uses 'any' in some places for flexibility during MVP phase.
 *
 * Phase 2: Migrate to stricter typing with type guards and discriminated unions.
 * See: scripts/calculate_zip_centroids.ts for example GeoJSON generation.
 */

/**
 * GeoJSON Point geometry (most common in our use cases)
 */
export type PointGeometry = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

/**
 * Polygon geometry for ZIP boundaries
 */
export type PolygonGeometry = {
  type: 'Polygon';
  coordinates: [number, number][][];
};

/**
 * Union of geometry types we use
 */
export type GeoJSONGeometry = PointGeometry | PolygonGeometry;

/**
 * ZIP Code Feature with typed properties
 * Use this for API responses where possible
 */
export interface ZipCodeFeature {
  type: 'Feature';
  id: string;
  properties: {
    zip: string;
    nta_code: string;
    nta_name: string;
    weight_res: number;
    weight_tot: number;
    exposure_index?: number;
    transit_burden?: number;
  };
  geometry: PointGeometry;
}

/**
 * GeoJSON Feature Collection (standard format)
 * Currently allows any feature type; will be narrowed in Phase 2
 */
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: ZipCodeFeature[];
}

/**
 * Partially typed GeoJSON for APIs that return mixed data
 * Use this when exact structure isn't known yet
 * Migrate to ZipCodeFeature when structure is confirmed
 */
export type PartiallyTypedGeoJSON = {
  type: 'FeatureCollection';
  features: Array<unknown>; // Will be typed in Phase 2
};

/**
 * Type guard to check if a feature is a ZipCodeFeature
 * Use this to safely access properties at runtime
 *
 * @example
 * const features = await fetch('/api/geo/bronx-zips').then(r => r.json());
 * for (const feature of features.features) {
 *   if (isZipCodeFeature(feature)) {
 *     console.log(feature.properties.zip);
 *   }
 * }
 */
export function isZipCodeFeature(feature: unknown): feature is ZipCodeFeature {
  return (
    typeof feature === 'object' &&
    feature !== null &&
    'type' in feature &&
    feature.type === 'Feature' &&
    'properties' in feature &&
    'geometry' in feature &&
    typeof (feature as any).properties === 'object' &&
    'zip' in (feature as any).properties &&
    'nta_name' in (feature as any).properties
  );
}

/**
 * Represents coordinates in [longitude, latitude] order
 * Strongly prefer this over [number, number] for clarity
 *
 * @example
 * const bronxCenter: LatLngCoordinates = [-73.9, 40.85];
 */
export type LatLngCoordinates = readonly [longitude: number, latitude: number];

/**
 * Neighborhood data returned from /api/geo/neighborhood-profile
 * Matches NeighborhoodProfile in components/pages/NeighborhoodPage.tsx
 */
export interface NeighborhoodData {
  zip: string;
  nta_code: string;
  nta_name: string;
  city: string;
  state: string;
  tractCount: number;
  residentialWeight: number;
  totalWeight: number;
  tracts: string[];
  burdenIndex: number;
  avgTravel: number;
  exposureIndex: number;
}

/**
 * API Response wrapper for geographic data
 * Standardized response format across all /api/geo/* endpoints
 */
export interface GeoAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Phase 2 roadmap:
 * - [ ] Create isNeighborhoodData type guard
 * - [ ] Create discriminated union for GeoJSON feature types
 * - [ ] Add Polygon/MultiPolygon support with type narrowing
 * - [ ] Replace 'any' in MapLibre layers with ZipCodeFeature
 * - [ ] Create API response validator with zod/superstruct
 */
