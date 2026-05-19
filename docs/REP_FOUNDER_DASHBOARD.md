# REP Founder Dashboard
**Rare Renal Equity Project — Command Center**

---

## The Mission

A public accountability platform that maps how **where you live shapes kidney disease outcomes** — connecting APOL1-mediated kidney disease and FSGS burden to structural inequity.

**Not genetics. Geography and justice.**

**Live site**: https://rep-web-wine.vercel.app/

---

## Current Status (April 2026)

### Platform — All Pages Live

| Page | Status | Notes |
|---|---|---|
| Hero / Home | ✅ Live | Full editorial design, CTAs |
| Map Explorer | ✅ Live | MapLibre + 5 choropleth layers, floating panel UI |
| Neighborhood Profile | ✅ Live | WWLI gauge, AI signal bars, SBI score |
| Stories | ✅ Live | Submission form → DB, immersive reading view |
| About | ✅ Live | Editorial redesign with chapter layout |
| Methods | ✅ Live | Data transparency documentation |
| Kidney Disease | ✅ Live | Redesigned with CDC 2026 stats, SVG charts |
| APOL1 | ✅ Live | |
| FSGS | ✅ Live | |

### Infrastructure — Fully Operational

| System | Status | Notes |
|---|---|---|
| PostgreSQL | ✅ Live | stories + story_signals tables |
| Python AI service | ✅ Live | FastAPI + Claude signal extraction |
| GitHub Actions CI | ✅ Active | Build + security scan on every push |
| Vercel deployment | ✅ Active | Auto-deploys from main |
| English/Spanish i18n | ✅ Live | Full translation, language switcher |

---

## What Was Built

### Map
- MapLibre GL with 5 real choropleth layers: Disease Burden, Care Access, Environmental Exposure, Transit, Area Deprivation Index
- Floating panel UI — map fills full viewport
- Click ZIP → opens Neighborhood Profile

### Neighborhood Profile
- **Where We Live Index (WWLI)**: Custom 0–100 composite from census tract geographic weights
- **Structural Burden Index (SBI)**: Weighted formula across 12 AI-extracted signal dimensions
- SVG arc gauge for WWLI visualization
- 12-bar signal chart from story AI analysis

### Stories
- Community submission form → PostgreSQL
- POST `/api/stories` → triggers Python AI analysis → stores signals
- Immersive story reading view
- ZIP-filtered story display on Neighborhood Profile

### AI Signal Extraction
- Python FastAPI service at `PYTHON_SERVICE_URL/analyze-story`
- Claude extracts 12 dimensions per story: economic instability, healthcare access, insurance, food environment, environmental exposure, neighborhood safety, education, justice system, mental health, substance use, social support, structural barriers
- Averages aggregated per ZIP at `GET /api/stories/signals-by-zip`

### Kidney Disease Page
- Redesigned with CDC CKD Fact Sheet (March 2026) data
- SVG donut charts: ESKD causes + treatment split
- Horizontal bar chart: racial disparities
- Stage progression bar chart

---

## Core Indices

### Where We Live Index (WWLI)
```
WWLI = (weight_tot × 100 × 0.60) + (weight_res × 100 × 0.40)
```
Derived from HUD USPS ZIP-to-Tract crosswalk residential and total weights.

### Structural Burden Index (SBI)
Weighted average of 12 AI-extracted signal dimensions from community stories.
Formula in `where-we-live-site/lib/signalUtils.ts`.

---

## Priorities — What's Next

### Near-Term (Suggested)
- [ ] Story moderation / review queue before public display
- [ ] Minimum threshold enforcement (hide signals when n < 3 stories)
- [ ] Admin dashboard for story management
- [ ] Map layers connected to real health data (currently static weights)
- [ ] Export functionality for researchers

### Medium-Term
- [ ] Authentication for researcher access tier
- [ ] Story recommendation by condition/theme
- [ ] National expansion beyond the Bronx
- [ ] IRB documentation and compliance review

---

## Core Principles (Non-Negotiable)

| Principle | Implementation |
|---|---|
| No individual health data | Stories are anonymous; no names, no addresses |
| Aggregation-first | All metrics aggregated to ZIP/tract, never individual |
| Transparent limits | Every data section explains what it DOES NOT show |
| Community-centered | Stories drive the AI signals, not the other way around |
| Privacy by design | Geography over identity throughout |

---

## Quick Navigation

| Need | Go To |
|---|---|
| Run locally | [README.md → Getting Started](../README.md#getting-started) |
| API endpoints | [README.md → API Endpoints](../README.md#key-api-endpoints) |
| Data pipeline docs | [rep-data/scripts/README.md](../rep-data/scripts/README.md) |
| Python AI service | [rep-python/README.md](../rep-python/README.md) |
| i18n / translations | [docs/i18n-setup.md](./i18n-setup.md) |
| Agent architecture | [docs/AGENT_ARCHITECTURE.md](./AGENT_ARCHITECTURE.md) |
| CI/CD workflows | [.github/WORKFLOWS.md](../.github/WORKFLOWS.md) |
| Mission statement | [docs/MISSION.md](./MISSION.md) |
