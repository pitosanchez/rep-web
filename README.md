# Where We Live

**Not genetics. Geography and justice.**

A public, interactive, place-based platform mapping how APOL1-mediated kidney disease and FSGS are shaped by structural factors — poverty, food environment, alcohol density, housing conditions, care access, and systemic inequity.

[![Live Site](https://img.shields.io/badge/Live-rep--web--wine.vercel.app-c45a3b)](https://rep-web-wine.vercel.app/)
![Build](https://github.com/pitosanchez/rep-web/actions/workflows/build.yml/badge.svg)

---

## What This Platform Does

REP is a **public accountability tool** that:
- Maps kidney disease burden alongside environmental and social factors at the neighborhood level
- Lets community members submit anonymous stories tied to their ZIP code
- Uses AI to extract structural signals from those stories (healthcare access, food environment, economic instability, and 9 other dimensions)
- Computes a **Structural Burden Index (SBI)** and **Where We Live Index (WWLI)** unique to each neighborhood
- Displays all data in English and Spanish

**What it is NOT:**
- Individual-level health data (by design)
- Genetic determinism
- A clinical diagnosis tool

---

## Current Status

| Page / Feature | Status |
|---|---|
| Hero / Home | ✅ Complete |
| Map Explorer (MapLibre + 5 layers) | ✅ Complete |
| Neighborhood Profile (WWLI + AI signals) | ✅ Complete |
| Stories (submission + reading view) | ✅ Complete |
| About | ✅ Complete |
| Methods | ✅ Complete |
| Kidney Disease (redesigned + CDC 2026 data) | ✅ Complete |
| APOL1 page | ✅ Complete |
| FSGS page | ✅ Complete |
| English / Spanish i18n | ✅ Complete |
| PostgreSQL backend | ✅ Complete |
| Python AI signal extraction service | ✅ Complete |
| Vercel deployment | ✅ Live |
| GitHub Actions CI/CD | ✅ Active |

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript** (strict)
- **MapLibre GL JS** (open-source maps)
- **next-intl** (English/Spanish internationalization)
- Inline React styles throughout (no CSS framework)

### Backend / Data
- **PostgreSQL** via `pg` Pool (lazy-initialized for Vercel builds)
- **Python / FastAPI** — AI signal extraction microservice (`rep-python/`)
- **Anthropic Claude** — extracts 12 structural signals from each story
- **Node.js API routes** — Next.js App Router (`where-we-live-site/app/api/`)

### Data Infrastructure
- **HUD USPS ZIP-to-Tract crosswalk** (26 Bronx ZIP codes)
- **Census TIGER/Line** tract geometries
- **NYC DCP Neighborhood Tabulation Areas (NTAs)**
- **MapLibre + custom GeoJSON** for choropleth layers

### Infrastructure
- **Vercel** — web deployment (auto-deploys from `main`)
- **GitHub Actions** — build, security scan, CI
- **Neon / Railway** — managed PostgreSQL

---

## Repository Structure

```
rep-web/
├── where-we-live-site/         # Next.js frontend + API
│   ├── app/
│   │   ├── [locale]/           # EN/ES locale routing
│   │   └── api/                # API routes
│   │       ├── geo/            # Geographic data endpoints
│   │       └── stories/        # Story submission + signal endpoints
│   ├── components/
│   │   ├── REPWireframe.tsx    # Root app (page state machine)
│   │   ├── Navigation.tsx      # Fixed nav + language switcher
│   │   ├── MapLibreMap.tsx     # Interactive map component
│   │   └── pages/              # One file per page
│   ├── lib/
│   │   ├── db.ts               # PostgreSQL pool (lazy)
│   │   ├── signalUtils.ts      # SBI formula
│   │   └── storyZipMapping.ts  # ZIP → neighborhood name fallbacks
│   └── messages/
│       ├── en.json             # English translations
│       └── es.json             # Spanish translations
│
├── rep-data/                   # Geographic data pipeline
│   ├── scripts/                # TypeScript ETL scripts
│   └── data/geo/               # Crosswalk outputs (JSON + CSV)
│
├── rep-python/                 # AI signal extraction service
│   ├── app/main.py             # FastAPI app
│   └── migrations/             # PostgreSQL migrations
│
└── docs/                       # Technical documentation
    ├── MISSION.md
    ├── AGENT_ARCHITECTURE.md
    ├── AGENT_INTEGRATION_GUIDE.md
    ├── i18n-setup.md
    └── architecture/
        └── REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database (Neon, Railway, or local)
- Anthropic API key (for AI signal extraction)
- Python 3.11+ (for the signal service)

### 1. Clone and install

```bash
git clone https://github.com/pitosanchez/rep-web.git
cd rep-web/where-we-live-site
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL=postgresql://user:password@host:5432/rep_db
PYTHON_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_key_here
```

### 3. Run database migrations

```bash
psql $DATABASE_URL -f ../rep-python/migrations/001_create_stories.sql
psql $DATABASE_URL -f ../rep-python/migrations/002_create_story_signals.sql
psql $DATABASE_URL -f ../rep-python/migrations/003_create_geographies_and_aggregated.sql
```

### 4. Start the frontend

```bash
npm run dev
# Open http://localhost:3000
```

### 5. (Optional) Start the Python signal service

```bash
cd rep-python
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Key API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/geo/bronx-zips` | GeoJSON boundaries for all Bronx ZIP codes |
| `GET /api/geo/zip-to-tracts` | ZIP → tract crosswalk with HUD weights |
| `GET /api/geo/neighborhood-profile?zip=10456` | WWLI + structural data for a ZIP |
| `GET /api/stories/by-zip?zip=10456` | Community stories for a ZIP |
| `POST /api/stories` | Submit a new community story |
| `GET /api/stories/signals-by-zip?zip=10456` | AI-extracted signal averages for a ZIP |

---

## Core Indices

### Where We Live Index (WWLI)
A 0–100 composite score derived from census tract geographic weights:
```
WWLI = (structuralWeight × 0.60) + (residentialBurden × 0.40)
```
- `structuralWeight` = `weight_tot × 100` (total tract burden concentration)
- `residentialBurden` = `weight_res × 100` (residential share)
- Tiers: 0–33 lower · 34–66 moderate · 67–100 high

### Structural Burden Index (SBI)
Computed from AI-extracted story signals across 12 dimensions:
- Economic Instability, Healthcare Access, Insurance Instability
- Food Environment, Environmental Exposure, Neighborhood Safety
- Education/Literacy, Justice System, Mental Health
- Substance Use, Social Support, Structural Barriers

Weighted formula in `where-we-live-site/lib/signalUtils.ts`.

---

## Design System

| Token | Value |
|---|---|
| Terracotta accent | `#c45a3b` |
| Near-black text | `#1a1a1a` |
| Warm cream background | `#faf7f3` |
| White | `#fff` |
| Serif font | Georgia |
| Sans-serif font | system-ui |

All components use inline React styles. No Tailwind, no CSS modules.

---

## Deployment

```bash
# Auto-deploys on push to main
git push origin main
```

Vercel reads `where-we-live-site/` as the project root. Build command: `npm run build`. Output: `.next/`.

GitHub Actions run on every push:
- **Build & lint** — TypeScript + ESLint
- **Security scan** — npm audit + CodeQL

---

## Key Principles

**Privacy-First** — No individual health records. Minimum cell suppression. Geography over identity.

**Aggregation-First** — All data aggregated to census tracts. Population-level patterns, not clinical diagnoses.

**Asset-Based Framing** — Every burden metric shown alongside community context.

**Transparent** — Explicit about what data shows and does not show. Uncertainty on all estimates.

**Community-Centered** — Stories linked to place. AI serves the story, not the other way around.

---

## Documentation Index

| Document | Purpose |
|---|---|
| [docs/MISSION.md](docs/MISSION.md) | Platform mission and ethical commitments |
| [docs/AGENT_ARCHITECTURE.md](docs/AGENT_ARCHITECTURE.md) | Data governance agent system |
| [docs/AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) | How to use agents in routes |
| [docs/i18n-setup.md](docs/i18n-setup.md) | English/Spanish internationalization |
| [docs/architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md](docs/architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md) | Full system blueprint |
| [rep-data/scripts/README.md](rep-data/scripts/README.md) | Geographic data pipeline |
| [rep-data/data/geo/README.md](rep-data/data/geo/README.md) | Crosswalk data schema |
| [rep-python/README.md](rep-python/README.md) | Python AI signal service |
| [.github/WORKFLOWS.md](.github/WORKFLOWS.md) | CI/CD workflow reference |

---

**Built by:** Robert Pito Sanchez · Rare Renal Equity Project
**Not genetics. Geography and justice.**
