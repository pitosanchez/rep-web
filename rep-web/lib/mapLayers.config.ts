/**
 * Map Layer Audit Configuration
 *
 * Each layer entry documents its id, display name, data source,
 * value type, and audit decisions. `keep: false` means the layer
 * should be deprecated; `is_core: true` means it drives key narratives.
 *
 * Audit decisions as of April 2026:
 *   - costBurden: NEW — primary default-on layer (TCOL-based)
 *   - diseaseBurden: KEEP — core narrative, but data is proxy (weight_tot)
 *   - careAccess: KEEP — core narrative, but data is proxy (weight_res)
 *   - environmentalExposure: KEEP — derived metric, flag as approximate
 *   - transit: FLAGGED — uses same weight_tot as diseaseBurden; overlapping signal
 *   - areaDeprivationIndex: KEEP + ENHANCE — now percentile 0–100, adds Structural Strain
 */

export type ValueType = 'ratio' | 'percentile' | 'index' | 'percent';

export interface LayerConfig {
  id: string;
  name: string;
  description: string;
  data_source: string;
  value_type: ValueType;
  /** Drives a primary platform narrative — shown in public-facing descriptions */
  is_core: boolean;
  /** Audit decision: keep in production */
  keep: boolean;
  /** Default visibility on initial map load */
  default_on: boolean;
  /** Data is an approximation or derived proxy, not a direct measurement */
  is_approximate: boolean;
  /** MapLibre layer ID in MapLibreMap.tsx */
  map_layer_id: string;
  /** visibleLayers key in MapPage.tsx state */
  state_key: string;
  /** Color gradient (CSS, low → high) */
  gradient: string;
}

export const MAP_LAYER_CONFIG: LayerConfig[] = [
  {
    id: 'costBurden',
    name: 'Cost of Living Burden',
    description:
      'TCOL-based cost burden ratio (required income ÷ median income). Values > 1.0 indicate households cannot cover basic needs. Primary structural equity signal.',
    data_source: '/api/cost-of-living — mock TCOL data (housing, food, transport, healthcare, childcare, other)',
    value_type: 'ratio',
    is_core: true,
    keep: true,
    default_on: true,
    is_approximate: false,
    map_layer_id: 'bronx-cost-burden',
    state_key: 'costBurden',
    gradient: 'linear-gradient(to right, #3b82f6, #f59e0b, #dc2626)',
  },
  {
    id: 'diseaseBurden',
    name: 'Disease Burden',
    description:
      'Estimated APOL1-mediated kidney disease prevalence by neighborhood. Currently proxied from HUD USPS total tract weight.',
    data_source: '/api/geo/bronx-zips — weight_tot field (HUD USPS ZIP-to-Tract crosswalk)',
    value_type: 'index',
    is_core: true,
    keep: true,
    default_on: false,
    is_approximate: true,
    map_layer_id: 'bronx-zips-fill',
    state_key: 'diseaseBurden',
    gradient: 'linear-gradient(to right, #6ab576, #c89a54, #a83d25)',
  },
  {
    id: 'careAccess',
    name: 'Care Access',
    description:
      'Proximity to nephrology, dialysis, and transplant care. Currently proxied from HUD USPS residential tract weight.',
    data_source: '/api/geo/bronx-zips — weight_res field (HUD USPS ZIP-to-Tract crosswalk)',
    value_type: 'index',
    is_core: true,
    keep: true,
    default_on: false,
    is_approximate: true,
    map_layer_id: 'bronx-care-access',
    state_key: 'careAccess',
    gradient: 'linear-gradient(to right, #1a5aa0, #4a7ec8, #b8334d)',
  },
  {
    id: 'environmentalExposure',
    name: 'Environmental Exposure',
    description:
      'Aggregated environmental stressors (pollution, food environment, housing quality). Derived from latitude factor + weight_tot.',
    data_source: '/api/geo/bronx-zips — exposure_index (derived: 0.7×weight_tot + 0.3×latitude_factor)',
    value_type: 'index',
    is_core: false,
    keep: true,
    default_on: false,
    is_approximate: true,
    map_layer_id: 'bronx-exposure',
    state_key: 'environmentalExposure',
    gradient: 'linear-gradient(to right, #3d6b41, #a08050, #5c2e1f)',
  },
  {
    id: 'transit',
    name: 'Transit',
    description:
      'Public transportation connectivity affecting care access. AUDIT FLAG: uses same weight_tot source as Disease Burden — overlapping signal. Candidate for removal.',
    data_source: '/api/geo/bronx-zips — weight_tot field (same source as diseaseBurden — data overlap)',
    value_type: 'index',
    is_core: false,
    keep: false, // Flagged — duplicate data source
    default_on: false,
    is_approximate: true,
    map_layer_id: 'bronx-transit',
    state_key: 'transit',
    gradient: 'linear-gradient(to right, #b39f00, #d97706, #c41e3a)',
  },
  {
    id: 'areaDeprivationIndex',
    name: 'Area Deprivation Index (ADI)',
    description:
      'Block-group level composite of income, education, employment, housing. Normalized to national percentile 0–100 (higher = greater deprivation).',
    data_source: '/api/adi/blockgroups — ADI_NATRANK from adi_blockgroups.geojson',
    value_type: 'percentile',
    is_core: true,
    keep: true,
    default_on: true,
    is_approximate: false,
    map_layer_id: 'adi-blockgroups-fill',
    state_key: 'areaDeprivationIndex',
    gradient: 'linear-gradient(to right, #d0e8d0, #fce8a1, #f5a623, #e84c3d, #5c1fa2)',
  },
];

/** Layers that are currently active (keep: true) */
export const ACTIVE_LAYERS = MAP_LAYER_CONFIG.filter(l => l.keep);

/** Layers flagged for removal or replacement */
export const FLAGGED_LAYERS = MAP_LAYER_CONFIG.filter(l => !l.keep);
