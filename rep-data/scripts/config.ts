/**
 * Pipeline Configuration
 * Central configuration for Bronx data pipeline
 */

import { PipelineConfig } from './types';

/**
 * All 26 Bronx ZIP codes to process
 */
export const BRONX_ZIPS = [
  '10451', '10452', '10453', '10454', '10455', '10456',
  '10457', '10458', '10459', '10460', '10461', '10462',
  '10463', '10464', '10465', '10466', '10467', '10468',
  '10469', '10470', '10471', '10472', '10473', '10474',
  '10475', '10499'
];

/**
 * Default pipeline configuration
 */
export const DEFAULT_CONFIG: PipelineConfig = {
  bronx_zips: BRONX_ZIPS,
  county_fips: '36005', // Bronx County
  state_fips: '36',     // New York State

  sources: {
    // HUD USPS ZIP-TRACT Crosswalk
    // Latest available: https://www.huduser.gov/portal/datasets/lihtc.html
    hud_url:
      'https://www.huduser.gov/sites/default/files/datasets/lihtc/zip-to-zcta.csv',

    // US Census TIGER/Line 2020 - Tracts for New York
    census_tiger_url:
      'https://www2.census.gov/geo/tiger/TIGER2020/TRACT/tl_2020_36_tract.zip',

    // NYC DCP Neighborhood Tabulation Areas (NTA 2020)
    nta_url:
      'https://data.cityofnewyork.us/api/geospatial/kwyp-6h3f?method=export&format=GeoJSON'
  },

  cache_dir: 'data/raw',
  use_cache: true,
  cache_max_age_days: 30,

  output_dir: 'data/geo',

  validate_on_complete: true,
  min_weight_threshold: 0.0001,

  verbose: true
};

/**
 * Phase-specific configurations
 */
export const PHASE_CONFIG = {
  phase1: {
    name: 'Download & Cache Sources',
    timeout_ms: 60000 // 60 seconds per download
  },
  phase2: {
    name: 'ZIP-to-Tract Mapping',
    validate_weights: true,
    min_weight: 0.0001
  },
  phase3: {
    name: 'Spatial Join (Tract → NTA)',
    spatial_join_method: 'centroid', // Use tract centroid for NTA assignment
    confidence_threshold: 'medium'
  },
  phase4: {
    name: 'Neighborhood Clustering',
    min_tracts_per_nta: 0 // Allow NTAs with 0 tracts (edge case)
  },
  phase5: {
    name: 'Output Assembly & Validation',
    output_formats: ['json', 'csv']
  }
};

/**
 * Data source filenames in cache
 */
export const CACHED_FILES = {
  hud_zip_tract: 'hud_zip_tract.csv',
  census_tiger: 'tl_2020_36_tract.zip',
  census_tiger_geojson: 'tl_2020_36_tract.geojson',
  nta_geojson: 'nta_2020.geojson'
};

/**
 * Output filenames
 */
export const OUTPUT_FILES = {
  zip_to_tracts_json: 'bronx_zip_to_tracts.json',
  zip_to_tracts_csv: 'bronx_zip_to_tracts.csv',
  neighborhood_clusters_json: 'bronx_neighborhood_clusters.json',
  tract_to_nta_mapping: 'bronx_tract_to_nta_mapping.json',
  validation_report: 'bronx_validation_report.json',
  readme: 'README.md'
};

/**
 * Default output templates
 */
export const TEMPLATES = {
  // README template for data/geo/README.md
  readme: `# Bronx ZIP-to-Tract Crosswalk & NTA Clustering

## Purpose
Geographic infrastructure for the Rare Renal Equity Project (REP).

## Files
- **bronx_zip_to_tracts.json** - Complete ZIP-to-tract mapping with NTA assignment
- **bronx_zip_to_tracts.csv** - Same data in CSV format
- **bronx_neighborhood_clusters.json** - NTA-level summary with constituent tracts + ZIPs

## Data Sources
- HUD USPS ZIP-TRACT Crosswalk (Q4 2023)
- US Census TIGER/Line 2020 Tracts
- NYC DCP Neighborhood Tabulation Areas (2020)

## Methodology
See README in repo root for full documentation.

## Generated
{{GENERATED_AT}}
`
};
