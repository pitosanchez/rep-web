/**
 * TypeScript types for Bronx data pipeline
 * Defines all data structures for ZIP-to-tract crosswalk + NTA clustering
 */

/**
 * HUD USPS ZIP-TRACT Crosswalk Row
 * Maps USPS ZIP service areas to Census tracts with weights
 */
export interface HudZipTractRow {
  zip_code: string;           // e.g., "10456"
  county_fips: string;         // e.g., "36005"
  tract: string;               // e.g., "012300" (6-digit)
  state_fips: string;          // e.g., "36"
  res_ratio: number;           // Residential weight (0-1)
  tot_ratio: number;           // Total weight (0-1)
}

/**
 * Census TIGER Tract Feature
 * GeoJSON feature representing a Census tract
 */
export interface CensusTractFeature {
  type: 'Feature';
  properties: {
    GEOID: string;            // 20-digit: SSCCCTTTTTTAA
    STATEFP: string;          // State FIPS
    COUNTYFP: string;         // County FIPS
    TRACTCE: string;          // Tract code (6 digits)
    ALAND: number;            // Land area (sq meters)
    AWATER: number;           // Water area (sq meters)
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any[];
  };
}

/**
 * NYC NTA Feature
 * GeoJSON feature representing a Neighborhood Tabulation Area
 */
export interface NtaFeature {
  type: 'Feature';
  properties: {
    NTA_CODE?: string;        // e.g., "BX35"
    NTA_code?: string;        // Alternative naming
    NTA?: string;             // Alternative naming
    nta_code?: string;        // Alternative naming
    NTA_NAME?: string;        // e.g., "Morrisania-Melrose"
    NTA_name?: string;        // Alternative naming
    nta_name?: string;        // Alternative naming
    ntaname?: string;         // Alternative naming
    [key: string]: any;       // Other properties
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any[];
  };
}

/**
 * Processed ZIP-to-Tract Row
 * Output from Phase 2: ZIP code mapped to tract with NTA assigned
 */
export interface ZipToTractRow {
  zip: string;               // "10456"
  county_fips: string;       // "36005"
  tract_geoid: string;       // "36005012300" (20-digit)
  state_fips: string;        // "36"
  tract: string;             // "012300" (6-digit)
  weight_res: number;        // 0.42
  weight_tot: number;        // 0.37
  nta_code: string;          // "BX35"
  nta_name: string;          // "Morrisania-Melrose"
}

/**
 * Neighborhood Cluster
 * Output from Phase 4: NTA with constituent tracts and ZIPs
 */
export interface NeighborhoodCluster {
  nta_code: string;          // "BX35"
  nta_name: string;          // "Morrisania-Melrose"
  tract_geoids: string[];    // ["36005012300", "36005012400"]
  zips: string[];            // ["10456", "10455"]
  tract_count: number;       // 2
  zip_count: number;         // 2
}

/**
 * Source File Metadata
 * Tracks download status and cache info
 */
export interface SourceFileMetadata {
  name: string;
  source_url: string;
  file_path: string;
  downloaded_at?: Date;
  file_size?: number;
  checksum?: string;
  version?: string;
}

/**
 * Pipeline Validation Result
 * Tracks data quality checks
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    total_zips: number;
    total_tracts: number;
    total_ntas: number;
    duplicate_rows: number;
    null_weights: number;
  };
}

export interface ValidationError {
  type: string;
  message: string;
  location?: string;
  value?: any;
}

export interface ValidationWarning {
  type: string;
  message: string;
  location?: string;
}

/**
 * Tract-to-NTA Mapping Result
 * Output from Phase 3: Spatial join results
 */
export interface TractToNtaMapping {
  tract_geoid: string;       // "36005012300"
  nta_code: string;          // "BX35" or "UNASSIGNED"
  nta_name: string;          // "Morrisania-Melrose" or null
  spatial_join_method: string; // "centroid" | "containment"
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Pipeline Configuration
 * Settings for the entire pipeline
 */
export interface PipelineConfig {
  // Bronx ZIP codes to process (all 26)
  bronx_zips: string[];

  // County FIPS (Bronx = 36005)
  county_fips: string;

  // State FIPS (NY = 36)
  state_fips: string;

  // Data sources
  sources: {
    hud_url: string;
    census_tiger_url: string;
    nta_url: string;
  };

  // Caching
  cache_dir: string;
  use_cache: boolean;
  cache_max_age_days?: number;

  // Output
  output_dir: string;

  // Validation
  validate_on_complete: boolean;
  min_weight_threshold: number; // 0.0001

  // Logging
  verbose: boolean;
  log_file?: string;
}

/**
 * Pipeline Progress/Status
 * Tracks execution progress
 */
export interface PipelineStatus {
  phase: number; // 1-5
  phase_name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  start_time?: Date;
  end_time?: Date;
  items_processed?: number;
  items_total?: number;
  error?: string;
}

/**
 * Final Pipeline Output
 * Complete result from all phases
 */
export interface PipelineOutput {
  zip_to_tracts: ZipToTractRow[];
  neighborhood_clusters: NeighborhoodCluster[];
  validation: ValidationResult;
  metadata: {
    created_at: Date;
    pipeline_version: string;
    data_sources: SourceFileMetadata[];
    bronx_zips_count: number;
    total_tracts_count: number;
    total_ntas_count: number;
  };
}

/**
 * Centroid Coordinate
 * [longitude, latitude] pair
 */
export type Coordinate = [number, number];

/**
 * GeoJSON Feature Collection
 * Standard GeoJSON format
 */
export interface GeoJSONFeatureCollection<T> {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: T;
    geometry: any;
  }>;
}
