# Where We Live — Full Platform Build Summary
**Rare Renal Equity Project (REP)**  
**Built by:** Robert Pito Sanchez  
**Date:** April 2026  
**Live site:** https://rep-web-wine.vercel.app/

---

## What This Platform Is

**Where We Live** is a public accountability platform that maps how *where you live* shapes kidney disease outcomes — specifically APOL1-mediated kidney disease and FSGS, two conditions that disproportionately affect Black communities in the Bronx.

The core argument: these diseases are not primarily genetic destiny. They are geography and justice problems. Structural factors — where you can afford to live, whether you can get to a doctor, what the air is like, how much your rent costs — shape who gets sick and who survives.

The platform does three things:
1. **Maps** neighborhood-level structural burden across all 26 Bronx ZIP codes
2. **Collects stories** from patients and caregivers tied to their ZIP code
3. **Analyzes those stories** with AI to extract structural signals, which feed back into the map

Everything is anonymous. Everything is aggregated to the neighborhood level. No individual health data is ever stored or displayed.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, TypeScript strict mode)
- **MapLibre GL JS** — open-source interactive maps
- **next-intl** — full English/Spanish internationalization
- All styling is inline React styles — no Tailwind, no CSS modules
- Design tokens: `#c45a3b` terracotta · `#1a1a1a` near-black · `#faf7f3` warm cream · `#fff` white
- Typography: Georgia serif for headings/quotes · system-ui sans-serif for body/labels

### Backend
- **PostgreSQL** via lazy-initialized `pg` Pool (Proxy pattern for Vercel build safety)
- **Python / FastAPI** — AI signal extraction microservice (`rep-python/`)
- **Anthropic Claude** — reads community stories and extracts 12 structural signals per story
- **Next.js API routes** — all in `rep-web/app/api/`

### Infrastructure
- **Vercel** — auto-deploys from `main` branch
- **GitHub Actions** — build, TypeScript lint, ESLint, security scan (npm audit + CodeQL) on every push
- **Neon/Railway** — managed PostgreSQL

### Data Sources
- HUD USPS ZIP-to-Census Tract crosswalk (residential and total weights for 26 Bronx ZIPs)
- Census TIGER/Line tract geometries
- NYC DCP Neighborhood Tabulation Areas (NTAs)
- MIT Living Wage Calculator 2024 (cost of living benchmarks)
- ACS 2022 5-year estimates (median household income by ZIP)
- University of Wisconsin NNHC Area Deprivation Index 2022
- CDC CKD Fact Sheet March 2026 + 2023 (kidney disease statistics)

---

## Repository Structure

```
rep-web/
├── rep-web/                      # Next.js frontend + API
│   ├── app/
│   │   ├── [locale]/             # EN/ES locale routing
│   │   └── api/
│   │       ├── geo/
│   │       │   ├── bronx-zips/           # GeoJSON for all 26 ZIP codes
│   │       │   ├── zip-to-tracts/        # ZIP → tract crosswalk
│   │       │   ├── neighborhood-profile/ # WWLI + structural data per ZIP
│   │       │   └── neighborhood-clusters/
│   │       ├── adi/
│   │       │   ├── blockgroups/          # Block-group ADI GeoJSON
│   │       │   └── route.ts              # ZIP-level ADI with percentile normalization
│   │       ├── cost-of-living/           # TCOL cost breakdown per ZIP
│   │       ├── neighborhood-summary/     # Aggregated cost + ADI + SSI
│   │       └── stories/
│   │           ├── route.ts              # POST — story submission
│   │           ├── by-zip/               # GET stories for a ZIP
│   │           ├── signals-by-zip/       # GET AI signal averages for a ZIP
│   │           └── aggregate/
│   ├── components/
│   │   ├── REPWireframe.tsx              # Root app — page state machine
│   │   ├── Navigation.tsx                # Fixed nav + language switcher
│   │   ├── MapLibreMap.tsx               # Interactive map (6 layers)
│   │   ├── LanguageSwitcher.tsx          # EN/ES toggle
│   │   ├── NeighborhoodCostDashboard.tsx # Reusable cost breakdown widget
│   │   └── pages/
│   │       ├── HeroPage.tsx
│   │       ├── MapPage.tsx
│   │       ├── NeighborhoodPage.tsx
│   │       ├── StoriesPage.tsx
│   │       ├── AboutPage.tsx
│   │       ├── MethodsPage.tsx
│   │       ├── KidneyDiseasePage.tsx
│   │       ├── Apol1Page.tsx
│   │       └── FsgsPage.tsx
│   ├── lib/
│   │   ├── db.ts                  # PostgreSQL pool (lazy Proxy pattern)
│   │   ├── signalUtils.ts         # SBI weighted formula
│   │   ├── storyZipMapping.ts     # ZIP → neighborhood name fallbacks
│   │   └── mapLayers.config.ts    # Layer audit config
│   └── messages/
│       ├── en.json                # English translations
│       └── es.json                # Spanish translations
│
├── rep-python/                    # AI signal extraction service
│   ├── app/main.py                # FastAPI app
│   └── migrations/                # PostgreSQL schema migrations
│
├── rep-data/                      # Geographic data pipeline
│   ├── scripts/                   # TypeScript ETL scripts
│   └── data/geo/                  # Crosswalk JSON outputs
│
└── docs/                          # Technical documentation
```

---

## All Pages — What Each Does

### 1. Hero / Home (`HeroPage.tsx`)
The mission statement page. Three editorial pillars: Map the Data → Share Stories → Build Accountability. CTAs to the map and stories. Mobile-responsive with the platform's full editorial design language.

### 2. Map Explorer (`MapPage.tsx` + `MapLibreMap.tsx`)
Full-viewport interactive MapLibre GL map of the Bronx with floating glass panel UI.

**Six map layers** (toggleable):
| Layer | Default | Data Source | Color Scale |
|---|---|---|---|
| Cost of Living Burden | ON | TCOL cost_burden_ratio | Blue → Amber → Red |
| Area Deprivation Index | ON | ADI_NATRANK block groups | Green → Yellow → Purple |
| Disease Burden | OFF | weight_tot (HUD proxy) | Green → Terracotta |
| Care Access | OFF | weight_res (HUD proxy) | Blue → Red |
| Environmental Exposure | OFF | Derived metric | Green → Brown |
| Transit | OFF | weight_tot (flagged duplicate) | Gold → Red |

Clicking any ZIP dot opens the Neighborhood Profile. Hover tooltip shows cost burden ratio badge, residential weight, total weight, and exposure index. The bottom bar shows selected neighborhood name with a "View Full Profile" CTA.

### 3. Neighborhood Profile (`NeighborhoodPage.tsx`)
The most data-dense page. Opens when a user clicks a ZIP code dot on the map. Four sections:

**Section A — Header**
- Neighborhood name (NTA), ZIP code, census tract count
- Where We Live Index (WWLI) arc gauge (0–100)
- Structural Weight and Residential Burden breakdown pills
- Color-coded border: green (lower) / amber (moderate) / terracotta (high)

**Section B — Cost of Living** *(built this session)*
Plain-language cost breakdown. No indexes. Dollars.
- Headline: *"To cover the basics, a family here needs $X every month"*
- Three comparison cards side by side: This Neighborhood vs. NYC Average vs. U.S. Average
- Each card shows: monthly cost total, typical income, an income bar (how far it stretches toward the cost), and a plain-language gap badge
- Stacked color bar breakdown: Rent · Childcare · Food · Healthcare · Getting Around · Other Basics
- Red callout when income gap exists: *"In Mott Haven, a family is $2,505 short every single month — just to cover the basics. That's not because people aren't working..."*
- Source footnote: MIT Living Wage 2024 + ACS 2022

**Section C — What People Here Are Dealing With** *(rebuilt this session)*
The structural burden section — now in plain language with charts.
- Human headline: *"The pressures that show up in stories from [neighborhood]"*
- **Donut chart** — 4 colored slices for the 4 burden categories; center shows overall burden score; ghost state when no stories yet
- **Category legend** — mini bars for each of the 4 groups:
  - 🔴 Money & Stability (money stress, insurance, food access)
  - 🔵 Getting Medical Care (reaching doctors, systems blocking care)
  - 🟢 Where You Live (pollution, housing, neighborhood safety)
  - 🟣 Life Circumstances (mental health, education, justice, social support)
- **Four signal cards** — one per category, each showing its individual signals with:
  - Plain names (*"Can't reach a doctor"* not *"healthcare_access"*)
  - One sentence explaining what the signal actually means in real life
  - Bar colored green/amber/red by signal strength
  - Contextual label: *"Comes up often in stories from here"* / *"Mentioned in some"* / *"Rarely mentioned"*
  - When no data: shows what the signal measures + "Be the first to share a story" CTA

**Section D — Community Voices**
Stories submitted from this ZIP. Cards with role badge, condition tag, and full story text. Ethics note explaining anonymization.

### 4. Stories (`StoriesPage.tsx`)
Community story submission form + immersive reading view.
- Controlled form fields: ZIP code, role (patient/caregiver/family/provider), condition, story text, consent checkbox
- `POST /api/stories` → stores to PostgreSQL → triggers Python AI analysis → Claude extracts 12 signals → stored in `story_signals` table
- Featured story cards + standard grid
- Full-screen immersive reading view on card click

### 5. About (`AboutPage.tsx`)
Editorial chapter layout. Mission, origin story, methodology overview, team.

### 6. Methods (`MethodsPage.tsx`)
Data transparency documentation. Explicit about what the data shows and what it does not show. Every metric includes its limitations.

### 7. Kidney Disease (`KidneyDiseasePage.tsx`)
Redesigned with CDC March 2026 + 2023 Fact Sheet data. All light backgrounds.
- 37 million Americans stat hero section
- Racial disparity horizontal bar chart (SVG, inline)
- ESKD causes donut chart + treatment split donut chart (SVG polar coordinate math)
- CKD stage progression bars (6 stages, color-coded)
- All data sourced and cited

### 8. APOL1 (`Apol1Page.tsx`)
Deep dive on APOL1-mediated kidney disease — the genetic variant at the center of the platform's thesis. Explains the science without genetic determinism.

### 9. FSGS (`FsgsPage.tsx`)
Focal Segmental Glomerulosclerosis — cause, progression, treatment access, structural factors.

---

## Core Indices & Formulas

### Where We Live Index (WWLI)
```
WWLI = (weight_tot × 100 × 0.60) + (weight_res × 100 × 0.40)
```
- Derived from HUD USPS ZIP-to-Census Tract crosswalk
- `weight_tot` = total tract burden concentration
- `weight_res` = residential share of the tract
- Tiers: 0–33 lower · 34–66 moderate · 67–100 high

### Structural Burden Index (SBI)
Weighted average of 12 AI-extracted signal dimensions from community stories:
- Economic Instability (20%) · Insurance Instability (15%) · Food Environment (10%)
- Healthcare Access (20%) · Structural Barriers (10%)
- Environmental Exposure (10%) · Neighborhood Safety (5%)
- Education/Literacy (5%) · Justice System (5%) · Mental Health (5%)
- Social Support (2.5%) · Substance Use (2.5%)

### Structural Strain Index (SSI) — new
```
cost_norm = clamp((cost_burden_ratio - 0.7) / (2.5 - 0.7), 0, 1)
SSI = (cost_norm × 0.55) + (adi_percentile / 100 × 0.45) × 100
```
- Combines cost burden (55%) and area deprivation (45%)
- 0–100 scale · Tiers: 0–33 lower · 34–66 moderate · 67–100 high

---

## AI Signal Extraction Pipeline

1. User submits a story via `POST /api/stories`
2. Story stored in PostgreSQL `stories` table
3. Next.js API route calls Python FastAPI service: `POST PYTHON_SERVICE_URL/analyze-story`
4. Python service sends story text to Anthropic Claude with a structured prompt
5. Claude reads the story for 12 structural dimensions, returns scores (0.0–1.0) per dimension
6. Scores stored in `story_signals` table linked to the story and ZIP code
7. `GET /api/stories/signals-by-zip?zip=` averages all signal scores for that ZIP
8. SBI score is computed from the weighted average formula
9. Displayed on the Neighborhood Profile — individual stories are never scored in isolation

**12 dimensions Claude reads for:**
Money stress · Insurance gaps · Food environment · Healthcare access · Structural barriers · Environmental exposure · Neighborhood safety · Education/literacy · Justice system contact · Mental health · Social support · Substance use context

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/geo/bronx-zips` | GET | GeoJSON FeatureCollection — all 26 Bronx ZIPs with coordinates + derived metrics |
| `/api/geo/zip-to-tracts` | GET | ZIP → census tract crosswalk with HUD weights |
| `/api/geo/neighborhood-profile?zip=` | GET | WWLI score, structural weight, residential burden, tier |
| `/api/adi/blockgroups` | GET | Block-group GeoJSON with ADI_NATRANK |
| `/api/adi?geo_id=` | GET | ZIP-level ADI with national percentile 0–100 |
| `/api/cost-of-living?geo_id=` | GET | TCOL monthly cost breakdown + income gap + burden ratio |
| `/api/neighborhood-summary?geo_id=` | GET | Aggregated cost + ADI + Structural Strain Index (SSI) |
| `/api/stories` | POST | Submit a community story |
| `/api/stories/by-zip?zip=` | GET | All stories for a ZIP code |
| `/api/stories/signals-by-zip?zip=` | GET | AI signal averages + SBI score for a ZIP |
| `/api/stories/aggregate` | GET | Aggregate stats across all stories |

---

## Map Layer Audit (`mapLayers.config.ts`)

A formal config file that documents every layer's data provenance and audit status:

| Layer | Keep | Data Source | Note |
|---|---|---|---|
| Cost Burden | ✅ Core, default ON | TCOL via `/api/cost-of-living` | Primary structural equity layer |
| Disease Burden | ✅ Keep (proxy) | `weight_tot` HUD crosswalk | Approximate — not real prevalence data |
| Care Access | ✅ Keep (proxy) | `weight_res` HUD crosswalk | Approximate — not real care access data |
| Environmental Exposure | ✅ Keep (approximate) | Derived: latitude + `weight_tot` | Derived metric, not measured |
| Transit | ⚠️ Flagged — `keep: false` | `weight_tot` (same as Disease Burden) | Duplicate data source |
| Area Deprivation Index | ✅ Core, default ON | `ADI_NATRANK` block-group GeoJSON | Real data, normalized to percentile |

---

## Internationalization

Full English/Spanish translation via `next-intl`. Every piece of UI text lives in `messages/en.json` and `messages/es.json`. Language switcher in the navigation bar switches between `/en/...` and `/es/...` routes with no full-page reload. The proxy.ts file handles locale detection and redirects.

All 9 pages, all navigation items, all map layer labels and descriptions, form fields, and error states are translated.

---

## What Was Built in This Session (April 2026)

### Cost of Living Burden System
- `/api/cost-of-living` — TCOL cost breakdown for all 26 Bronx ZIPs (housing, food, transport, healthcare, childcare, other · required income · median income · income gap · cost burden ratio)
- `/api/adi` — ZIP-level ADI with percentile normalization
- `/api/neighborhood-summary` — aggregates cost + ADI into Structural Strain Index
- `NeighborhoodCostDashboard.tsx` — reusable component with stacked bar, income comparison, SSI gauge

### Map Layer: Cost of Living Burden
- New default-on map layer using `cost_burden_ratio` from TCOL data
- Blue (manageable) → Amber (at threshold) → Red (severe) color scale
- Cost data fetched and merged into every GeoJSON feature at map load
- Hover popup shows color-coded cost burden badge
- `mapLayers.config.ts` — formal audit of all 6 layers

### Neighborhood Profile — Cost of Living Section
Plain-language dollar-first section replacing index language:
- Three comparison cards: this neighborhood vs NYC average vs US average
- Each card: monthly cost, income bar showing how far it stretches, plain gap badge
- Stacked breakdown bar with dollar amounts per category
- Red callout paragraph when income < costs — in plain English, no jargon

### Neighborhood Profile — Structural Burden Section (rebuilt)
Plain-language redesign of the old "AI Signal Extraction" panel:
- Donut chart — 4 colored categories, proportional to signal scores
- Category legend with mini bars
- Four color-coded signal cards with plain names, descriptions, severity bars, contextual labels
- Ghost state for neighborhoods with no stories yet
- Removed all jargon: "SBI Score", "AI Signal Extraction", "weight %"

### KidneyDiseasePage
- Full redesign with CDC March 2026 + 2023 data
- SVG donut charts (ESKD causes + treatment split)
- Horizontal race bar chart
- Stage progression visualization
- All dark backgrounds converted to light (#fff / #faf7f3)

### Other Changes
- Nav label: "Overview" → "Kidney Disease" (EN + ES)
- `middleware.ts` → `proxy.ts` (Next.js 16 convention)
- Documentation: all .md files consolidated and updated
- Deleted 6 outdated planning documents

---

## Database Schema

```sql
-- Community stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code VARCHAR(10) NOT NULL,
  role VARCHAR(50),
  condition VARCHAR(100),
  story_text TEXT NOT NULL,
  themes TEXT[],
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI signal scores per story
CREATE TABLE story_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id),
  zip_code VARCHAR(10) NOT NULL,
  economic_instability FLOAT,
  healthcare_access FLOAT,
  insurance_instability FLOAT,
  food_environment FLOAT,
  environmental_exposure FLOAT,
  neighborhood_safety FLOAT,
  education_literacy FLOAT,
  justice_system FLOAT,
  mental_health FLOAT,
  substance_use FLOAT,
  social_support FLOAT,
  structural_barriers FLOAT,
  sbi_score FLOAT,
  confidence FLOAT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Design Principles (Non-Negotiable)

| Principle | How It's Implemented |
|---|---|
| No individual health data | Stories anonymous; no names, no addresses, no identifiers |
| Aggregation-first | All metrics aggregated to ZIP/tract — never individual |
| Transparent limits | Every data section explains what it does NOT show |
| Community-centered | Stories drive the AI signals, not the other way around |
| Plain language | Cost of living in dollars, not ratios. Burden in human terms, not indexes |
| Accessible | English and Spanish. No jargon on public-facing pages |
| Privacy by design | Geography over identity throughout |

---

## Current Status

All 9 pages are live. Full English/Spanish. PostgreSQL connected. Python AI service connected. Vercel auto-deploys. GitHub Actions CI active.

**What the data is — and what it isn't:**
The cost of living data, ADI, and disease burden layers are currently a mix of real data (HUD crosswalk, ADI block groups, ACS income, MIT Living Wage) and approximations (exposure index, transit burden derived from tract weights). The platform is explicitly transparent about this on every data section. The architecture is built so that real data sources can replace the approximations when available.

---

## Suggested Areas for Assessment

1. **Data accuracy** — Are the cost benchmarks (MIT Living Wage 2024) and income figures (ACS 2022) the right sources for the Bronx specifically? Are there better alternatives?
2. **AI signal methodology** — Is the 12-dimension framework defensible? Are the weights reasonable? Should any dimensions be split or merged?
3. **Index design** — The WWLI uses HUD tract weight proxies for disease burden and care access. This should be surfaced more clearly as a limitation. Is the formula sound?
4. **Accessibility** — Does the plain-language approach go far enough? Is there anything a non-English, non-technical Bronx resident would still find confusing?
5. **Privacy** — Is the current anonymization model sufficient? What additional safeguards should be considered before public launch with real stories?
6. **Equity framing** — Does the platform successfully avoid genetic determinism while still explaining the APOL1 connection? Is the "geography and justice" framing accurate and fair?
7. **Story moderation** — There is currently no moderation queue before submitted stories appear. This is a known gap listed in the roadmap.
