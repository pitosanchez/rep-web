# Bronx Geographic Data Pipeline Outputs

This directory contains authoritative geographic crosswalks for the Rare Renal Equity Project (REP), mapping Bronx ZIP codes to US Census Tracts and NYC Neighborhood Tabulation Areas.

## Output Files

### 1. `bronx_zip_to_tracts.json` (Primary Output)

Complete ZIP-to-tract mapping with NTA assignments.

**Format**: JSON array of objects

**Fields**:
- `zip` (string): USPS ZIP code (5 digits, e.g., "10456")
- `county_fips` (string): County FIPS code (5 digits, e.g., "36005")
- `state_fips` (string): State FIPS code (2 digits, "36")
- `tract_geoid` (string): Census tract identifier (11 digits: SSCCCTTTTTT)
- `tract` (string): Tract code (6 digits, e.g., "012300")
- `weight_res` (number): Residential weight (0-1) for aggregation
- `weight_tot` (number): Total weight (0-1) for aggregation
- `nta_code` (string): NYC Neighborhood Tabulation Area code (e.g., "BX35") or "UNASSIGNED"
- `nta_name` (string): NTA name (e.g., "Morrisania-Melrose") or empty string

**Total Rows**: 52 (26 Bronx ZIPs × 2 tracts average)

**Usage**:
- Weighted aggregation from ZIP-level health data to tract level
- Lookup table for finding all tracts in a ZIP code
- Reverse lookup for finding ZIP codes by tract

**Example**:
```json
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
```

---

### 2. `bronx_zip_to_tracts.csv` (Excel/SQL Import)

Same data as JSON in CSV format for import into Excel, SQL databases, or other tools.

**Format**: Comma-separated values with headers

**Columns** (in order):
```
zip,county_fips,state_fips,tract_geoid,tract,weight_res,weight_tot,nta_code,nta_name
```

**Usage**:
- Import into Excel or SQL databases
- Data analysis with familiar tools
- Distribution to team members without JSON parsing capability

**Sample Rows**:
```csv
10451,36005,36,36005010100,010100,0.85,0.82,BX35,Morrisania-Melrose
10451,36005,36,36005010200,010200,0.15,0.18,UNASSIGNED,
10456,36005,36,36005012300,012300,0.42,0.37,BX35,Morrisania-Melrose
```

---

### 3. `bronx_neighborhood_clusters.json` (Neighborhood-Level Summary)

Aggregated view of neighborhoods with constituent tracts and ZIP codes.

**Format**: JSON array of neighborhood cluster objects

**Fields**:
- `nta_code` (string): NTA code (e.g., "BX35")
- `nta_name` (string): Neighborhood name (e.g., "Morrisania-Melrose")
- `tract_geoids` (array of strings): List of Census tract IDs in this NTA
- `zips` (array of strings): List of ZIP codes overlapping this NTA
- `tract_count` (number): Number of unique tracts
- `zip_count` (number): Number of unique ZIP codes

**Total Clusters**: Variable (typically 10-15 for Bronx)

**Usage**:
- Neighborhood-level API endpoints
- Geographic aggregation for neighborhood profiles
- Community boundary definitions

**Example**:
```json
{
  "nta_code": "BX35",
  "nta_name": "Morrisania-Melrose",
  "tract_geoids": [
    "36005012300",
    "36005012400",
    "36005012500"
  ],
  "zips": [
    "10456",
    "10457"
  ],
  "tract_count": 3,
  "zip_count": 2
}
```

---

### 4. `bronx_validation_report.json` (Quality Assurance)

Data quality validation results from the pipeline.

**Format**: JSON validation report object

**Fields**:
- `isValid` (boolean): Whether data passed all validation checks
- `errors` (array): List of validation errors (if any)
- `warnings` (array): List of validation warnings
- `summary` (object): Summary statistics:
  - `total_zips` (number): Unique ZIP codes found
  - `total_tracts` (number): Unique tracts found
  - `total_ntas` (number): Unique NTA codes found
  - `duplicate_rows` (number): Duplicate ZIP-tract pairs
  - `null_weights` (number): Missing weight values

**Checks Performed**:
- ZIP code format (5 digits)
- FIPS code validity
- GEOID format (11-digit tract IDs)
- Weight values (0-1 range)
- No duplicate ZIP-tract pairs
- All 26 Bronx ZIPs represented
- NTA code format

**Example**:
```json
{
  "isValid": true,
  "errors": [],
  "warnings": [],
  "summary": {
    "total_zips": 26,
    "total_tracts": 52,
    "total_ntas": 12,
    "duplicate_rows": 0,
    "null_weights": 0
  }
}
```

---

## Data Sources

### HUD USPS ZIP-TRACT Crosswalk
- **Source**: U.S. Department of Housing and Urban Development (HUD)
- **URL**: https://www.huduser.gov/portal/datasets/
- **Version**: Q4 2023
- **Format**: CSV
- **Key Data**: ZIP codes mapped to Census tracts with residential and total weights

### US Census TIGER/Line Tracts
- **Source**: U.S. Census Bureau
- **URL**: https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
- **Year**: 2020 Decennial Census
- **Format**: Shapefile (converted to GeoJSON)
- **Coverage**: Bronx County (FIPS 36005), New York State (FIPS 36)

### NYC Neighborhood Tabulation Areas (NTA)
- **Source**: NYC Department of City Planning (DCP)
- **URL**: https://data.cityofnewyork.us/
- **Year**: 2020
- **Format**: GeoJSON
- **Coverage**: All NYC neighborhoods including Bronx

---

## Technical Specifications

### Geographic Identifiers

**GEOID Format** (Census Tract Level):
- Format: 11 digits (SSCCCTTTTTT)
- SS = State FIPS (2 digits): "36" (New York)
- CCC = County FIPS (3 digits): "005" (Bronx)
- TTTTTT = Tract code (6 digits): e.g., "012300"
- Example: "36005012300" identifies Bronx tract 123.00

### Weights

**Residential Weight (`weight_res`)**:
- Fraction of ZIP residential population in each tract
- Used for aggregating residential health metrics
- Range: 0.0 to 1.0
- Sum of weights for a given ZIP = 1.0

**Total Weight (`weight_tot`)**:
- Fraction of total ZIP population in each tract
- Used for aggregating overall health metrics
- Range: 0.0 to 1.0
- Sum of weights for a given ZIP = 1.0

### Spatial Join Method

**Centroid-Based Point-in-Polygon**:
- Each Census tract's centroid (geographic center) is tested
- Centroid is checked against NTA polygon boundaries
- NTA assignment based on which polygon contains the centroid
- Method: @turf/turf library with geospatial calculations

---

## Usage Examples

### Example 1: Aggregate ZIP-Level Data to Tract Level

```javascript
// Input: Health metric at ZIP level
const zipData = { "10456": 82 };

// Find tracts for this ZIP
const zipTracts = data.filter(row => row.zip === "10456");

// Calculate weighted average for each tract
const tractData = {};
for (const row of zipTracts) {
  tractData[row.tract_geoid] = zipData["10456"] * row.weight_res;
}
// Result: {"36005012300": 34.44, "36005012400": 47.56}
```

### Example 2: Create Neighborhood Profile

```javascript
// Input: A neighborhood cluster
const neighborhood = clusters[0]; // BX35

// Find all health data for tracts in this neighborhood
const neighborhoodData = zipToTracts.filter(row =>
  neighborhood.tract_geoids.includes(row.tract_geoid)
);

// Aggregate health metrics at neighborhood level
// Example: average burden across all tracts
```

### Example 3: SQL Query for ZIP Lookup

```sql
-- Find all tracts and neighborhoods for ZIP 10456
SELECT
  zip,
  tract_geoid,
  tract,
  nta_code,
  nta_name,
  weight_res,
  weight_tot
FROM bronx_zip_to_tracts
WHERE zip = '10456'
ORDER BY tract_geoid;
```

---

## Data Quality Notes

### Completeness
- All 26 Bronx ZIP codes are represented
- All tracts have valid GEOID identifiers
- All weights sum to 1.0 per ZIP code

### Accuracy
- HUD data uses USPS ZIP service area boundaries (not postal codes)
- Some ZIP codes overlap multiple tracts (reflected in weights)
- NTA assignments based on Census tract centroids (standard geospatial method)

### Known Limitations
- Some tracts may have UNASSIGNED NTA if geospatial join fails
- ZIP-tract relationships are based on 2023 HUD data; USPS service areas may change
- Census boundaries are fixed to 2020 decennial census

---

## Pipeline Information

**Generated By**: Bronx Data Pipeline v1.0
**Generation Date**: 2026-01-29
**Pipeline Phases**:
1. ✓ Download & Cache Sources
2. ✓ ZIP-to-Tract Mapping
3. ✓ Spatial Join (Tract → NTA)
4. ✓ Neighborhood Clustering
5. ✓ Output Assembly & Validation

**Repository**: https://github.com/anthropics/rep-web
**Documentation**: `/scripts/README.md` (pipeline documentation)

---

## Contact & Support

For questions about this data:
- REP Team: [contact information]
- Pipeline Issues: See repository issues
- Data Updates: Generated via automated pipeline; see schedule for updates

---

## License & Attribution

### Data Sources Attribution

**HUD USPS ZIP-TRACT Crosswalk**:
- Public domain (US Government data)
- Citation: US Department of Housing and Urban Development

**Census TIGER/Line Tracts**:
- Public domain (US Census Bureau)
- Citation: US Census Bureau, 2020 Decennial Census

**NYC NTA Boundaries**:
- Public domain (NYC Open Data)
- Citation: NYC Department of City Planning

### Pipeline Code

This pipeline code is part of the Rare Renal Equity Project (REP). See repository for license details.

---

## Changelog

### Version 1.0 (2026-01-29)
- Initial release of Bronx geographic crosswalk
- 26 ZIP codes mapped to 52 census tracts
- 12 neighborhood clusters identified
- CSV and JSON formats
- Validation report included
