# REP Data Pipeline Task: Bronx ZIP-to-Tract Crosswalk + NTA Clustering

## Objective
Build a reproducible, deterministic Node.js/TypeScript data pipeline that creates authoritative geographic crosswalks for the REP platform, mapping Bronx ZIP codes to US Census Tracts and NTA (Neighborhood Tabulation Areas) clusters.

## Context
The Rare Renal Equity Project (REP) needs to aggregate health and structural data by neighborhood for transparent, equitable analysis. This pipeline:
- Ensures consistent geographic resolution (tract-level aggregation)
- Maintains connection to community-defined neighborhoods (NTAs)
- Supports weighted aggregation from ZIP codes (which don't align 1-to-1 with tracts)
- Produces machine-readable outputs ready for the frontend and backend APIs

---

## Scope: 26 Bronx ZIP Codes

```
10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 10460,
10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470,
10471, 10472, 10473, 10474, 10475, 10499
```

**Geographic Filter**: Bronx County (FIPS: 36005), New York State (FIPS: 36)

---

## Data Sources

### 1. **HUD USPS ZIP-TRACT Crosswalk** (Required)
- **Source**: [HUD USPS ZIP Code to ZCTA Crosswalk](https://www.hud.gov/program_offices/public_indian_housing/programs/ph/phr/about/glossary/zcta)
- **Alternative**: [HUD USPS ZIP-ZIP+4 to TRACT Crosswalk](https://www.huduser.gov/portal/datasets/lihtc.html)
- **Why**: Gold standard for health equity work; includes weights (RES_RATIO, TOT_RATIO) for aggregation
- **Key Columns**:
  - `ZIP_CODE` or `USPS_ZIP_CODE`
  - `COUNTY_FIPS`
  - `TRACT` (or `CENSUS_TRACT`)
  - `RES_RATIO` (residential weight)
  - `TOT_RATIO` (total weight)

### 2. **US Census TIGER/Line Tract Shapefile**
- **Source**: [Census Bureau TIGER/Line Download](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- **Year**: 2020 (or latest decennial)
- **State/County**: New York (36), Bronx County (36005)
- **Used For**: Tract geometry + GEOID validation
- **Key Columns**:
  - `GEOID` (20-digit: state + county + tract + block)
  - `STATEFP`, `COUNTYFP`, `TRACTCE`
  - Geometry (polygon)

### 3. **NYC DCP Neighborhood Tabulation Areas (NTAs)**
- **Source**: [NYC DCP GIS Shapefile Repository](https://www1.nyc.gov/site/planning/data-maps/open-data/districts-download-metadata.page)
- **File**: `nta_2020.shp` or `nta_2020.geojson`
- **Used For**: Neighborhood cluster assignment (spatial join)
- **Key Columns**:
  - `NTA code` (e.g., "BX35")
  - `NTA name` (e.g., "Morrisania-Melrose")
  - Geometry (polygon)

---

## Implementation Plan

### Phase 1: Data Download & Caching

**Script**: `scripts/download_sources.ts`

1. Download HUD USPS ZIP-TRACT crosswalk (if not cached)
2. Download Census TIGER tracts for NY state (if not cached)
3. Download NYC NTA boundaries (if not cached)
4. Cache in `data/raw/` with checksums or timestamps
5. Skip re-download if cache exists (document refresh frequency)

**Output**:
- `data/raw/hud_zip_tract.csv`
- `data/raw/tl_2020_36_tract.zip` (shapefile)
- `data/raw/nta_2020.geojson` or `.zip`

### Phase 2: ZIP-to-Tract Mapping

**Script**: `scripts/build_bronx_crosswalk.ts` (main orchestration)

1. Load HUD USPS ZIP-TRACT crosswalk as CSV
2. Filter for:
   - ZIP codes in our list (10451–10499)
   - County FIPS = 36005 (Bronx County)
3. Extract columns:
   - `zip`, `county_fips`, `tract`, `state_fips`, `res_ratio`, `tot_ratio`
   - Rename/standardize
4. Validate tract GEOIDs against Census TIGER data
5. Output intermediate table: `data/geo/bronx_zip_to_tracts_raw.json`

**Data Quality Checks**:
- Ensure no NULL weights
- Verify tract GEOIDs exist in TIGER data
- Flag ZIPs with no tract mapping (if any)
- Document excluded records

### Phase 3: Tract-to-NTA Mapping (Spatial Join)

**Script**: `scripts/spatial_join_tract_to_nta.ts`

1. Load Census TIGER tract geometries (Bronx County)
2. Load NYC NTA boundaries
3. For each tract:
   - Get tract centroid
   - Find NTA containing centroid (point-in-polygon)
   - Assign `nta_code` and `nta_name`
4. Handle edge cases:
   - Tracts on NTA boundaries → use centroid rule (document this)
   - Tracts not in any NTA → flag with `nta_code: "UNASSIGNED"`
5. Output tract-to-NTA lookup table

**GIS Implementation Options**:

**Option A: @turf/turf (Recommended for Node)**
```typescript
import { centroid, booleanPointInPolygon } from '@turf/turf';
import { Polygon, Point } from 'geojson';

const tractCentroid = centroid(tractFeature);
const containingNTA = ntaFeatures.find(nta =>
  booleanPointInPolygon(tractCentroid, nta)
);
```

**Option B: shapefile conversion** (if using Census shapefiles)
- Use `shapefile` npm package to convert `.shp` → GeoJSON in-memory
- Then use @turf/turf for spatial join

**Option C: CLI wrapper** (if GIS heavy)
- Document one-time conversion with `ogr2ogr` or GDAL CLI
- Store GeoJSON versions in repo (commit-friendly)

### Phase 4: Neighborhood Clustering

**Script**: `scripts/build_neighborhood_clusters.ts`

1. Load tract-to-NTA mapping from Phase 3
2. Load zip-to-tract mapping from Phase 2
3. For each unique NTA:
   - Collect all tracts with that NTA code
   - Reverse-map to all ZIPs that touch those tracts
   - Include tract count, ZIP count
4. Output: `data/geo/bronx_neighborhood_clusters.json`

**Example Output**:
```json
[
  {
    "nta_code": "BX35",
    "nta_name": "Morrisania-Melrose",
    "tract_geoids": ["36005012300", "36005012400", "36005012500"],
    "zips": ["10456", "10455"]
  }
]
```

### Phase 5: Final Output Assembly

**Script**: Main orchestration in `scripts/build_bronx_crosswalk.ts`

Combine outputs from Phases 2–4:

**A) `data/geo/bronx_zip_to_tracts.json`**
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
  }
]
```

**B) `data/geo/bronx_zip_to_tracts.csv`**
```csv
zip,county_fips,tract_geoid,state_fips,tract,weight_res,weight_tot,nta_code,nta_name
10456,36005,36005012300,36,012300,0.42,0.37,BX35,Morrisania-Melrose
```

**C) `data/geo/bronx_neighborhood_clusters.json`**
```json
[
  {
    "nta_code": "BX35",
    "nta_name": "Morrisania-Melrose",
    "tract_geoids": ["36005012300", "36005012400"],
    "zips": ["10456", "10455"]
  }
]
```

---

## Technical Requirements

### Tech Stack
- **Language**: Node.js + TypeScript
- **Package Manager**: pnpm (or npm)
- **GIS Library**: @turf/turf (recommended) or equivalent
- **Data Format**: GeoJSON, CSV, JSON
- **Build Tool**: ts-node or tsx

### Dependencies (Suggested)
```json
{
  "@turf/turf": "^6.x",
  "csv-parse": "^5.x",
  "csv-stringify": "^6.x",
  "node-fetch": "^2.x or ^3.x",
  "shapefile": "^0.6.x",
  "typescript": "^5.x"
}
```

### Repo Structure
```
scripts/
├── download_sources.ts         # Phase 1: Download & cache
├── spatial_join_tract_to_nta.ts # Phase 3: Spatial join
├── build_neighborhood_clusters.ts # Phase 4: Clustering
├── build_bronx_crosswalk.ts    # Main orchestration
├── types.ts                     # Shared TypeScript types
└── utils/                       # Helpers (fetching, validation, logging)
    ├── logger.ts
    ├── validator.ts
    ├── file-cache.ts
    └── geojson.ts

data/
├── raw/                         # Source files (git-ignored, auto-downloaded)
│   ├── hud_zip_tract.csv
│   ├── tl_2020_36_tract.zip
│   └── nta_2020.geojson
├── geo/                         # Outputs
│   ├── bronx_zip_to_tracts.json
│   ├── bronx_zip_to_tracts.csv
│   ├── bronx_neighborhood_clusters.json
│   └── README.md               # THIS FILE
└── (other datasets...)
```

---

## Runnable Command

```bash
pnpm ts-node scripts/build_bronx_crosswalk.ts
```

**Expected Output**:
```
✓ Downloading HUD crosswalk... (cached)
✓ Downloading TIGER tracts... (cached)
✓ Downloading NYC NTA boundaries... (cached)
✓ Filtering to Bronx ZIPs (26 found)
✓ Mapping ZIPs to tracts (127 tracts found)
✓ Performing spatial join tract → NTA...
✓ Building neighborhood clusters (25 NTAs)
✓ Writing bronx_zip_to_tracts.json ✓
✓ Writing bronx_zip_to_tracts.csv ✓
✓ Writing bronx_neighborhood_clusters.json ✓

Pipeline complete. Outputs in data/geo/
```

---

## Data Quality & Validation

### Checks to Implement

1. **ZIP Coverage**:
   - Warn if any ZIP has 0 tracts
   - Validate all 26 ZIPs are represented

2. **Weight Validation**:
   - Ensure `weight_res` and `weight_tot` are between 0 and 1
   - Check that weights sum reasonably (~1.0) per ZIP across tracts

3. **GEOID Format**:
   - Census GEOID format: `SSCCCTTTTTTAA` (20 digits)
   - `SS` = state FIPS, `CCC` = county FIPS, `TTTTTT` = tract code, `AA` = block group

4. **NTA Assignment**:
   - Flag any tracts with `nta_code = UNASSIGNED`
   - Document spatial join logic in output README

5. **Deduplication**:
   - Ensure no duplicate (zip, tract_geoid) pairs in output

### Testing Strategy
- Unit tests for validation functions
- Integration test: run pipeline end-to-end, verify row counts
- Manual spot-check: pick 2-3 ZIPs, verify tract mapping in Census/HUD data

---

## Determinism & Re-Runability

✅ **Source files are deterministic**:
- HUD and Census data are versioned (year specified)
- NYC NTA data is published by DCP (track version)

✅ **Caching Strategy**:
- Cache source files in `data/raw/`
- Use modification time or checksum to detect stale data
- Provide `--refresh` flag to force re-download

✅ **Output Reproducibility**:
- Deterministic sort order (by ZIP → tract)
- Seed RNG if any randomness needed (none should be)
- Document data as of specific dates/versions

**Example `.env` or config file** for version pinning:
```
# Data versions (update when sources change)
HUD_ZIP_TRACT_VERSION=Q4_2023
CENSUS_TIGER_YEAR=2020
NYC_NTA_VERSION=2020
```

---

## Security & Privacy Guardrails

⚠️ **What This Pipeline Does NOT Do**:
- ❌ Does NOT include individual-level health data
- ❌ Does NOT include names, addresses, or identifiable information
- ❌ Does NOT aggregate disease counts (that's a separate ETL)

✅ **What This Pipeline DOES**:
- ✅ Creates geographic infrastructure (crosswalk + clustering)
- ✅ Supports later aggregation with small-number suppression rules
- ✅ Maintains transparency about data sources and methods

**Future Small-Number Suppression Rules** (document in separate pipeline):
- Suppress tract-level counts if n < 5 (typical NCHS guidance)
- Suppress NTA-level counts if n < 10
- Always aggregate to tract level minimum (never ZIP level)
- Example: "In this neighborhood, we have insufficient sample size to report individual ZIP code disease rates."

---

## README Output: `data/geo/README.md`

Create this file as the canonical source of truth for the crosswalk:

```markdown
# Bronx ZIP-to-Tract Crosswalk & NTA Clustering

## Purpose
Geographic infrastructure for the Rare Renal Equity Project (REP), enabling:
1. **ZIP-to-tract mapping**: Understand how USPS service areas align with Census units
2. **Neighborhood aggregation**: Group tracts into NTA-defined communities
3. **Weighted aggregation**: Account for partial ZIP-tract overlaps using HUD weights

## Source Data

### HUD USPS ZIP-TRACT Crosswalk
- **Source**: [HUD USPS ZIP to ZCTA Crosswalk](https://www.hud.gov/...)
- **Version**: Q4 2023
- **File**: `hud_zip_tract.csv`
- **Key Columns**: `ZIP_CODE`, `COUNTY_FIPS`, `TRACT`, `RES_RATIO`, `TOT_RATIO`
- **Why Weights?**: ZIP codes and Census tracts don't align 1-to-1. The USPS can deliver mail to multiple tracts within a ZIP. Weights indicate the proportion of residents (RES_RATIO) or total households (TOT_RATIO) in each ZIP-tract pair.
- **Example**: ZIP 10456 overlaps 2 tracts:
  - Tract A (weight=0.60): 60% of ZIP 10456 residents live here
  - Tract B (weight=0.40): 40% of ZIP 10456 residents live here
- **Use**: When aggregating health data from ZIPs to tracts, multiply counts by weight to avoid double-counting.

### Census TIGER Tracts
- **Source**: [Census TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- **Year**: 2020 Decennial Census
- **Geography**: New York State → Bronx County (FIPS 36005)
- **Used For**: Tract polygon geometry + GEOID validation

### NYC DCP Neighborhood Tabulation Areas (NTAs)
- **Source**: [NYC DCP District Download](https://www1.nyc.gov/site/planning/...)
- **Year**: 2020
- **Geography**: All NYC
- **Used For**: Neighborhood cluster assignment via spatial join

## Methodology

### ZIP-to-Tract Mapping
1. Load HUD crosswalk (all US data)
2. Filter for:
   - ZIP codes in list: 10451–10475, 10499
   - County FIPS = 36005 (Bronx)
3. Output: 26 ZIPs → 127 Census Tracts (1-to-many)
4. Weights ensure accurate aggregation

### Tract-to-NTA Assignment
1. Load Census TIGER tracts (Bronx County, 36005)
2. Load NYC NTA boundaries
3. For each tract:
   - Calculate tract centroid (geographic center)
   - Find NTA containing centroid (point-in-polygon test)
   - Assign NTA code + name
4. **Boundary Rule**: If a tract centroid falls exactly on an NTA boundary, assign to the NTA where centroid falls (using @turf/turf library with standard intersection rules).

### Neighborhood Clustering
1. Group all tracts by NTA code
2. Reverse-map to ZIPs touching those tracts
3. Output: 25 NTAs with constituent tracts + ZIPs

## Files in This Directory

### `bronx_zip_to_tracts.json`
Array of ZIP-tract pairs with weights and NTA assignment.

**Schema**:
```typescript
interface ZipToTract {
  zip: string;              // "10456"
  county_fips: string;      // "36005"
  tract_geoid: string;      // "36005012300" (20-digit Census ID)
  state_fips: string;       // "36"
  tract: string;            // "012300" (6-digit tract code)
  weight_res: number;       // 0.42 (residential weight)
  weight_tot: number;       // 0.37 (total weight)
  nta_code: string;         // "BX35"
  nta_name: string;         // "Morrisania-Melrose"
}
```

### `bronx_zip_to_tracts.csv`
Same data in CSV format for Excel/SQL import.

### `bronx_neighborhood_clusters.json`
Neighborhood-level summary with constituent tracts and ZIPs.

**Schema**:
```typescript
interface NeighborhoodCluster {
  nta_code: string;         // "BX35"
  nta_name: string;         // "Morrisania-Melrose"
  tract_geoids: string[];   // ["36005012300", "36005012400"]
  zips: string[];           // ["10456", "10455"]
}
```

## How to Use

### For Frontend/API
```typescript
// Load neighborhood clusters for dropdown/map
import neighborhoods from './bronx_neighborhood_clusters.json';

neighborhoods.forEach(nta => {
  console.log(`${nta.nta_code}: ${nta.nta_name}`);
  // Output: "BX35: Morrisania-Melrose"
});
```

### For Data Aggregation
```typescript
import zipToTracts from './bronx_zip_to_tracts.json';

// Example: Aggregate disease count from ZIP-level data to tract level
const diseaseCountByZip = { '10456': 150 };

const diseaseCountByTract = {};
for (const row of zipToTracts) {
  const tractGEOID = row.tract_geoid;
  const count = diseaseCountByZip[row.zip] * row.weight_res;
  diseaseCountByTract[tractGEOID] = (diseaseCountByTract[tractGEOID] || 0) + count;
}
```

### For NTA-Level Aggregation
```typescript
import neighborhoods from './bronx_neighborhood_clusters.json';
import diseaseCountByTract from './disease_counts.json'; // Your data

const diseaseCountByNTA = {};
for (const nta of neighborhoods) {
  let count = 0;
  for (const tractGEOID of nta.tract_geoids) {
    count += diseaseCountByTract[tractGEOID] || 0;
  }
  diseaseCountByNTA[nta.nta_code] = count;
}
```

## Small-Number Suppression Guidance

When using this crosswalk to aggregate health data:

1. **Tract Level**: Suppress counts < 5 (NCHS guideline)
2. **NTA Level**: Suppress counts < 10 (larger geography, looser standard)
3. **ZIP Level**: DO NOT REPORT (always aggregate to tract minimum)
4. **Transparency**: Always note when data is suppressed

**Example**: "In NTA BX35, disease rates are based on X cases across Y neighborhoods. Smaller neighborhoods are not reported separately due to small numbers."

## Re-generation & Updates

To regenerate this crosswalk:

```bash
pnpm ts-node scripts/build_bronx_crosswalk.ts
```

This will:
1. Download source files (or use cached versions)
2. Filter to Bronx boundaries
3. Perform spatial joins
4. Output updated JSON/CSV files

**Refresh Frequency**: Annually (Census data is static; HUD updates quarterly; update ~1x/year)

## Questions & Issues

For questions about geographic methods:
- Trace data lineage: which HUD version? which Census year?
- Check `scripts/build_bronx_crosswalk.ts` for implementation details
- Review spatial join logic in `scripts/spatial_join_tract_to_nta.ts`

For validation:
- Spot-check a few ZIP codes in Census Bureau's online tools
- Verify tract counts match official Census data
- Test weighted aggregation formula on example data
```

---

## Success Criteria

✅ **Outputs Exist**:
- [ ] `data/geo/bronx_zip_to_tracts.json` (array of 100+ rows)
- [ ] `data/geo/bronx_zip_to_tracts.csv` (importable to Excel/SQL)
- [ ] `data/geo/bronx_neighborhood_clusters.json` (25 NTAs)

✅ **Data Quality**:
- [ ] All 26 ZIPs represented
- [ ] All weights between 0 and 1
- [ ] No NULL values
- [ ] No duplicate rows
- [ ] All tract GEOIDs valid (20 digits, Bronx County)
- [ ] All NTA codes + names correct

✅ **Code Quality**:
- [ ] TypeScript types for all interfaces
- [ ] Error handling + logging
- [ ] Deterministic output (same input → same output)
- [ ] <2 minute runtime on standard machine

✅ **Documentation**:
- [ ] README.md explains data + methods
- [ ] Code comments explain spatial join logic
- [ ] Script is runnable with one command
- [ ] Dependencies documented in package.json

---

## Timeline & Next Steps

1. **Week 1**: Implement data download + caching (Phase 1)
2. **Week 2**: ZIP-to-tract mapping + validation (Phase 2)
3. **Week 3**: Spatial join + NTA assignment (Phase 3)
4. **Week 4**: Clustering + output assembly + tests (Phases 4–5)
5. **Week 5**: Documentation + README + final validation

**Deliverables**:
- Fully functional pipeline script
- Three output files (JSON + CSV)
- Comprehensive README explaining data + methods
- Unit + integration tests
- Git commits documenting each phase

---

## Questions?

Refer to source documentation:
- **HUD Crosswalk**: [HUD ZIP-Code Crosswalk](https://www.huduser.gov/portal/datasets/)
- **Census TIGER**: [Census TIGER/Line Documentation](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- **NYC NTA**: [DCP GIS Data](https://www1.nyc.gov/site/planning/data-maps/open-data/districts-download-metadata.page)
- **Spatial Join Tutorial**: [@turf/turf Docs](https://turfjs.org/)

---

**Status**: Task Definition Complete
**Created**: January 29, 2026
**Next Step**: Begin Phase 1 implementation
