# REP — Rare Renal Equity Project

A public, interactive, place-based platform mapping how APOL1-mediated kidney disease and FSGS are shaped by structural factors — poverty, food environment, alcohol density, housing conditions, care access, and systemic inequity.

**Not genetics. Geography and justice.**

---

## What This Platform Is

REP is a **public accountability tool** that:
- Maps kidney disease burden alongside environmental and social factors at the neighborhood level
- Uses aggregation-first ethics to protect privacy while showing patterns
- Ties stories and narratives to place, not individual identity
- Explains what the data shows AND what it does NOT show
- Requires minimum thresholds before displaying stories (privacy by design)

## What This Platform Is NOT

- ❌ Individual-level health data (by design)
- ❌ Genetic determinism (kidney disease is not inevitable)
- ❌ Predictive ("who will get sick")
- ❌ Causal ("poverty causes disease")
- ❌ Clinical diagnosis tool
- ❌ A substitute for healthcare

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript** (strict types, safety-first)
- **Tailwind CSS** (responsive, accessible design)
- **MapLibre GL JS** (open-source maps, no corporate lock-in)
- **React** (interactive components)

### Backend / Data
- **Python** (ETL, data ingestion)
- **Census API** (poverty, education, income, housing)
- **OpenStreetMap / Overpass API** (POIs: fast food, alcohol, groceries, transit)
- **PostGIS** (spatial database, later phase)
- **Node.js** (API routes, data governance)

### Governance & Ethics
- **Data Governance Agent** (enforces suppression, downgrading, uncertainty)
- **LLM Narrative Agent** (plain-language explanations with guardrails)
- **Role-Based Access Control** (public, researcher, community partner, admin)
- **Audit Logging** (every decision logged for IRBs and funders)

---

## Key Principles

### Privacy-First
- No individual health records exposed
- Minimum cell size suppression (n < 11 hidden)
- Geography downgraded if insufficient data
- Small-number suppression follows NCHS guidelines

### Aggregation-First
- All data aggregated to census tracts (not ZIPs, not individuals)
- Population-level patterns, not clinical diagnoses
- Composite indices show co-occurrence, not causation

### Asset-Based Framing
- Every burden metric paired with community strengths
- Shows resources, transit, food access, schools
- Not deficit-focused; shows what communities have

### Transparent
- Explicit about what data is shown
- "What this map DOES NOT show" is mandatory
- Uncertainty language on all estimates
- Governance decisions auditable

### Community-Centered
- Stories appear only above threshold (minimum 5)
- Community partners can add qualitative context
- Researchers can access tract-level data
- Public sees aggregated, safe neighborhoods

---

## File Structure

```
rep-web/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Homepage
│   ├── neighborhood/[geoid]/      # Neighborhood detail pages
│   └── api/                       # API routes
│       ├── neighborhood/          # Data endpoints
│       ├── export/                # Export endpoint
│       └── cron/                  # Scheduled jobs
│
├── components/                    # React components
│   ├── Map.tsx                    # MapLibre map wrapper
│   ├── Narrative.tsx              # Story display
│   ├── LayerToggle.tsx            # Map controls
│   └── ...
│
├── lib/                           # Utilities & types
│   ├── permissions.ts             # Role-based access
│   ├── geography.ts               # GEOID helpers
│   └── ...
│
├── src/
│   ├── agents/                    # Agent system
│   │   ├── types.ts               # Shared types
│   │   ├── dataGovernanceAgent.ts # Gatekeeper
│   │   ├── llmNarrativeAgent.ts   # Story generation
│   │   ├── censusAgent.ts         # Census data fetch
│   │   └── overpassAgent.ts       # OSM POI fetch
│   └── ...
│
├── backend/
│   ├── agents/
│   │   └── etl/                   # ETL agents (server-only)
│   │       ├── suppressionAgent.ts
│   │       └── burdenIndexAgent.ts
│   └── ...
│
├── docs/
│   ├── prompt.md                  # Project brief (community + designers)
│   └── ...
│
├── public/
│   └── data/                      # GeoJSON, static assets
│
├── AGENT_ARCHITECTURE.md          # System design (detailed)
├── AGENT_INTEGRATION_GUIDE.md     # How to use agents
└── README.md                      # This file
```

---

## Core Architecture

REP uses a **governance-first agent system**. Every dataset flows through this pipeline:

```
Raw Data (Census/OSM)
  ↓
[Backend ETL: aggregate, suppress, index]
  ↓
Database (aggregated, safe)
  ↓
API Route
  ↓
[Data Governance Agent: validate, downgrade, flag]
  ↓
[Role-Based Filtering: apply user permissions]
  ↓
[LLM Narrative Agent: generate safe plain-language text]
  ↓
Frontend (safe data only)
```

**Every decision is logged.** IRBs and funders can audit the entire flow.

For detailed architecture, read [AGENT_ARCHITECTURE.md](./AGENT_ARCHITECTURE.md).

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Census API key (free: https://api.census.gov/data/key_signup.html)
- Anthropic API key (for narrative generation)

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd rep-web
   npm install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```
   CENSUS_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   DATABASE_URL=postgresql://...
   CRON_SECRET=your_secret_here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

4. **Run tests**
   ```bash
   npm test
   npm test -- --coverage
   ```

---

## Development Workflow

### Build Order (Week by Week)

**Week 1: Routes + Map Shell**
- Set up basic pages (homepage, neighborhood detail)
- MapLibre map component (no data yet, just base layer)
- Mock navigation between neighborhoods

**Week 2: Real Data Layers**
- Integrate Census Agent (fetch poverty, education, income)
- Integrate Overpass Agent (fetch POIs)
- Render census tract polygons (GeoJSON)
- Render choropleth (poverty %)

**Week 3: Neighborhood Profiles**
- Display key metrics
- Show asset-based context
- Link stories to place
- Implement role-based filtering

**Week 4: Story Submission + Thresholds**
- Build story submission form
- Implement thresholding (min 5 stories)
- Display narratives
- Governance audit logging

### Common Tasks

**Add a new metric:**
1. Update Census Agent to fetch the variable
2. Add to ETL aggregation
3. Update data types
4. Add narrative context
5. Test with governance agent

**Change governance rules:**
1. Edit `GOVERNANCE_CONFIG` in `src/agents/dataGovernanceAgent.ts`
2. Update tests
3. Document the change (governance board decision)
4. Re-run ETL pipeline

**Add a new role:**
1. Update `UserRole` type in `src/agents/types.ts`
2. Define permissions in `src/lib/permissions.ts`
3. Test filtering with new role
4. Document access level

---

## How to Contribute

### For Developers
- Follow TypeScript strict mode
- Write tests for new agents
- Document changes with comments (especially ethical decisions)
- Run linting before committing: `npm run lint`

### For Community Partners
- Share feedback on narratives (tone, accuracy, clarity)
- Suggest metrics relevant to your neighborhoods
- Test data suppression decisions (do they protect privacy?)
- Provide qualitative stories tied to geography

### For Researchers
- Suggest data sources (Census variables, spatial datasets)
- Validate indices and calculations
- Review governance decisions (are NCHS standards being met?)
- Test export functionality

### For Designers
- Review accessibility (maps, color contrast, readability)
- Test on mobile (most users on phones)
- Ensure "What this map DOES NOT show" is visible
- Test with screen readers

---

## Governance & Ethics

### Data Protection
- No individual-level health data exposed
- Minimum cell size ≥ 11 (NCHS standard)
- Geography downgraded if insufficient sample
- Suppression decisions logged for audit

### Transparency
- Every narrative includes "What this map DOES NOT show"
- Uncertainty statements on all estimates
- Governance decisions auditable by IRBs
- Data sources cited

### Community
- Stories appear only at minimum threshold
- Community partners can add context
- Feedback loop with residents
- Regular community review of narratives

### Funder & Research
- Data governance meets IRB standards
- Export controls for researcher access
- Audit logs suitable for NIH/PCORI
- Citable, reproducible data

---

## Deployment

### Staging
```bash
npm run build
npm run preview
```

### Production (Vercel)
```bash
git push origin main
# Vercel auto-deploys
```

### Scheduled ETL
- Set up cron job to run `GET /api/cron/etl` daily
- Fetches Census, OSM, aggregates, suppresses, computes indices
- Stores safe data in database
- Logs all decisions

---

## Resources

- **[AGENT_ARCHITECTURE.md](./AGENT_ARCHITECTURE.md)** — System design, data flows, development checklist
- **[AGENT_INTEGRATION_GUIDE.md](./AGENT_INTEGRATION_GUIDE.md)** — How to use agents in routes, testing examples, debugging
- **[docs/prompt.md](./docs/prompt.md)** — Original project brief and requirements
- **[Census API](https://api.census.gov/)** — Data documentation
- **[Overpass API](https://overpass-api.de/)** — OSM POI querying
- **[MapLibre GL JS](https://maplibre.org/)** — Map library documentation
- **[Next.js Docs](https://nextjs.org/docs)** — Framework reference

---

## Support

### For Technical Issues
- Check `__tests__/` for examples of common patterns
- Read [AGENT_INTEGRATION_GUIDE.md](./AGENT_INTEGRATION_GUIDE.md) for agent usage
- Review error logs: `console.log()` output in development server

### For Data Questions
- See `AGENT_ARCHITECTURE.md` for data flow explanation
- Review `src/agents/types.ts` for data structure
- Check governance rules in `dataGovernanceAgent.ts`

### For Community/Ethics Questions
- Read governance principles at top of this README
- Review `docs/prompt.md` for project vision
- Contact project leads for community partner guidance

---

## License & Attribution

This project is built with care for health equity and community benefit.

**Built by:** [Your name / organization]
**For:** Rare Renal Equity Project
**With support from:** [Funders, community partners, researchers]

---

## Acknowledgments

- Community partners who shaped the vision
- Researchers reviewing data governance
- Census Bureau and OpenStreetMap contributors
- Next.js and MapLibre communities

---

**Not genetics. Geography and justice.**

For questions or feedback, open an issue or contact the team.
