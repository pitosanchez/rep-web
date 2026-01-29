# Bronx Data Pipeline

Building a reproducible, deterministic data pipeline for geographic data infrastructure in the REP platform.

## Overview

This pipeline creates authoritative geographic crosswalks for the Rare Renal Equity Project (REP), mapping 26 Bronx ZIP codes to US Census Tracts and NYC Neighborhood Tabulation Areas (NTAs).

**Goal**: Transform raw geographic data sources into machine-readable, validated outputs ready for the REP frontend and backend APIs.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run the Full Pipeline

```bash
npm run pipeline
# or
pnpm ts-node scripts/build_bronx_crosswalk.ts
```

### Run Individual Phases

```bash
# Phase 1: Download & cache sources
npm run pipeline:download

# Phase 2: ZIP-to-tract mapping
# (Not yet runnable independently)

# Phase 3: Spatial join (tract → NTA)
npm run pipeline:spatial-join

# Phase 4: Neighborhood clustering
npm run pipeline:cluster
```

## Pipeline Structure

### 5 Sequential Phases

```
Phase 1: Download & Cache Sources
    ↓
    [Downloads HUD, Census TIGER, NYC NTA data]
    ↓
Phase 2: ZIP-to-Tract Mapping
    ↓
    [Filters HUD crosswalk for Bronx ZIPs, adds weights]
    ↓
Phase 3: Spatial Join (Tract → NTA)
    ↓
    [Assigns each tract to containing NTA via centroid test]
    ↓
Phase 4: Neighborhood Clustering
    ↓
    [Groups tracts by NTA, reverse-maps to ZIPs]
    ↓
Phase 5: Output Assembly & Validation
    ↓
    [Writes JSON/CSV, validates data quality]
    ↓
DONE: data/geo/ directory with 3 files + README
```

## File Structure

```
scripts/
├── types.ts                       # TypeScript interfaces for all data
├── config.ts                      # Configuration + constants
├── build_bronx_crosswalk.ts      # Main orchestration (Phase 1-5)
├── download_sources.ts            # Phase 1: Download & cache
├── spatial_join_tract_to_nta.ts  # Phase 3: Spatial join
├── build_neighborhood_clusters.ts # Phase 4: Clustering
├── utils/
│   ├── logger.ts                  # Logging utility
│   ├── file-cache.ts             # File caching utility
│   └── validator.ts              # Data validation utilities
└── README.md                      # This file

data/
├── raw/                           # Downloaded source files (cached)
│   ├── hud_zip_tract.csv
│   ├── tl_2020_36_tract.zip
│   ├── tl_2020_36_tract.geojson
│   └── nta_2020.geojson
└── geo/                           # Outputs
    ├── bronx_zip_to_tracts.json
    ├── bronx_zip_to_tracts.csv
    ├── bronx_neighborhood_clusters.json
    └── README.md
```

## Data Sources

### 1. HUD USPS ZIP-TRACT Crosswalk

- **Source**: [HUD User Portal](https://www.huduser.gov/portal/datasets/)
- **Latest**: Q4 2023
- **Format**: CSV
- **Key Columns**:
  - `ZIP_CODE` → `zip`
  - `COUNTY_FIPS` → `county_fips`
  - `TRACT` → `tract` / `tract_geoid` (6-digit or 20-digit)
  - `RES_RATIO` → `weight_res` (residential weight)
  - `TOT_RATIO` → `weight_tot` (total weight)

**Why HUD?**: Gold standard for health equity work. Includes weights for proper aggregation from ZIPs (which don't align 1-to-1 with tracts).

### 2. US Census TIGER/Line Tracts

- **Source**: [Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- **Year**: 2020 Decennial Census
- **Format**: Shapefile (we convert to GeoJSON)
- **Geometry**: Polygon (tract boundaries)
- **Filter**: New York State (36), Bronx County (36005)

**Why TIGER?**: Authoritative tract boundaries and geometry for spatial joins.

### 3. NYC DCP Neighborhood Tabulation Areas (NTA)

- **Source**: [NYC DCP OpenData](https://data.cityofnewyork.us/)
- **Year**: 2020
- **Format**: GeoJSON
- **Geometry**: Polygon (NTA boundaries)

**Why NTA?**: Community-defined neighborhoods used by NYC planning + health agencies.

## Configuration

See `config.ts` for:
- List of 26 Bronx ZIP codes
- Data source URLs
- Cache directory + settings
- Output directory + filenames
- Validation thresholds

## Key Concepts

### ZIP-to-Tract Mapping

ZIP codes and Census tracts don't align 1-to-1. The USPS ZIP code service area often overlaps multiple tracts.

**Solution**: HUD provides weights showing what fraction of each ZIP lives in each tract.

Example:
- ZIP 10456 overlaps 2 tracts:
  - Tract `36005012300`: RES_RATIO = 0.60 (60% of ZIP residents)
  - Tract `36005012400`: RES_RATIO = 0.40 (40% of ZIP residents)

When aggregating health data from ZIP level to tract level, multiply by weight to avoid double-counting.

### Spatial Join: Tract → NTA

NTA is assigned via centroid-based point-in-polygon test:

1. Calculate tract centroid (geographic center)
2. Find which NTA polygon contains that point
3. Assign NTA code + name to tract

**Edge Case**: If tract centroid falls on NTA boundary, assign to the NTA containing the centroid (standard geometric rule).

### Neighborhood Clustering

Group tracts by their assigned NTA:

```json
{
  "nta_code": "BX35",
  "nta_name": "Morrisania-Melrose",
  "tract_geoids": ["36005012300", "36005012400", ...],
  "zips": ["10456", "10455", ...],
  "tract_count": 2,
  "zip_count": 2
}
```

## Output Files

### `bronx_zip_to_tracts.json`

Complete ZIP-to-tract mapping with NTA assignment.

```json
[
  {
    "zip": "10456",
    "county_fips": "36005",
    "tract_geoid": "36005012300",
    "state_fips": "36",
    "tract": "012300",
    "weight_res": 0.42,
    "weight_tot": 0.37,
    "nta_code": "BX35",
    "nta_name": "Morrisania-Melrose"
  },
  ...
]
```

**Use**: Weighted aggregation of health data from ZIP to tract level.

### `bronx_zip_to_tracts.csv`

Same data in CSV format (for Excel/SQL import).

### `bronx_neighborhood_clusters.json`

NTA-level summary with constituent tracts + related ZIPs.

```json
[
  {
    "nta_code": "BX35",
    "nta_name": "Morrisania-Melrose",
    "tract_geoids": ["36005012300", "36005012400"],
    "zips": ["10456", "10455"],
    "tract_count": 2,
    "zip_count": 2
  },
  ...
]
```

**Use**: Neighborhood-level aggregation + API endpoints.

## Validation

The pipeline validates data quality at each phase:

- ✓ ZIP code format (5 digits)
- ✓ FIPS codes (2-5 digits)
- ✓ GEOID format (20 digits for tracts)
- ✓ Weights are between 0 and 1
- ✓ No duplicate ZIP-tract pairs
- ✓ No null weights
- ✓ All expected ZIPs are represented
- ✓ All NTA codes are valid

**Output**: `bronx_validation_report.json` with error details.

## Development

### Adding a New Utility

1. Create file in `scripts/utils/`
2. Export class + interfaces in `scripts/types.ts`
3. Import in orchestration script

### Modifying Pipeline Logic

Edit the phase-specific scripts:

- `download_sources.ts` → Phase 1
- `scripts/` (TBD) → Phase 2
- `spatial_join_tract_to_nta.ts` → Phase 3
- `build_neighborhood_clusters.ts` → Phase 4
- Main orchestration → Phase 5

### Testing Locally

```bash
# Check types
npx tsc --noEmit scripts/

# Lint
npm run lint scripts/

# Run with verbose logging
NODE_ENV=development npm run pipeline
```

## Troubleshooting

### Download fails

Check if data sources are accessible:
```bash
curl -I https://www.huduser.gov/...
```

Alternative sources documented in `config.ts`.

### Centroid calculation is wrong

Ensure Census TIGER geometries are properly parsed as GeoJSON.

### Memory issues

Reduce batch processing size if handling large GeoJSON files.

## Future Enhancements

- [ ] Shapefile-to-GeoJSON conversion in-script
- [ ] Progressive data loading for large files
- [ ] Export to PostGIS database
- [ ] Interactive visualization of spatial joins
- [ ] Automated tests for each phase
- [ ] CI/CD integration

## References

- [HUD ZIP-TRACT Documentation](https://www.huduser.gov/)
- [Census TIGER/Line Overview](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- [NYC DCP Planning Database](https://data.cityofnewyork.us/)
- [@turf/turf Documentation](https://turfjs.org/)
- [Small-Number Suppression Guide](https://www.census.gov/content/dam/Census/library/publications/2017/acs/acs_general_handbook_2017_ch07.pdf)

## Status

✅ Phase 1: Download & Cache - IMPLEMENTED
🚧 Phase 2: ZIP-to-Tract Mapping - IN PROGRESS
⏳ Phase 3: Spatial Join - STUBBED
⏳ Phase 4: Clustering - STUBBED
⏳ Phase 5: Output Assembly - STUBBED

## Next Steps

1. Complete Phase 2: ZIP-to-tract mapping logic + CSV parsing
2. Implement Phase 3: Spatial join using @turf/turf
3. Implement Phase 4: Clustering logic
4. Implement Phase 5: Output writing + validation
5. End-to-end testing + documentation updates
