# REP Platform Implementation Plan: Next Phases

**Status**: Map Page complete (Phases 1-6). Ready to split into parallel work streams.

**Date**: January 29, 2026

---

## What We've Built ✅

### Completed
- **Hero Page**: 7-section landing page with interactive cards, story previews, CTAs, trust badges
- **Navigation**: Fixed nav bar with page routing
- **Map Page**: Full MapLibre GL integration with:
  - 4 choropleth layers (Disease Burden, Care Access, Environmental Exposure, Transit)
  - Interactive popups on hover with key metrics
  - Layer control toggles with real-time visibility updates
  - Zoom controls
  - Responsive design (mobile → desktop)
  - Sidebar with neighborhood cards
  - Click-to-navigate workflows

### Data Infrastructure
- Mock data in `lib/mockData.ts` (3 Bronx neighborhoods with metrics)
- GeoJSON polygons in `public/data/bronx-zips.geojson`
- Geographic types in data model
- Agent architecture documented (future: ETL pipeline)

### Developer Experience
- TypeScript with full type safety
- Consistent component patterns (inline styles, responsive utilities)
- Git workflow with GitHub Actions (build, deploy, security scans)
- Modular page architecture

---

## Why We Need Multiple Work Streams

The platform has three major pillars that can be built **in parallel**:

1. **Data Infrastructure** (Backend/ETL)
   - Build geographic crosswalks + NTA clustering
   - Design database schema for health/structural data
   - Implement data governance agent system

2. **Pages & UI** (Frontend)
   - Build out remaining pages (Neighborhood, Stories, About, Methods)
   - Add page-specific interactions and data flows

3. **Backend Services** (API/Integration)
   - Create REST/GraphQL endpoints for data queries
   - Build authentication + role-based access
   - Connect frontend to real data

---

## Strategic Options for Next Phase

### **Option 1: Data-First Approach** (Recommended)
**Goal**: Build the geographic + health data foundation for the entire platform

**Why Choose This**:
- ✅ Unblocks all other work (pages need real data)
- ✅ Most complex; benefits from early completion
- ✅ Establishes data governance patterns used everywhere
- ✅ Enables realistic testing of aggregation + suppression logic

**Scope** (~4-6 weeks):
1. **Build ZIP-tract crosswalk pipeline** (1 week)
   - HUD + Census data ingestion
   - Spatial join for NTA clustering
   - Outputs: 3 JSON/CSV files with validation

2. **Design + build database schema** (1 week)
   - Tables: traits, tracts, neighborhoods, health_metrics, data_sources
   - Support tract-level aggregation with suppression rules
   - Add audit logging for data governance

3. **Implement data governance agent** (1 week)
   - Suppress small numbers (< 5 per tract)
   - Downgrade to higher geography if needed
   - Document suppression decisions

4. **Build data import/transformation pipeline** (1 week)
   - Load mock APOL1/FSGS prevalence data by tract
   - Load environmental exposure indices
   - Load care access metrics (distance to nephrology)

5. **Create backend API endpoints** (1 week)
   - GET `/api/neighborhoods` → list all NTAs + summary stats
   - GET `/api/neighborhoods/:code` → detailed neighborhood profile
   - GET `/api/neighborhoods/:code/health` → health metrics (with suppression)

**Outputs**:
- Reproducible data pipeline (Node.js/TS script)
- PostgreSQL schema + migrations
- Backend API (Express.js or Next.js API routes)
- README documenting data sources + methods

**Why This Unblocks Everything**:
- Neighborhood Page needs: tract profiles, health data, stories by NTA
- Stories Page needs: full-text search by neighborhood
- Methods Page needs: real data governance documentation
- Admin dashboard needs: data audit logs

---

### **Option 2: UI-First Approach**
**Goal**: Build all remaining pages with mock data, prepare for data integration

**Why Choose This**:
- ✅ Visible progress (5 more pages complete)
- ✅ Team can test navigation + UX end-to-end
- ✅ Identify data requirements before building backend
- ✅ Creates acceptance criteria for data work

**Scope** (~3-4 weeks):
1. **Neighborhood Profile Page** (3-4 days)
   - Display selected ZIP's metrics
   - Show related stories
   - Link to regional context
   - Interactive mini-map focusing on selected area

2. **Stories Page** (3-4 days)
   - Full-text search + filter by theme/condition
   - Story cards with patient narratives
   - Related neighborhood link
   - Aggregation methodology note (for privacy)

3. **Methods Page** (2-3 days)
   - Data sources + documentation
   - Methodology for aggregation
   - Suppression logic explanation
   - FAQs about data transparency

4. **About Page** (2-3 days)
   - Project mission + values
   - Team + partners
   - Contact information
   - Funding acknowledgments

5. **Admin Dashboard** (2-3 days)
   - Data upload interface
   - View data import logs
   - Manual suppression overrides
   - Export data as CSV

**Outputs**:
- 5 fully functional pages with mock data
- Page-specific component library
- Data binding interface (ready for backend)

**Why This Makes Sense**:
- Shows product vision to stakeholders
- Identifies UX issues early
- Gives data team clear requirements

---

### **Option 3: Backend-First Approach**
**Goal**: Build API + authentication infrastructure, prepare for scale

**Why Choose This**:
- ✅ Security from day one (auth, RBAC, audit logging)
- ✅ Supports future multi-user platform
- ✅ Enables real deployment to production
- ✅ Prevents data model mistakes later

**Scope** (~3-5 weeks):
1. **Design REST API specification** (3-4 days)
   - OpenAPI/Swagger documentation
   - Define all endpoints needed for pages
   - Rate limiting + caching strategy

2. **Implement authentication** (1 week)
   - User roles: public, researcher, community_partner, admin
   - JWT-based auth with refresh tokens
   - GitHub OAuth integration (for researchers)
   - Email-based community partner portal

3. **Build permission system** (3-4 days)
   - Role-based access control (RBAC)
   - Data visibility rules by role
   - Audit logging for compliance

4. **Create API endpoints** (1 week)
   - `/api/neighborhoods` → list + search
   - `/api/neighborhoods/:code` → profile data
   - `/api/stories` → full-text search
   - `/api/user` → user settings
   - Admin endpoints for data management

5. **Set up deployment** (2-3 days)
   - Docker containers (if needed)
   - GitHub Actions → staging + production
   - Environment management (dev/staging/prod)
   - Secrets rotation

**Outputs**:
- Fully authenticated REST API
- User management system
- Deployment pipeline
- API documentation (Swagger)

**Why This Matters**:
- Without auth, can't share with researchers
- API design mistakes are expensive to fix later
- Production-ready from start = easier scaling

---

## Recommended Roadmap (3-Month Vision)

### **Month 1: Data Foundation + UI Skeleton**
- **Week 1-2**: Option 1, Phase 1-2 (ZIP-tract crosswalk + database schema)
- **Week 3-4**: Option 2, Phase 1-2 (Neighborhood + Stories pages, with mock data)

**By End of Month 1**:
- Real geographic infrastructure ✓
- 3 new pages visible ✓
- API design finalized ✓

### **Month 2: Backend + Data Integration**
- **Week 5-6**: Option 3, Phases 1-3 (Auth + API + RBAC)
- **Week 7-8**: Option 1, Phase 3-5 (Data governance + API endpoints)

**By End of Month 2**:
- Authentication working ✓
- Backend serving real data ✓
- Frontend pages connected to backend ✓

### **Month 3: Polish + Production**
- **Week 9-10**: Option 2, Phase 3-5 (Methods + About + Admin pages)
- **Week 11-12**: Testing, documentation, performance optimization, production deployment

**By End of Month 3**:
- All pages complete ✓
- Full data governance implemented ✓
- Ready for researcher access ✓

---

## Decision Matrix

Choose your path based on constraints:

| Factor | Data-First | UI-First | Backend-First |
|--------|-----------|----------|--------------|
| **Speed to Visible Progress** | Slow (1 wk) | Fast (1-2 days) | Medium (3-5 days) |
| **Risk** | High (data mistakes costly) | Low (easy to iterate) | Medium (auth bugs risky) |
| **Team Skill** | Need GIS/SQL | Need React/CSS | Need DevOps/Auth |
| **Unblocks** | Everything | Nothing | Most things |
| **Data Quality** | Highest | Lowest | Highest |
| **Production Ready** | No | No | Yes |

---

## Starting the Next Phase

### If You Choose Option 1 (Data-First):
```bash
# Create task document
cat DATA_PIPELINE_TASK.md  # Already written!

# Start implementation
mkdir -p scripts
touch scripts/types.ts
touch scripts/build_bronx_crosswalk.ts
```

**First commit**: "Setup data pipeline scaffolding + types"

### If You Choose Option 2 (UI-First):
```bash
# Create neighborhood page
touch components/pages/NeighborhoodPage.tsx
touch components/pages/StoriesPage.tsx
```

**First commit**: "Add Neighborhood + Stories page stubs"

### If You Choose Option 3 (Backend-First):
```bash
# Setup API structure
mkdir -p app/api/{neighborhoods,stories,auth,admin}
touch app/api/types.ts
```

**First commit**: "Setup API routes scaffolding"

---

## Team Parallelization

If team splits:

**Team A (Data)**: Implementation of Option 1
- 1 data engineer + 1 GIS specialist
- Owns: pipeline, schema, data validation
- Deliverable: Real data + API endpoints

**Team B (Frontend)**: Implementation of Option 2
- 1-2 frontend engineers
- Owns: page components, interactions, UX
- Deliverable: 5 complete pages with data binding
- Accepts mock data from Team A → integrates with real data

**Team C (Infrastructure)**: Implementation of Option 3
- 1 backend engineer + 1 DevOps
- Owns: auth, API design, deployment
- Deliverable: Secure, scalable API + deployment

**Sync Points**:
- Weekly: Data Team → Frontend Team (mock data contract)
- Weekly: Backend Team ← both teams (API spec review)
- Bi-weekly: Full team (integration + blockers)

---

## What to Do Right Now

### If You Want Quick Wins
1. Start with **Option 2** (UI-First)
2. Build Neighborhood Page today
3. Build Stories Page tomorrow
4. By Friday: 2 new pages complete

### If You Want Solid Foundation
1. Start with **Option 1** (Data-First)
2. Build ZIP-tract crosswalk this week
3. Design DB schema next week
4. Unblock everything else

### If You Want Production-Ready
1. Start with **Option 3** (Backend-First)
2. Design API spec this week
3. Build auth system next week
4. Deploy to staging by week 3

---

## Questions to Guide Your Decision

1. **What's the bottleneck?**
   - If: "We need to show stakeholders something" → Option 2
   - If: "We need real data before scaling" → Option 1
   - If: "We need to launch with users" → Option 3

2. **What's the team skill level?**
   - Strong React + CSS → Option 2
   - Strong SQL + Python/Node → Option 1
   - Strong DevOps + Node → Option 3

3. **What happens if we guess wrong?**
   - UI Pages: Easy to refactor later
   - Database schema: Hard + expensive to refactor
   - Auth system: Critical to get right first time

**Recommendation**: Option 1 (Data-First) is lowest risk, highest impact.

---

## Next Step: Your Choice

**You now have 3 clear paths forward. Pick one and we'll dive into implementation.**

Reply with:
- Option 1: "Let's build the data pipeline"
- Option 2: "Let's build all the remaining pages"
- Option 3: "Let's build the backend + auth"
- Or: "Parallel work - I have a team"

I'm ready to create detailed task breakdowns, start implementation, or establish a parallel work structure. What's the move?

---

## Appendix: Detailed Scope by Path

### Option 1: Full Data Pipeline Scope

```
scripts/
├── download_sources.ts
│   └── Downloads HUD crosswalk, Census TIGER, NYC NTA
├── spatial_join_tract_to_nta.ts
│   └── Performs geographic spatial join
├── build_neighborhood_clusters.ts
│   └── Groups tracts into NTA clusters
├── build_bronx_crosswalk.ts (main)
│   └── Orchestration + output writing
└── utils/
    ├── logger.ts
    ├── validator.ts
    ├── file-cache.ts
    └── geojson.ts

data/
├── raw/ (auto-downloaded)
│   ├── hud_zip_tract.csv
│   ├── tl_2020_36_tract.zip
│   └── nta_2020.geojson
└── geo/ (outputs)
    ├── bronx_zip_to_tracts.json
    ├── bronx_zip_to_tracts.csv
    ├── bronx_neighborhood_clusters.json
    └── README.md

Database Schema:
├── states (reference)
├── counties (reference)
├── tracts (real)
│   - geoid, geometry, state_fips, county_fips
├── neighborhoods (real)
│   - nta_code, nta_name, geometry
├── data_sources (real)
│   - name, version, url, cached_at
├── health_metrics (real)
│   - tract_geoid, metric_name, value, year
└── data_governance_log (audit)
    - metric_id, suppression_reason, decided_by, decided_at

API Endpoints:
GET  /api/neighborhoods
GET  /api/neighborhoods/:nta_code
GET  /api/neighborhoods/:nta_code/health
POST /api/neighborhoods/:nta_code/stories
```

### Option 2: Full Page Build Scope

```
components/pages/
├── NeighborhoodPage.tsx
│   - Selected ZIP profile
│   - Health metrics display
│   - Related stories
│   - Mini-map focus
│   - Responsive layout
│
├── StoriesPage.tsx
│   - Full-text search
│   - Filter by theme/condition
│   - Story cards
│   - Pagination
│   - Related neighborhood link
│
├── MethodsPage.tsx
│   - Data source documentation
│   - Aggregation methodology
│   - Suppression logic
│   - FAQs
│   - Transparency statement
│
├── AboutPage.tsx
│   - Mission + values
│   - Team + partners
│   - Contact
│   - Funding
│
└── AdminDashboard.tsx
    - Data upload interface
    - View import logs
    - Manual suppression controls
    - Export functionality

lib/
├── hooks/
│   ├── useNeighborhoodData.ts
│   ├── useStorySearch.ts
│   └── useDataFilters.ts
└── data-binding.ts
    - Interface between UI and future API
```

### Option 3: Full Backend Scope

```
app/api/
├── auth/
│   ├── login.ts (JWT)
│   ├── logout.ts
│   ├── refresh.ts
│   └── github.ts (OAuth callback)
│
├── neighborhoods/
│   ├── [code]/
│   │   ├── route.ts (GET profile)
│   │   └── health/
│   │       └── route.ts (GET with suppression)
│   └── route.ts (GET list + search)
│
├── stories/
│   ├── route.ts (GET search + filter)
│   └── [id]/
│       └── route.ts (GET single story)
│
├── admin/
│   ├── data/
│   │   ├── upload.ts
│   │   ├── imports.ts
│   │   └── logs.ts
│   └── suppression/
│       └── route.ts (manual overrides)
│
├── user/
│   ├── route.ts (GET current user)
│   └── preferences/
│       └── route.ts (POST save preferences)
│
└── _middleware.ts
    - Authentication
    - Authorization
    - Rate limiting
    - Audit logging

middleware/
├── auth.ts
├── rbac.ts
├── validation.ts
└── error-handler.ts

lib/auth/
├── jwt.ts
├── roles.ts
└── permissions.ts

tests/
├── auth.test.ts
├── api.test.ts
└── integration.test.ts
```

---

**Status**: Implementation Plans Ready
**Date**: January 29, 2026
**Time to Decide**: Your call! 🚀
