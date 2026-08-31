# Research: A real, citable transit-access/transit-burden data source for the Bronx

Date: 2026-08-31
Scope: primary-source research only. No code was changed as part of this task.

## Why this file exists

`where-we-live-site/app/api/geo/bronx-zips/route.ts` (lines ~145–147) currently computes a
`transit_burden` value with a synthetic formula:

```js
// Transit Burden: higher in residential areas with lower institutional weight
// More residential areas = more transit-dependent populations
const transitBurden = Math.min(1, Math.max(0, data.weight_res * 0.6 + (1 - data.weight_tot) * 0.4));
```

`weight_res` / `weight_tot` are residential/total population weights from the tract→ZIP
crosswalk (`rep-data/data/geo/bronx_zip_to_tracts.json`), used elsewhere in the pipeline for
metrics like disease burden. This formula has no connection to actual transit service,
ridership, or commute behavior — it's a proxy dressed up as a metric. It has already been
flagged in `where-we-live-site/lib/mapLayers.config.ts` (`id: 'transit'`, `keep: false`,
`"FLAGGED — uses same weight_tot as diseaseBurden; overlapping signal"`, `"Duplicate signal.
Hidden pending replacement with real transit data."`), and the layer is hidden from the UI
(`default_on: false`).

The tract→ZIP crosswalk (`bronx_zip_to_tracts.json`) keys rows by full 11-digit Census tract
GEOID (e.g. `36005010100`) plus `weight_res`/`weight_tot` split weights per ZIP, so **any
tract-level data source can in principle be aggregated to ZIP** using the same
weighted-aggregation pattern already used for other layers in this codebase (e.g. sum of
`tract_value * weight_res` per ZIP, or a weighted average).

This document evaluates whether a real, citable, methodologically-documented replacement
exists.

---

## Candidate 1: Census ACS — Table B08301 (Means of Transportation to Work) and B08303 (Travel Time to Work)

**Source name:** American Community Survey (ACS), U.S. Census Bureau — Detailed Tables
B08301 and B08303 (part of the B08xxx "Commuting" series).

**Granularity / Bronx coverage:**
- Published down to **census tract** and even **block group** for some commuting tables in
  the 5-year ACS, and separately at **ZCTA (ZIP Code Tabulation Area, summary level 860)**.
  ZCTAs are USPS ZIP-code-like polygons built from 2020 Census blocks
  ([census.gov ZCTA overview](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html)).
- The Census Bureau's ACS 5-year API geography endpoint for 2022 explicitly lists
  `"zip code tabulation area"` (geoLevelDisplay `860`) as a directly queryable geography with
  no additional required parameters — confirmed by fetching
  `https://api.census.gov/data/2022/acs/acs5/geography.json` directly.
- Verified empirically: Census Reporter (a Census-data front end keyed to the same published
  ACS ZCTA tables) shows real, populated data for **ZCTA 10451 (Bronx)** — population 50,942,
  mean travel time to work 42.1 minutes ± 1.2 minutes (90% CI) — confirming Bronx ZIP-level
  ACS commute data exists and is retrievable
  ([censusreporter.org/profiles/86000US10451-10451](https://censusreporter.org/profiles/86000US10451-10451/)).
  Note: Census Reporter's own page does not itself cite "B08301/B08303" by table number; that
  attribution is standard ACS table numbering, not something I independently confirmed on that
  specific page.
- 5-year ACS estimates (the vintage needed for tract/ZCTA-level reliability) are published for
  every tract, block group, and ZCTA nationally, so **all Bronx ZIP codes are covered** at
  both tract and ZCTA level.
- 1-year ACS estimates are restricted to geographies with population ≥ 65,000
  (general ACS methodology fact, not ZCTA-specific — see Design & Methodology report below);
  most individual ZCTAs, including Bronx ZIPs, fall under or near this threshold, so **5-year
  ACS is the applicable vintage**, not 1-year.

**Methodology link/citation:**
- ACS Design and Methodology, 2024 report (current edition):
  `https://www2.census.gov/programs-surveys/acs/methodology/design_and_methodology/2024/acs_design_methodology_report_2024.pdf`
  — found via Census Bureau's own methodology index page
  `https://www.census.gov/programs-surveys/acs/methodology/design-and-methodology.html`.
  URL for the PDF was returned by search but not independently opened/verified byte-for-byte
  in this session (WebFetch was used on adjacent Census methodology pages successfully, but
  not this exact file) — treat the PDF link as **likely correct but not independently
  verified**; the landing page it's linked from was found via a real Census Bureau domain.
- ACS Accuracy of the Data (margin-of-error methodology), 2022:
  `https://www2.census.gov/programs-surveys/acs/tech_docs/accuracy/ACS_Accuracy_of_Data_2022.pdf`
  (single-year) and
  `https://www2.census.gov/programs-surveys/acs/tech_docs/accuracy/MultiyearACSAccuracyofData2022.pdf`
  (5-year/multiyear) — both URLs returned directly by search against the `census.gov` /
  `www2.census.gov` domain; **not independently fetched/opened in this session**, so treat as
  "found via credible primary-domain search result, not byte-verified."
- ZCTA definition and vintage: `https://www.census.gov/programs-surveys/acs/geography-acs/geography-boundaries-by-year.html`
  — **fetched and confirmed**: this page explicitly lists "5-digit ZIP Code Tabulation Area
  (ZCTA)" as summary level 860 using 2020 Census vintage boundaries for 2024 ACS data.
- Table existence: `https://data.census.gov/table/ACSDT1Y2022.B08301` — fetched; page loads on
  the real data.census.gov domain but returned only a generic header in this fetch (client-side
  rendered app), so table-level detail wasn't independently extracted from that specific page.
  Table B08301's real-world existence and content is corroborated by multiple independent
  secondary sources (Big Ten Academic Alliance Geoportal catalog entry, Census Reporter table
  index) referencing "B08301: Means of Transportation to Work" and "B08303: Travel Time to
  Work" as standard ACS Detailed Tables.

**Access mechanism:**
- Free. Two official access paths:
  1. `data.census.gov` explorer UI — search table B08301 or B08303, filter geography to
     "ZIP Code Tabulation Area" or "Census Tract," select New York state / Bronx County
     tracts or Bronx ZCTAs.
  2. Census Bureau API (`api.census.gov/data/{year}/acs/acs5`) — free but requires a (free)
     API key for sustained/automated use; example query pattern:
     `https://api.census.gov/data/2022/acs/acs5?get=NAME,B08301_001E,B08301_010E,B08303_001E&for=zip%20code%20tabulation%20area:10451`
     (verified this endpoint is real and enforces the documented API-key requirement — a
     keyless request returned the Bureau's standard "a valid key must be included" error
     page, confirming the endpoint and auth behavior are as documented, not a dead URL).
- No licensing cost; standard Census Bureau usage/citation norms apply (public domain federal
  data).

**Margin-of-error situation at ZCTA level for Bronx-sized populations:**
NYC ZIP codes are population-dense (tens of thousands of residents each — e.g., ZCTA 10451 has
~51,000 people per Census Reporter), which is favorable for ACS reliability relative to typical
rural ZCTAs. The empirical check above showed a derived mean-commute-time MOE of only ±1.2
minutes on a 42.1-minute estimate (~3% relative error) for ZCTA 10451 — a good sign for
5-year-ACS commute estimates in dense NYC ZIPs. That said, MOEs will be visibly larger for
narrower cross-tabs within B08301 (e.g., a specific transit mode among a specific age group)
than for a broad aggregate like mean travel time; this needs to be checked per-variable when
implementing (the ACS Accuracy of the Data documents above are the primary reference for how
to compute/aggregate MOEs correctly, including combining MOEs when aggregating tract-level
values up to ZIP via the crosswalk).

**Verdict:** **Usable, either directly at ZCTA or via tract→ZIP aggregation.**
Two viable implementation paths:
1. **Direct ZCTA pull**: query B08301 (mode share, esp. `B08301_010E` = public transportation
   excluding taxicab) and/or B08303 (travel time buckets) at ZCTA geography for the 25 Bronx
   ZIP codes already in `BRONX_ZIP_COORDINATES`. Simple, but ZCTA boundaries are Census's own
   approximation of ZIP boundaries (not identical to USPS ZIP polygons), which introduces a
   small, separate boundary-approximation error from the crosswalk's tract-based one.
2. **Tract-level pull + existing crosswalk aggregation** (more consistent with the rest of the
   codebase): query B08301/B08303 at **census tract** geography for all Bronx tracts (matches
   the `tract_geoid` values already in `bronx_zip_to_tracts.json`), then aggregate to ZIP using
   the existing `weight_res`/`weight_tot` weighted-sum pattern — the same approach other layers
   in this pipeline already use. This keeps a single, consistent boundary-approximation
   methodology across all layers instead of introducing ZCTA boundaries as a second geography
   system.

Either path replaces the synthetic formula with a metric that has a real, citable federal
methodology (self-reported commute mode and travel time, ACS Design and Methodology report,
documented margins of error) and requires no new licensing agreement.

---

## Candidate 2: NYC MTA / NYC DOT open data (transit stop proximity, accessibility)

**Source name:** MTA Open Data Program (`data.ny.gov`) — specifically **MTA Subway Stations**
and **MTA Subway Stations and Complexes** datasets; separately, NYC DOT's various
transportation datasets.

**Granularity / Bronx coverage:**
- These are **point-location datasets** (station lat/long, ADA-accessibility flag, borough,
  CBD flag, GTFS Stop ID) — not a pre-computed area-level "transit access score." Confirmed via
  search results referencing:
  - `https://data.ny.gov/Transportation/MTA-Subway-Stations/39hk-dx4f`
  - `https://data.ny.gov/Transportation/MTA-Subway-Stations-and-Complexes/5f5g-n3cz`
  - `https://catalog.data.gov/dataset/mta-subway-stations` (federal data.gov mirror/catalog
    entry)
  These URLs were **returned by search, not independently fetched/opened** in this session —
  treat as "found via credible primary-domain search results (data.ny.gov / catalog.data.gov),
  not byte-verified."
- `https://www.mta.info/open-data` (the MTA's own open-data landing page) returned **HTTP 403
  Forbidden** when fetched directly in this session — the page exists (it's referenced widely
  and by the MTA's own domain) but its live content could not be verified here; bot-blocking is
  the likely cause, not a dead link.
- No area-level "transit burden" or "transit access score" dataset was found published
  directly by MTA or NYC DOT during this search. What exists is raw station-location and
  ridership data that a researcher would have to convert into an access score themselves
  (e.g., nearest-station walking distance per tract/ZIP) — there is no off-the-shelf,
  documented methodology dataset here comparable to AllTransit or ACS commute tables.

**Methodology link/citation:** None found for a pre-built access/burden score. The station
location datasets themselves are just geospatial point data (with documented fields, not a
"burden methodology").

**Access mechanism:** Free, via NY State Open Data portal (Socrata-based, `data.ny.gov`),
typically CSV/GeoJSON/API (Socrata SODA API) — standard for `data.ny.gov`/NYC Open Data
datasets, though the specific access details for these two datasets were not independently
re-verified in this session beyond the search-result descriptions.

**Verdict:** **Not directly usable as a transit-burden metric.** Would require building a new
proximity-scoring methodology from scratch (e.g., nearest-subway-stop walking-distance-buckets
per tract, aggregated to ZIP via the crosswalk) — which is exactly the kind of ad hoc,
undocumented scoring the current codebase is trying to move away from. Useful as a **future
input** to a custom access score, or as a citation for "official station locations," but not a
turnkey replacement on its own. NYC DOT's Transportation Mobility Dashboard
(`https://www.nyc.gov/html/dot/html/about/mobilityreport.shtml`, found via search, not fetched)
may be worth a follow-up look but appears citywide-dashboard-oriented rather than a
downloadable ZIP/tract-level access metric.

---

## Candidate 3: AllTransit (Center for Neighborhood Technology, CNT)

**Source name:** AllTransit™, Center for Neighborhood Technology.

**Granularity / Bronx coverage:**
- Underlying statistics are computed at **Census block group** level, then rolled up to
  larger geographies (municipality, county, CBSA, MPO, state, congressional/legislative
  districts). Confirmed by fetching `https://alltransit.cnt.org/rankings/`, which states:
  *"All statistics are aggregated from Census Block Groups."*
- The free bulk **download** product, however, is offered only at the level of "U.S. Census
  defined places" — confirmed by fetching `https://alltransit.cnt.org/data-download/`:
  *"The AllTransit Performance Score may be downloaded free of charge for all U.S. Census
  defined places."* Finer-than-place data (e.g., block group or tract extracts, which is what
  would be needed for ZIP aggregation via the existing crosswalk) falls under: *"Custom
  datasets are available for purchase for a reasonable cost"* per
  `https://alltransit.cnt.org/faq/` (fetched).
- New York City is covered: the rankings tool lists "New York-Newark-Jersey City, NY-NJ-PA" as
  a selectable metro area (confirmed via fetch of the rankings page). Bronx-specific block
  group coverage was not separately spot-checked but is implied by full metro-area coverage.
- Data vintage per the Methods page (fetched): "based on 2022 demographics and 2024 transit
  data."

**Methodology link/citation:**
- `https://alltransit.cnt.org/methods/AllTransit-Methods.pdf` — **URL confirmed to exist and
  resolve** (fetched successfully, returned a real PDF document — a genuine Adobe-produced PDF
  header was present), but the PDF's text content came back garbled/binary in this session's
  text extraction, so the methodology *details* below are drawn from the companion HTML page
  (`https://alltransit.cnt.org/methods/`, fetched successfully) rather than the PDF itself.
  Per that HTML page and corroborating search snippets: the **AllTransit Performance Score**
  combines the **Transit Connectivity Index (TCI)** ("can I get transit," a block-group-level
  measure of weekly transit trips accessible by walking) with **Jobs Accessible in a 30-Minute
  Transit Ride** ("what can I get to once I'm on transit"), rescaled 0–10 (or in some
  descriptions 1–10 for a percentile ranking), built from GTFS feeds for ~1,198 transit
  agencies nationally.
- `https://alltransit.cnt.org/about-the-data/` — surfaced by search, not independently fetched
  this session.

**Access mechanism:**
- Free web lookup/rankings tool (no data extraction).
- Free bulk download at **place-level only**, gated behind a registration form (name, email,
  organization, intended use) — confirmed via fetch of `data-download/` page.
- **Block-group-level or tract-level extracts (the granularity needed for the existing
  ZIP-crosswalk aggregation pattern) are a paid "custom dataset"** per the FAQ, priced on
  request via contact with CNT staff (named contact "Paul Esling" appeared in the FAQ content
  as of this fetch) — **not free, not self-serve**.

**Verdict:** **Not usable without a paid license, for the granularity this project needs.**
AllTransit's public, free product is scoped to "Census-defined places" (i.e., municipalities
like "New York city"), which is far too coarse to distinguish Bronx ZIP codes from each other
— it would collapse the entire Bronx into one citywide number. The block-group-level data that
*could* be aggregated to ZIP via the existing crosswalk is explicitly a paid custom product.
Given the project currently has no budget/licensing relationship with CNT (none was found in
the repo), this is not a near-term drop-in replacement, though it is a credible, well-
documented methodology if the project later decides paying for a custom extract is worthwhile.

---

## Candidate 4 (brief, optional check): NYC DCP / Furman Center (NYU) / NYC Comptroller

- **NYC Department of City Planning — "Greater Transit Zone" dataset**
  (`https://www.nyc.gov/content/planning/pages/resources/datasets/greater-transit-zone`) and
  **DCP Transit Travelshed** — both surfaced by search but returned **HTTP 403 Forbidden**
  when fetched directly in this session (nyc.gov appears to block automated fetches here), so
  **not independently verified**. Per search-result snippets only: DCP's Transit Travelshed
  shows how far a New Yorker can travel within a set time window from a given point ("jobs,
  housing, and labor force accessible within 60 minutes"); the Greater Transit Zone dataset
  encompasses "neighborhoods that are dense, proximate to public transportation, and where car
  ownership is lowest." Geography level and exact download format could not be confirmed from
  this session's search snippets alone — would need direct human access to nyc.gov or a
  non-blocked fetch path to verify further.
- **NYU Furman Center — State of the City / CoreData.nyc**
  (`https://furmancenter.org/stateofthecity/...`, `https://app.coredata.nyc/`) — per an NYU
  Wagner Rudin Center writeup (`https://wagner.nyu.edu/rudincenter/2019/01/state-transit-accessibility`,
  found via search, not fetched), a related transit-accessibility analysis measures walking
  time from block centroids to the nearest subway station, bucketed at 5/10/15/15+ minutes.
  This is block-level, not tract or ZIP, and — like the MTA/DOT candidate — would require
  custom re-aggregation; no ready-made ZIP-level file was located. Furman Center's own
  Community-District-level indicators (via CoreData.nyc / State of the City) are at **community
  district** granularity, coarser than ZIP and not a 1:1 match to the existing crosswalk's
  tract geography.
- **NYC Comptroller**: no relevant transit-access dataset was surfaced in this search pass;
  not investigated further (optional per task scope).

None of these were pursued as candidates for implementation because either (a) the primary
page could not be verified due to fetch blocking, or (b) the underlying geography (community
district, or ad hoc block-centroid walking time) doesn't cleanly fit the tract-based crosswalk
already in use, unlike ACS tract data which matches it exactly.

---

## Summary table

| Source | Granularity | Bronx covered | Methodology doc (primary) | Access | Cost | Fits existing tract→ZIP crosswalk? |
|---|---|---|---|---|---|---|
| ACS B08301/B08303 | Tract, block group (partial), **and ZCTA** | Yes | [ACS Design & Methodology 2024](https://www2.census.gov/programs-surveys/acs/methodology/design_and_methodology/2024/acs_design_methodology_report_2024.pdf) (link found, not byte-verified); [ACS geography boundaries page](https://www.census.gov/programs-surveys/acs/geography-acs/geography-boundaries-by-year.html) (fetched, confirmed) | `data.census.gov` UI or free Census API (API key required) | Free | **Yes** — tract GEOIDs match `bronx_zip_to_tracts.json` exactly |
| MTA/NYC DOT station data | Point (station-level) | Yes | None (raw location data only, no scoring methodology) | `data.ny.gov` Socrata portal | Free | No — would need custom scoring built first |
| AllTransit (CNT) | Block group (underlying); **place-level only in free download** | Yes (NYC metro listed) | [AllTransit Methods](https://alltransit.cnt.org/methods/) (fetched) / [PDF](https://alltransit.cnt.org/methods/AllTransit-Methods.pdf) (confirmed to resolve, content not extractable) | Free registration for place-level; **paid custom dataset for block-group-level** | Free (coarse) / Paid (useful granularity) | Only if paid custom extract purchased |
| NYC DCP Greater Transit Zone / Transit Travelshed | Unclear (not verified — nyc.gov blocked fetch) | Presumed yes | Not verified (403 on fetch) | Unclear | Unclear | Unknown |
| Furman Center / CoreData.nyc | Community district (coarser); underlying analysis at block level | Yes | [Rudin Center writeup](https://wagner.nyu.edu/rudincenter/2019/01/state-transit-accessibility) (found, not fetched) | Web tool / data portal | Free (tool); unclear for raw data | No — wrong geography level |

---

## Recommendation

**Use Census ACS Table B08301 (Means of Transportation to Work) and/or B08303 (Travel Time to
Work), pulled at census-tract geography via the Census API, and aggregated to ZIP using the
existing `bronx_zip_to_tracts.json` crosswalk** — the same `weight_res`/`weight_tot`
weighted-aggregation pattern already used for other layers in this pipeline.

Why this is the best candidate over the alternatives investigated:

1. **It's free, federal, and has a real published methodology** (ACS Design and Methodology
   report; ACS Accuracy of the Data / margin-of-error documentation) — unlike AllTransit's
   useful-granularity data, which requires paying CNT for a custom block-group extract.
2. **It matches the existing data pipeline's geography exactly.** The crosswalk already keys
   rows by full tract GEOID (e.g. `36005010100`); ACS tables are published at that same tract
   geography, so no new geography-matching logic is needed — just a new tract-level metric
   fed through the same aggregation step already used elsewhere in the pipeline. (A ZCTA-level
   direct pull is also possible and slightly simpler, but introduces a second, ACS-specific
   ZIP-boundary approximation alongside the crosswalk's own tract-based one; tract-level pull +
   existing crosswalk keeps one consistent approximation methodology across all layers.)
3. **It measures something real**: self-reported commute mode share (drove alone, carpool,
   public transit, walked, worked from home, etc. — from B08301) and/or travel time to work
   distribution (from B08303), both of which are legitimate, commonly-used proxies for
   transit-dependence and transit burden in the transportation-equity literature — a large
   qualitative improvement over a formula built from unrelated residential/institutional
   population weights.
4. **Bronx-sized ZCTAs showed good MOE precision** in the one directly-checked example (ZCTA
   10451: 42.1 ± 1.2 minute mean commute), which is reassuring for tract-level aggregation too,
   though per-variable MOEs (especially narrower mode-share cross-tabs) should be checked
   against the ACS Accuracy of the Data documentation during implementation, and combined
   correctly when aggregating multiple tracts into one ZIP figure.

**Concretely, next steps for implementation** (not performed as part of this research task):
pull `B08301_001E` (total workers) and the public-transportation-excluding-taxicab variable
(commonly `B08301_010E` in recent ACS vintages — confirm the exact variable code for the
vintage used) and/or `B08303` travel-time buckets, at census-tract geography for all Bronx
County (FIPS `36005`) tracts referenced in `bronx_zip_to_tracts.json`, via the Census API
(`api.census.gov/data/{year}/acs/acs5`, free API key required), then aggregate to ZIP using the
same weighted-sum/weighted-average pattern the `weight_res`/`weight_tot` fields already support
elsewhere in `where-we-live-site/app/api/geo/bronx-zips/route.ts`. This would replace the
`transitBurden` formula on lines 145–147 with a value backed by a citable, federally-documented
source, and the layer could then have its `keep: false` / `default_on: false` flags in
`where-we-live-site/lib/mapLayers.config.ts` revisited once real data is wired in.
