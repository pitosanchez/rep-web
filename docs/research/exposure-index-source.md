# Research: Is there a real, citable environmental exposure data source to replace the placeholder `exposure_index` formula?

**Date:** 2026-08-31
**Scope:** `where-we-live-site/app/api/geo/bronx-zips/route.ts` (~lines 140-143)
**Researcher:** Claude (background research agent)

## Executive Answer

**Yes, a usable named/citable source exists — but it is not EPA EJScreen.** As of this research (August 2026), EPA pulled EJScreen from its official website in February 2025 and it has not been restored (a lawsuit over the removal was dismissed for lack of standing in March 2026); no unofficial reconstruction (e.g., PEDP/EJAM) qualifies as a *primary, agency-published* source. The strongest currently-live, primary, methodology-documented candidates are:

1. **CDC/ATSDR Environmental Justice Index (EJI)** — a live, federally maintained, census-tract-level index with an explicit "Environmental Burden" module (PM2.5, ozone, diesel PM, air toxics cancer risk, proximity to hazards/traffic/rail/airports) and published technical documentation. It covers all U.S. census tracts, including the Bronx.
2. **NYC DOHMH NYC Community Air Survey (NYCCAS)**, distributed via the **NYC Environment & Health Data Portal** — a live, city-agency-maintained, real pollutant-monitoring program (PM2.5, black carbon, NO, NO2, O3, SO2) with modeled estimates published down to **Neighborhood Tabulation Area (NTA)** and UHF-neighborhood granularity, with a published sampling/methodology appendix. This is directly relevant because the codebase already carries `nta_code`/`nta_name` per ZIP in `bronx_zip_to_tracts.json`, meaning NYCCAS's NTA-level output could plug in with comparatively little new crosswalk engineering.

Neither source publishes natively at ZIP/ZCTA granularity — both require an aggregation step (tract→ZIP population-weighted crosswalk for EJI; NTA→ZIP mapping, which the codebase already has, for NYCCAS). Both are strictly better than the current formula, which uses only latitude and an unrelated population weight and contains no real environmental measurement.

---

## 1. EPA EJScreen — Status: Officially Withdrawn (Not Currently a Live Primary Source)

- **Official name / version at last publication:** EJScreen, most recently version 2.2 (some downstream reconstructions cite 2.3), built on ACS 2018–2022 5-year estimates.
- **Current status (verified August 2026):** EPA removed EJScreen — the tool, its landing/download pages, and its ArcGIS REST services — from `epa.gov` on **February 5, 2025**, following the January 2025 revocation of Executive Order 12898 (the 1994 EJ mandate). `https://www.epa.gov/ejscreen` now returns HTTP 404, and `ejscreen.epa.gov` no longer resolves (`getaddrinfo ENOTFOUND` confirmed directly during this research). A federal lawsuit challenging the removal (filed April 15, 2025) was dismissed on standing grounds on March 13, 2026. EPA has not republished an official successor tool as of this writing.
- **Granularity (as last officially published):** Census block group, with results also aggregate-able to tract/county/state. EJScreen did **not** publish natively at ZCTA.
- **Indicators (as last officially published):** PM2.5, ozone, diesel particulate matter, air toxics cancer risk, respiratory hazard index, traffic proximity and volume, proximity to Superfund/RMP/hazardous waste facilities, wastewater discharge, lead paint indicator, underground storage tanks — combined into EJ indexes with demographic factors.
- **Methodology citation:** The last EPA-hosted, agency-published methodology page is preserved only in EPA's own archival snapshot infrastructure: `https://19january2021snapshot.epa.gov/ejscreen/fact-sheet-about-ejscreen_.html` (an EPA-run archive of a pre-2021 site state; it links to a "2020 EJSCREEN Fact Sheet" PDF). This is the most recent EPA-branded methodology reference confirmed reachable during this research. The live `epa.gov/ejscreen` page and the `ejscreen.epa.gov` toolset/technical documentation are gone.
- **Bronx coverage (historically):** Yes — EJScreen was nationwide, block-group level, and included all NYC/Bronx census geography while it was live.
- **Assessment:** EJScreen cannot currently be cited as a live, EPA-published, fetchable data source. It should **not** be represented in this codebase as "sourced from EPA EJScreen" unless the project deliberately uses a frozen historical extract with a clear provenance note (e.g., last officially archived 2.2 vintage), because the canonical live service no longer exists and status is politically contested/in flux.

## 2. CDC/ATSDR Environmental Justice Index (EJI) — Status: Live, Primary, Recommended

- **Official name:** Environmental Justice Index (EJI), maintained by ATSDR's Geospatial Research, Analysis, and Services Program (GRASP).
- **Landing page:** `https://www.atsdr.cdc.gov/place-health/php/eji/index.html`
- **Granularity:** Census tract (the EJI's stated unit of analysis; ranks all U.S. census tracts — cited as 71,000+ tracts nationally). No native ZCTA aggregation is published by CDC/ATSDR.
- **Indicators (Environmental Burden Module, confirmed via `https://www.atsdr.cdc.gov/place-health/php/eji/eji-indicators.html`):** Ozone, PM2.5, diesel particulate matter, air toxics cancer risk; plus proximity/hazard indicators — National Priority List (Superfund) sites, Toxic Release Inventory sites, Treatment/Storage/Disposal facilities, Risk Management Plan facilities, coal/lead mines, high-volume roads, railways, airports, and pre-1980 housing (lead paint proxy). These are combined with a Social Vulnerability Module and a Health Vulnerability Module into an overall ranked EJI score.
- **Methodology citation:**
  - Documentation index: `https://www.atsdr.cdc.gov/place-health/php/eji/eji-technical-documentation.html`
  - 2024 Technical Documentation (PDF): `https://atsdr.cdc.gov/place-health/media/pdfs/2024/10/EJI_2024_Technical_Documentation.pdf`
  - 2022 Technical Documentation (PDF): `https://www.atsdr.cdc.gov/place-health/media/pdfs/2024/07/EJI-2022-Documentation-508.pdf`
  - Data download page: `https://www.atsdr.cdc.gov/place-health/php/eji/eji-data-download.html`
- **Bronx coverage:** Yes — EJI is a national, all-census-tract tool; Bronx County (Bronx, NY) tracts are included as part of standard national coverage. (Coverage was confirmed structurally — nationwide, all-tract — rather than by pulling the Bronx-specific rows from the downloadable dataset in this pass.)
- **Currency/live status confirmed:** The technical documentation page and indicators page were fetched directly during this research and are live (last updated December 2024 per page metadata), unlike EJScreen.

## 3. NYC DOHMH — NYC Community Air Survey (NYCCAS) — Status: Live, Primary, Recommended (Best Fit for This Codebase)

- **Official name:** New York City Community Air Survey (NYCCAS), a NYC DOHMH / Queens College (CUNY) collaboration running since 2008 — the largest sustained urban air-monitoring program of any U.S. city.
- **Publishing home:** NYC Environment & Health Data Portal, `https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/nyccas/`, with a dedicated Air Quality data explorer at `https://a816-dohbesp.nyc.gov/IndicatorPublic/data-explorer/air-quality/` and a "Your Neighborhood's Air Quality" lookup at `https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/neighborhood-air-quality/`. Also indexed under `https://www.nyc.gov/site/doh/data/data-sets/air-quality-nyc-community-air-survey.page` (this page returned HTTP 403 to automated fetch during this research, likely bot-blocking; it is the canonical human-facing nyc.gov landing page).
- **Granularity:** NYCCAS combines direct monitoring (routine sites plus dedicated Environmental Justice sites, sampled seasonally at street level) with a land-use regression model to produce **modeled surface estimates**, which the Data Portal publishes downloadable at multiple aggregation levels, confirmed during this research to include **Neighborhood Tabulation Area (NTA)** (downloadable as `aqe-nta.csv`) and **UHF neighborhood**, in addition to citywide and Community District averages reported in the annual report appendices. It does not publish natively at ZIP/ZCTA or raw census-tract level, but NTA is a fine enough unit that it nests far more cleanly against NYC administrative geography than census tracts do against ZCTAs.
- **Indicators:** Fine particulate matter (PM2.5), black carbon, nitric oxide (NO), nitrogen dioxide (NO2), ozone (O3), sulfur dioxide (SO2), plus regulatory PM2.5 monitoring and air-quality action-day counts.
- **Methodology citation:**
  - Program/report overview: `https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/nyccas/`
  - Sampling Methodology and Data Sources for Emissions Indicators (Appendix 1, PDF — the primary methodology document): `https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/nyccas/pdf/Appendix1.pdf`
- **Bronx coverage:** Confirmed — the NYCCAS annual report materials explicitly discuss Bronx locations (e.g., Hunts Point) as monitored areas with elevated pollution burden from warehouse/truck traffic density, and the borough is included in the standard citywide 60–150-site seasonal sampling design.
- **Relevance to this codebase:** `bronx_zip_to_tracts.json` (consumed by `route.ts`) already carries `nta_code` and `nta_name` per ZIP. NYCCAS's NTA-level published output is therefore a much closer engineering fit than tract-level EJI/EJScreen data, since the ZIP→NTA relationship the app already has could plausibly map directly to NYCCAS's NTA output without needing a population-weighted tract crosswalk (subject to validating exactly which NTA vintage/boundary set both datasets use).

## 4. Other Sources Considered

- **NYS DEC — Potential Environmental Justice Areas (PEJA) mapper / DAC (Disadvantaged Communities) criteria:** Live (`https://dec.ny.gov/get-involved/environmental-justice/gis-tools`, `https://dec.ny.gov/maps/interactive-maps/decinfo-locator`), but defined at **census tract** granularity, built from 2014–2018 ACS demographic/poverty data rather than direct pollutant measurement, and oriented toward a designation/eligibility flag (disadvantaged or not) rather than a continuous exposure score. Documented in `https://climate.ny.gov/-/media/Project/Climate/Files/Disadvantaged-Communities-Criteria/2023-DAC-Maps-Version-1.pdf`. Secondary candidate only — weaker on "environmental exposure index" specifically since it's demographic/burden-designation focused, not a pollution-concentration index.
- **PEDP/EJAM (unofficial EJScreen reconstruction):** Explicitly not a primary agency source — a third-party (Public Environmental Data Partners) rebuild of EPA's discontinued data (`https://screening-tools.com/epa-ejscreen`, `http://pedp-ejscreen.azurewebsites.net/`). Useful as a stopgap only if the project is comfortable citing "EPA EJScreen v2.3 data, republished by Public Environmental Data Partners" with that caveat prominently disclosed; not recommended as the primary citation.

---

## Recommendation

**Use CDC/ATSDR EJI and/or NYC DOHMH NYCCAS to replace the placeholder formula; do not cite EPA EJScreen as a live source given its current withdrawal.** A blended approach is reasonable: NYCCAS for a real, NYC-specific, multi-pollutant physical exposure signal (best geographic fit given the existing NTA fields), and/or EJI for a nationally-consistent, tract-level cumulative burden score if cross-borough/cross-city comparability is ever needed.

### Why either is usable
- Both are agency-maintained, versioned, and have citable methodology documents (unlike the current formula, which has none — it derives "environmental burden" purely from a ZIP's latitude and an unrelated population weight).
- Both include Bronx-relevant pollutants that plausibly correlate with real environmental exposure (PM2.5, NO2, ozone, diesel PM, air toxics, traffic proximity) rather than a geographic proxy.
- Both are re-fetchable/refreshable (NYCCAS: NYC Data Portal, updated with each survey cycle; EJI: CDC/ATSDR, versioned releases such as 2022/2024).

### Concrete engineering steps

**Option A — NYCCAS via NTA (recommended first, least new plumbing):**
1. Pull the current NTA-level NYCCAS extract (`aqe-nta.csv` or equivalent from the Air Quality data explorer) for PM2.5, NO2, and O3 at minimum.
2. Verify the NTA boundary/vintage used by NYCCAS matches (or is crosswalkable to) the `nta_code` values already present in `bronx_zip_to_tracts.json` — NYC has revised NTA boundaries (NTA2020) since the original 2010-vintage NTAs, so confirm which vintage each dataset uses before joining.
3. Join on `nta_code` in `route.ts`'s existing `zipMap` construction — for ZIPs that only partially cover an NTA, or NTAs split across multiple ZIPs, decide whether to take the NTA's direct value (simplest) or population-weight across ZIP fragments (more correct if more than one NTA touches a ZIP).
4. Normalize the chosen pollutant(s) to a 0–1 index (e.g., min-max or percentile rank across all NYC NTAs, not just Bronx, so the scale is meaningful) and replace `exposureIndex`'s computation with this real value; drop the `latitudeFactor` term entirely.
5. Store provenance (NYCCAS survey year, pollutant(s) used, methodology URL) alongside the computed field so the UI/API can cite its source.

**Option B — CDC/ATSDR EJI via tract→ZIP crosswalk (more general, more engineering):**
1. Download EJI tract-level data (via `eji-data-download.html`) filtered to Bronx County (FIPS 36005) tracts, pulling the Environmental Burden Module score (or the specific PM2.5/ozone/diesel-PM/air-toxics sub-indicators).
2. Since ZCTAs do not nest cleanly inside census tracts, apply a population-weighted tract-to-ZCTA (or tract-to-ZIP) crosswalk — e.g., HUD's tract-to-ZIP or the Census Bureau's tract-to-ZCTA relationship files — to weight each tract's contribution to a ZIP score by residential population share.
3. Aggregate the weighted tract scores per ZIP, normalize to 0–1, and use as (or blended with) `exposureIndex`.
4. This path is more defensible for consistency/comparability outside NYC but requires building and maintaining the crosswalk step that NTA-based NYCCAS mostly avoids.

Either option is a straightforward `next engineering task`-sized effort (data pull + join/crosswalk + normalization), not a research blocker — the missing piece was a real data source, and this research identifies two live, well-documented ones.

---

## Sources

- https://www.epa.gov/ejscreen (fetched; returns HTTP 404 — confirms EJScreen page removal)
- https://19january2021snapshot.epa.gov/ejscreen/fact-sheet-about-ejscreen_.html (fetched; EPA archival snapshot of pre-2021 EJScreen fact sheet page)
- https://ejscreen.epa.gov/mapper/ (fetch attempted; domain does not resolve — confirms tool is fully offline)
- https://envirodatagov.org/epa-removes-ejscreen-from-its-website/ (searched; EDGI tracking of EJScreen removal, Feb 5, 2025)
- https://eelp.law.harvard.edu/tracker/epa-added-environmental-health-indicators-to-ejscreen/ (searched; Harvard EELP federal EJ tracker, lawsuit dismissal March 13, 2026)
- https://www.sej.org/headlines/epa-removes-ejscreen-its-website-not-web (searched)
- https://screening-tools.com/epa-ejscreen (searched; PEDP unofficial EJScreen reconstruction)
- https://www.atsdr.cdc.gov/place-health/php/eji/index.html (fetched; EJI overview, live)
- https://www.atsdr.cdc.gov/place-health/php/eji/eji-indicators.html (fetched; EJI Environmental Burden Module indicators)
- https://www.atsdr.cdc.gov/place-health/php/eji/eji-technical-documentation.html (fetched; confirms live, links 2022/2024 technical documentation)
- https://atsdr.cdc.gov/place-health/media/pdfs/2024/10/EJI_2024_Technical_Documentation.pdf (found via search; 2024 EJI Technical Documentation PDF)
- https://www.atsdr.cdc.gov/place-health/media/pdfs/2024/07/EJI-2022-Documentation-508.pdf (found via search; 2022 EJI Technical Documentation PDF)
- https://www.atsdr.cdc.gov/place-health/php/eji/eji-data-download.html (fetched; EJI data download page, live)
- https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/nyccas/ (fetched; NYCCAS program/report overview, NYC DOHMH Environment & Health Data Portal)
- https://a816-dohbesp.nyc.gov/IndicatorPublic/data-explorer/air-quality/ (fetched; NYC air quality data explorer — indicators list, NTA/UHF geography)
- https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/neighborhood-air-quality/ (fetched; NTA-level lookup tool and `aqe-nta.csv` download reference)
- https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/nyccas/pdf/Appendix1.pdf (found via search; NYCCAS Appendix 1 — Sampling Methodology and Data Sources for Emissions Indicators, primary methodology PDF)
- https://www.nyc.gov/site/doh/data/data-sets/air-quality-nyc-community-air-survey.page (fetch attempted; returned HTTP 403 to automated fetch — canonical human-facing NYCCAS landing page on nyc.gov, cited for reference)
- https://dec.ny.gov/get-involved/environmental-justice/gis-tools (searched; NYS DEC EJ GIS tools index)
- https://dec.ny.gov/maps/interactive-maps/decinfo-locator (searched; NYS DECinfo Locator)
- https://climate.ny.gov/-/media/Project/Climate/Files/Disadvantaged-Communities-Criteria/2023-DAC-Maps-Version-1.pdf (searched; NYS Climate Justice Working Group DAC criteria)
