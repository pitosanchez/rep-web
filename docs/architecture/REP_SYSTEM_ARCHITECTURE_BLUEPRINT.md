# REP System Architecture Blueprint
## Rare Renal Equity Project
### Developer Folder Master Plan

**Project:** Rare Renal Equity Project (REP)
**Primary Purpose:** Build a living geospatial storytelling platform that maps rare renal disease, structural inequity, community assets, and patient stories.
**Initial Clinical Focus:** FSGS and APOL1-mediated kidney disease
**Core Differentiator:** REP combines neighborhood-level health and structural datasets with patient storytelling in one platform.

---

# 1. Product Definition

## REP in one sentence
REP is a living geospatial equity platform that shows how place, structural disadvantage, and lived experience shape kidney disease burden, access, and outcomes.

## What REP must do
- Render fast, interactive maps at neighborhood scale
- Integrate public datasets tied to geography
- Store and display patient stories linked to place
- Compute a REP-specific composite score: **Renal Equity Index (REI)**
- Support ongoing data updates without rebuilding the entire product
- Be usable by patients, advocates, researchers, and policy leaders

## What REP is not
- Not a static StoryMap clone
- Not a dashboard that only displays charts
- Not a pure academic research portal
- Not just a patient storytelling site without structural data

---

# 2. Technical Architecture Overview

## Recommended stack

### Front end
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **MapLibre GL JS** for map rendering
- **React Query or SWR** for client-side data fetching

### Backend / data layer
- **PostgreSQL**
- **PostGIS** for spatial queries
- **Node.js / Next.js route handlers** for API endpoints
- Optional Python ETL scripts for ingestion and preprocessing

### Infrastructure
- **Vercel** for web deployment
- **Railway / Neon / Supabase / managed Postgres** for database
- **Cloudflare or Vercel CDN caching** for tiles and APIs
- **GitHub Actions** for scheduled ETL and validation

### Mapping architecture
- **Vector tile endpoints (.mvt)** generated from PostGIS
- **MapLibre GL JS** in browser for WebGL rendering
- Separate **JSON profile endpoints** for side panels and story content

---

# 3. Core Architecture Pattern

```text
External Datasets
  → ETL / Validation / Standardization
  → PostgreSQL + PostGIS
  → Materialized Views / Summary Tables
  → Tile Endpoints (.mvt) + JSON APIs
  → CDN Cache Layer
  → Next.js + MapLibre Front End
```

## Architectural principle
Heavy geospatial layers should be served as **vector tiles**, not giant GeoJSON files.

## Why
- Smaller payloads
- Faster rendering
- Better zoom behavior
- Easier caching
- Better browser performance
- Scales for national and city-level views

---

# 4. Repository Structure

```text
rep-web/
├── README.md
├── docs/
│   ├── architecture/
│   │   ├── REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md
│   │   ├── data_dictionary.md
│   │   ├── renal_equity_index_framework.md
│   │   ├── privacy_and_governance.md
│   │   └── map_layer_spec.md
│   ├── product/
│   │   ├── mission.md
│   │   ├── user_personas.md
│   │   └── rep_storytelling_model.md
│   └── research/
│       ├── source_inventory.md
│       └── dataset_provenance.md
├── apps/web/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── map/page.tsx
│   │   ├── neighborhoods/[geoid]/page.tsx
│   │   ├── stories/[slug]/page.tsx
│   │   └── api/
│   │       ├── profile/[geoid]/route.ts
│   │       ├── stories/route.ts
│   │       ├── layers/route.ts
│   │       ├── search/route.ts
│   │       └── tiles/[layer]/[z]/[x]/[y]/route.ts
│   ├── components/
│   │   ├── map/
│   │   ├── ui/
│   │   ├── charts/
│   │   ├── stories/
│   │   └── layout/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── geo.ts
│   │   ├── cache.ts
│   │   ├── layers.ts
│   │   └── rei.ts
│   └── public/
│       └── icons/
├── packages/
│   ├── config/
│   ├── types/
│   └── ui/
├── data/
│   ├── raw/
│   ├── staging/
│   ├── processed/
│   └── exports/
├── scripts/
│   ├── etl/
│   │   ├── fetch_city_health_dashboard.py
│   │   ├── fetch_cdc_kdss.py
│   │   ├── fetch_svi.py
│   │   ├── fetch_adi.py
│   │   ├── fetch_nyc_open_data.py
│   │   └── build_rei.py
│   ├── jobs/
│   │   ├── refresh_materialized_views.sql
│   │   ├── rebuild_tiles.sql
│   │   └── validate_sources.py
│   └── seed/
│       └── seed_demo_data.ts
├── db/
│   ├── schema.sql
│   ├── migrations/
│   ├── views/
│   └── functions/
└── .github/
    └── workflows/
        ├── etl-nightly.yml
        ├── test.yml
        └── deploy.yml
```

---

# 5. Data Source Categories

## A. Health and kidney data
Primary examples:
- CDC Kidney Disease Surveillance System
- City Health Dashboard
- CMS and transplant-related sources later

## B. Structural and neighborhood context
Primary examples:
- Neighborhood Atlas (ADI)
- CDC/ATSDR Social Vulnerability Index (SVI)
- Census and ACS derived indicators

## C. Local and regional open data
Primary examples:
- NYC Open Data
- Durham / NC regional sources
- Local health, housing, transit, food, and environmental sources

## D. Storytelling and qualitative content
- Patient stories
- Audio/video transcripts
- Quote excerpts
- Story tags: FSGS, APOL1, transplant, dialysis, delayed diagnosis, housing stress, food insecurity, etc.

---

# 6. Data Model

## Core tables

### geography
Stores geographic units used by REP.

Suggested fields:
- id
- geoid
- name
- level (tract, zip, county, neighborhood, state)
- state_fips
- county_fips
- centroid
- geom
- parent_geoid

### health_metrics
Stores kidney and broader health indicators.

Suggested fields:
- id
- geoid
- metric_key
- metric_label
- value
- unit
- year
- source_name
- source_url
- methodology_notes
- confidence_label

### sdoh_metrics
Stores structural indicators.

Suggested fields:
- id
- geoid
- domain
- metric_key
- metric_label
- value
- unit
- year
- source_name
- source_url

### community_assets
Local resources tied to geography.

Suggested fields:
- id
- name
- asset_type
- address
- city
- state
- zip
- latitude
- longitude
- geoid
- verified_at
- source_name
- source_url

### patient_stories
Core storytelling table.

Suggested fields:
- id
- slug
- title
- storyteller_name
- consent_status
- diagnosis_tags
- story_format (text, audio, video, transcript)
- story_excerpt
- full_story
- neighborhood_label
- geoid
- latitude
- longitude
- published_at
- moderation_status
- visibility_level

### rei_scores
Composite Renal Equity Index values.

Suggested fields:
- id
- geoid
- year
- rei_score
- rei_percentile
- burden_class
- methodology_version
- generated_at

### rei_components
Breakdown of REI by metric.

Suggested fields:
- id
- geoid
- year
- metric_key
- normalized_value
- weight
- weighted_score
- methodology_version

---

# 7. Renal Equity Index (REI) Framework

## Goal
Create a composite score that surfaces neighborhoods where kidney burden and structural disadvantage overlap.

## Initial index domains
- Income
- Education
- Employment
- Housing
- Poverty
- Food access
- Healthcare access
- Kidney burden
- Environmental stressors
- Insurance / care continuity

## Example methodology structure
```text
REI =
  (Income Stress * 0.10) +
  (Education Burden * 0.10) +
  (Employment Instability * 0.10) +
  (Housing Instability * 0.10) +
  (Poverty Burden * 0.10) +
  (Food Access Burden * 0.10) +
  (Healthcare Access Burden * 0.10) +
  (Kidney Burden * 0.20) +
  (Environmental Stress * 0.10)
```

## Important note
The REI should be versioned.

Suggested field:
- `methodology_version`

This allows REP to evolve without breaking trust.

---

# 8. Map Layer Strategy

## Stable layers
These update slowly and should be vector-tiled and aggressively cached.

Examples:
- Census tract boundaries
- ZIP boundaries
- County boundaries
- ADI
- SVI
- poverty and income layers
- baseline food access layer

## Living layers
These update more frequently and should come from lightweight APIs.

Examples:
- patient stories
- recently added community resources
- coalition annotations
- site-submitted corrections
- emerging research tags

## Recommended initial map layers
1. Kidney burden
2. FSGS / APOL1 focus layer
3. Poverty and deprivation
4. Food environment
5. Housing instability
6. Healthcare access
7. Community assets
8. Patient stories
9. REI composite score

---

# 9. Tile Architecture

## Why REP should use vector tiles
Academic maps are often slow because they send too much data to the browser.
REP should use **Mapbox Vector Tiles (.mvt)** from PostGIS.

## Pattern
```text
PostGIS
  → ST_AsMVT / ST_AsMVTGeom
  → /api/tiles/{layer}/{z}/{x}/{y}
  → CDN cache
  → MapLibre browser rendering
```

## Example tile route
```text
/app/api/tiles/[layer]/[z]/[x]/[y]/route.ts
```

## Example layers to tile
- tracts
- counties
- rei
- adi
- svi
- food_access
- kidney_burden
- assets_points

## Do not do this
- Do not load the entire U.S. tract dataset into the browser as raw GeoJSON
- Do not embed third-party maps as the primary architecture
- Do not compute complex joins on every user click

---

# 10. JSON API Strategy

Map tiles should handle rendering.
JSON APIs should handle profiles, details, and stories.

## Core API endpoints

### Neighborhood profile
```text
GET /api/profile/[geoid]
```
Returns:
- geography metadata
- REI score
- top drivers
- selected metrics
- summary text
- story count
- nearby resources

### Stories
```text
GET /api/stories?geoid=...&diagnosis=...&format=...
```
Returns:
- story cards
- excerpts
- tags
- links

### Search
```text
GET /api/search?q=bronx
```
Returns:
- matching geographies
- stories
- assets

### Layers metadata
```text
GET /api/layers
```
Returns:
- layer definitions
- legends
- update timestamps
- source citations

---

# 11. Materialized Views and Precomputation

## Purpose
Precompute the expensive things so the user experience is fast.

## Recommended materialized views

### mv_neighborhood_profile
Prejoined profile per geography.

Includes:
- REI score
- kidney burden summary
- deprivation summary
- poverty
- food access
- resource counts
- story counts

### mv_story_counts_by_geoid
Used for fast story badge counts.

### mv_resource_counts_by_geoid
Used for asset panel summaries.

### mv_rei_rankings
Used for top/bottom ranking pages.

## Refresh schedule
- nightly for active development
- weekly/monthly for stable public deployment depending on data source cadence

---

# 12. ETL Pipeline

## ETL stages

### Stage 1: fetch
Pull files or data from source systems.

### Stage 2: validate
Check:
- schema consistency
- date integrity
- missing values
- bad coordinates
- duplicate geography IDs

### Stage 3: standardize
Normalize:
- GEOIDs
- field names
- units
- years
- text labels

### Stage 4: geospatial join
Join metrics to tract / ZIP / county geometries.

### Stage 5: compute REI
Generate normalized indicators and final score.

### Stage 6: publish
- refresh tables
- refresh materialized views
- invalidate cache
- expose updated timestamp in metadata endpoint

## Example ETL cadence
- nightly for development
- weekly for most static sources
- monthly/quarterly for official public datasets
- on submission for stories and resource edits

---

# 13. Storytelling Architecture

This is where REP separates itself from other health dashboards.

## Story model principles
- Stories are first-class entities, not decorative add-ons
- Every story can be linked to a geography
- Stories should be filterable by diagnosis, stage, theme, and location
- Story excerpts should appear in neighborhood profiles
- Stories should have moderation, consent, and visibility controls

## Story tags
Suggested tags:
- FSGS
- APOL1
- transplant
- dialysis
- delayed diagnosis
- caregiver burden
- food insecurity
- housing stress
- employment loss
- insurance barriers
- racism in care
- community support

## Story UX behavior
When a user clicks a geography, REP should show:
- score
- structural indicators
- kidney indicators
- local assets
- one or more patient voices from that place

That is the REP signature interaction.

---

# 14. Privacy, Governance, and Trust

Because REP deals with sensitive conditions and communities, trust architecture matters.

## Minimum safeguards
- n<11 suppression rules where needed
- role-based access for unpublished stories or admin layers
- audit logging for edits
- uncertainty labels when data is estimated, partial, or low-confidence
- clear source provenance
- consent workflows for patient stories
- moderation controls before public publishing

## Story privacy options
- public with name
- public anonymously
- community-visible only
- research-visible only
- private / draft

---

# 15. Performance Standards

## Target experience
REP should feel like a modern product, not a slow academic portal.

## Performance goals
- map initial load: under 3 seconds on broadband
- pan/zoom interaction: fluid and immediate
- profile panel load: under 500ms after click where possible
- cached tile response: under 200ms at edge when possible

## Performance tactics
- vector tiles, not bulk GeoJSON
- GiST spatial indexes
- materialized views
- CDN caching
- separate stable and living layers
- lazy loading for panels, charts, and media
- compressed tile responses
- simplified geometries for low zooms

---

# 16. Deployment Model

## Recommended deployment

### Web app
- Vercel

### Database
- Managed Postgres with PostGIS support
- candidates: Railway, Neon, Supabase, Render, Crunchy Bridge

### Scheduled jobs
- GitHub Actions initially
- optional migration later to more advanced orchestration if needed

### File/media storage
- story media in cloud object storage if audio/video is used

---

# 17. Phased Build Plan

## Phase 1 – MVP foundation
- Set up Next.js app
- Set up Postgres/PostGIS
- Load tract and ZIP boundaries
- Add first static datasets: SVI, ADI, kidney burden proxy metrics
- Build vector tile endpoint
- Build map with layer toggles
- Build neighborhood profile panel
- Add demo story layer

## Phase 2 – REP identity layer
- Add REI methodology v1
- Add patient story submission and moderation
- Add community assets directory
- Add filters by diagnosis and place
- Add profile pages by geography

## Phase 3 – living platform
- Add scheduled ETL jobs
- Add source metadata and update timestamps
- Add compare geographies feature
- Add coalition / researcher admin tools
- Add resource verification workflow

## Phase 4 – research and policy expansion
- Add more datasets
- Add ranking tables and trend pages
- Add downloadable methodology docs
- Add policy and advocacy storytelling modules

---

# 18. Immediate Build Priorities

## What to build first
1. Geography base tables
2. PostGIS setup
3. SVI + ADI ingestion
4. One kidney-related metric source
5. Tile endpoint for tract choropleth
6. Profile endpoint for clicked tract
7. One story linked to one tract
8. One community asset layer
9. REI v1 prototype formula

This is enough to prove the concept.

---

# 19. Developer Notes

## Guiding build rule
Every feature in REP should answer one or more of these questions:
- What is happening here?
- Why is it happening here?
- Who is experiencing it here?
- What support exists here?
- What action should happen here?

## Product rule
Data alone is not enough.
Story alone is not enough.
REP must hold both.

---

# 20. Final Architecture Summary

REP should be built as:
- a **Next.js application**
- backed by **PostgreSQL + PostGIS**
- rendered with **MapLibre GL JS**
- powered by **vector tiles for heavy map layers**
- supported by **JSON APIs for profiles, stories, and search**
- updated by **ETL pipelines and materialized views**
- differentiated by **patient storytelling linked directly to place**

That is the blueprint for building REP as a fast, living, one-of-a-kind renal equity platform.
