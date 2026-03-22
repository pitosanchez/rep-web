# REP FOUNDER DASHBOARD
**Daily Command Center for Rare Renal Equity Project**

---

## 🎯 THE MISSION (One Sentence)

A public accountability platform that maps how **where you live shapes kidney disease outcomes** — connecting APOL1-mediated kidney disease and FSGS burden to structural inequity (poverty, food environment, care access, systemic racism).

**Not genetics. Geography and justice.**

---

## 📊 CURRENT STATUS (As of January 29, 2026)

| Component | Status | Owner |
|-----------|--------|-------|
| **Hero Page** | ✅ Complete | Frontend |
| **Map Explorer** | ✅ Complete (with mock data) | Frontend + GIS |
| **Navigation** | ✅ Complete | Frontend |
| **Data Infrastructure** | 🔴 Not started | Data/Backend |
| **Neighborhood Profile Page** | 🔴 Not started | Frontend |
| **Stories Page** | 🔴 Not started | Frontend |
| **About Page** | 🟡 Started | Frontend |
| **Methods Page** | 🟡 Started | Frontend |
| **Backend API** | 🔴 Not started | Backend |
| **Data Pipeline (ETL)** | 🔴 Not started | Data |
| **Authentication** | 🔴 Not started | Backend |

**What works:**
- Landing page with mission statement
- Interactive map with 4 choropleth layers
- Layer toggles, zoom controls, responsive design
- Mock data (3 Bronx neighborhoods)

**What's needed:**
- Real geographic data (ZIP-to-tract crosswalks)
- Governance-enforced data pipeline
- Story submission + aggregation
- Neighborhood detail pages
- Backend API + authentication

---

## 🚀 THIS WEEK'S PRIORITIES

### **Priority 1: Decide Next Phase Direction**
Choose one of three paths:
- **Option A (Data-First)**: Build geographic + health data foundation first (~4-6 weeks)
  - Unblocks everything else
  - Most complex; worth doing early
  - Establishes governance patterns

- **Option B (UI-First)**: Build all remaining pages with mock data (~3-4 weeks)
  - Quick visible progress
  - Clarifies data requirements for backend

- **Option C (Backend-First)**: Build API + authentication infrastructure (~3-5 weeks)
  - Production-ready from start
  - Supports future scaling

**Recommendation**: Option A (Data-First) — lowest risk, highest impact.

### **Priority 2: Stakeholder Alignment**
- [ ] Review OPTIONS with project board / funding partners
- [ ] Clarify timeline constraints
- [ ] Confirm team capacity (solo builder? small team? contractors?)

### **Priority 3: Environment Setup**
- [ ] Confirm Census API key configured
- [ ] Confirm Anthropic API key configured
- [ ] Test local development environment
- [ ] Review GitHub Actions workflows (build, deploy, security)

---

## 🏗️ CORE ARCHITECTURE (Quick Reference)

### **Three Layers of the Platform**

```
User Sees (Frontend)
  ↓
Safe Data Only
(Role-Based Filtering)
  ↓
Governed Data
(Data Governance Agent enforces suppression/downgrading)
  ↓
Backend API
(REST routes serving safe neighborhoods, stories, metrics)
  ↓
Database
(Aggregated, suppressed, indexed)
  ↓
ETL Pipeline
(Census/OSM → aggregate → suppress → validate)
  ↓
Raw Data Sources
(US Census, OpenStreetMap, CDC/ATSDR)
```

### **Tech Stack (Locked In)**
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind, MapLibre GL
- **Backend**: Node.js/Express, PostgreSQL (future PostGIS)
- **Data**: Python (ETL), Census API, OpenStreetMap/Overpass API
- **Governance**: Data Governance Agent, Role-Based Access, Audit Logging
- **Deployment**: Vercel (frontend), Cloud DB (backend), GitHub Actions

---

## ⚖️ CORE PRINCIPLES (Non-Negotiable)

### **Privacy-First**
- ❌ No individual health records exposed
- ✅ Minimum 5 stories per neighborhood before display
- ✅ Suppression of cells with n < 11
- ✅ Geography downgraded if insufficient data

### **Aggregation-First**
- ✅ All data aggregated to census tracts (not ZIPs, not individuals)
- ✅ Population-level patterns, not clinical diagnoses
- ✅ Composite indices show co-occurrence, NOT causation

### **Transparent**
- ✅ "What this map DOES NOT show" is mandatory on every page
- ✅ Uncertainty statements on all estimates
- ✅ Governance decisions auditable by IRBs/funders
- ✅ Data sources cited

### **Community-Centered**
- ✅ Stories tied to place, not identity
- ✅ Stories appear only above threshold (minimum 5)
- ✅ Community partners can add context
- ✅ Built WITH communities, not FOR them

---

## 📋 PAGES YOU'RE BUILDING

| Page | Purpose | Data | Status |
|------|---------|------|--------|
| **Hero** | Landing page, mission, CTAs | Static | ✅ Done |
| **Map** | Explore neighborhoods, see layers | Mock | ✅ Done |
| **Neighborhood** | Deep dive on one area, metrics, stories | Real | 🔴 To-do |
| **Stories** | Search/filter stories by theme | Real | 🔴 To-do |
| **About** | Mission, team, partners, contact | Static | 🟡 In progress |
| **Methods** | Data sources, methodology, governance | Static | 🟡 In progress |

---

## 📍 WHO THIS PLATFORM SERVES

| Audience | What They Get |
|----------|---------------|
| **Patients & Families** | Context — "I'm not alone, and it's not my fault" |
| **Community Advocates** | Evidence to cite in policy meetings, not just stories |
| **Researchers** | Neighborhood-level patterns + access to tract data |
| **Journalists** | A story that writes itself (place, data, voice) |
| **Funders** | Proof of concept + roadmap for scaling |
| **Policymakers** | Structural visibility they can't ignore |

---

## 🗂️ REPO STRUCTURE (Quick Navigation)

```
rep-web/
├── app/                       # Next.js App Router (pages + API routes)
│   ├── page.tsx              # Home
│   ├── hero/page.tsx          # Standalone hero page
│   └── api/geo/              # Geographic data endpoints
├── components/
│   ├── pages/                # Page components (Hero, Map, etc.)
│   ├── MapLibreMap.tsx        # Map component
│   └── Navigation.tsx         # Nav bar
├── src/agents/                # Agent system (future ETL)
│   ├── censusAgent.ts
│   ├── overpassAgent.ts
│   ├── dataGovernanceAgent.ts
│   └── llmNarrativeAgent.ts
├── data/                      # Data files + outputs
│   ├── raw/                  # Source data (census, OSM)
│   └── geo/                  # Generated GeoJSON + validation
├── scripts/                   # Data pipeline scripts
├── lib/                       # Types, utilities, permissions
├── docs/                      # This dashboard + strategy
└── public/data/              # Static GeoJSON for frontend
```

---

## 🛣️ IMPLEMENTATION ROADMAP (3-Month Vision)

### **Month 1: Foundation + UI Skeleton** (~4 weeks)
- **Week 1-2**: Data foundation
  - Build ZIP-to-tract crosswalk pipeline
  - Design database schema
  - Set up geographic reference data

- **Week 3-4**: Pages + Mocks
  - Neighborhood Profile page (with mock data)
  - Stories page (with mock data)
  - Finalize API design

**By End of Month 1**: Real geographic infrastructure + 3 new pages visible

### **Month 2: Backend + Integration** (~4 weeks)
- **Week 5-6**: Auth + API
  - Build authentication system (JWT)
  - Implement role-based access control
  - Create API endpoints

- **Week 7-8**: Data Pipeline
  - Implement data governance agent
  - Build ETL pipeline (Census + OSM)
  - Connect frontend to real data

**By End of Month 2**: Full backend serving real data, frontend pages connected

### **Month 3: Polish + Launch** (~4 weeks)
- **Week 9-10**: Pages + Refinement
  - Complete Methods + About pages
  - Admin dashboard for data management
  - Accessibility & mobile testing

- **Week 11-12**: Deploy + Hardening
  - Security audit
  - Performance optimization
  - Production deployment
  - Researcher access setup

**By End of Month 3**: Ready for researcher access + community testing

---

## 📚 DETAILED DOCUMENTATION (When You Need Deep Dives)

| File | For | When to Read |
|------|-----|--------------|
| [MISSION.md](./MISSION.md) | Understanding WHY | First thing: reads in 2 min |
| [PROJECT.md](./PROJECT.md) | Quick tech overview | Get oriented on stack |
| [prompt.md](./prompt.md) | Complete project brief | Share with new team members |
| [architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md](./architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md) | Technical deep-dive (data model, APIs, ETL) | Understanding system design |
| ../README.md | Getting started + full system | Setting up local dev |
| ../IMPLEMENTATION_PLAN.md | Detailed phase breakdown | Deciding next steps |
| ../AGENT_ARCHITECTURE.md | How governance agents work | Building data pipeline |
| ../AGENT_INTEGRATION_GUIDE.md | How to use agents in code | Writing routes/ETL |
| ../HERO_PAGE_GUIDE.md | Hero page design system | Modifying landing page |

---

## 🔧 COMMON TASKS (Quick Actions)

### **I want to start building today**
1. Open [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)
2. Pick Option 1, 2, or 3
3. Follow "Starting the Next Phase" section

### **I need to understand the data model**
1. Read [AGENT_ARCHITECTURE.md](../AGENT_ARCHITECTURE.md)
2. Check `src/agents/types.ts` for TypeScript definitions
3. Review `lib/types/geo.ts` for geography types

### **I need to add a new page**
1. Create file in `components/pages/[PageName].tsx`
2. Export from components
3. Add route in `app/[page]/page.tsx`
4. Update Navigation component

### **I need to run the project locally**
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### **I need to deploy**
```bash
git push origin main
# Vercel auto-deploys
```

### **I need to check governance rules**
1. Open `src/agents/dataGovernanceAgent.ts`
2. Look for `GOVERNANCE_CONFIG`
3. Modify suppression rules as needed
4. Document why in a commit message

---

## 🎓 KEY CONCEPTS (Reference)

### **Census Tracts vs. ZIP Codes**
- **Tracts**: ~4,000 people, stable boundaries, Census Bureau standard, better for small-area data
- **ZIPs**: Postal boundaries, unstable, larger population, less precise
- **REP uses**: Tracts primarily, ZIPs as UI reference

### **Small-Number Suppression**
- Any metric with n < 11 is hidden (NCHS standard)
- Prevents identification of small groups
- Logged and auditable

### **Story Thresholds**
- Minimum 5 stories per neighborhood before display
- Prevents isolation of single voices
- Aggregates themes from multiple people
- Always anonymous

### **Data Governance Agent**
- Sits between database and frontend
- Enforces suppression rules
- Downgrades geography if insufficient data
- Logs every decision for audit trails
- Ensures IRB compliance

### **Choropleth Layers**
- Disease Burden: APOL1/FSGS prevalence by tract
- Care Access: Distance to nephrology, travel time
- Environmental Exposure: Poverty, fast food density, liquor stores
- Transit: Public transit access, walkability

---

## 🚨 CRITICAL SUCCESS FACTORS

**DO:**
- ✅ Keep individual-level data OFF the platform (always)
- ✅ Publish "What this map DOES NOT show" prominently
- ✅ Log all governance decisions (required for IRBs)
- ✅ Get community feedback before launch
- ✅ Test on mobile (your audience uses phones)
- ✅ Use real data as soon as possible (mock data deceives)

**DON'T:**
- ❌ Show individual health dots (ever)
- ❌ Make causal claims ("poverty CAUSES disease")
- ❌ Skip small-number suppression to show more data
- ❌ Deploy without IRB/legal review
- ❌ Collect stories without consent language
- ❌ Over-complicate the narrative (clarity is key)

---

## 📞 COMMUNICATION

**Internal Teams**:
- **Data/GIS**: Manages pipeline, geographic validation, suppression rules
- **Frontend**: Builds pages, handles UX, maps governance rules to UI
- **Backend**: Creates API, manages auth, handles data serving
- **Community**: Gathers feedback, validates narratives, shares in meetings

**External Partners**:
- **Community partners**: Early access, narrative feedback, story validation
- **Researchers**: Tract-level data access, methodology review
- **Funders/IRB**: Governance decision logs, suppression audits

**Weekly Syncs**:
- Monday: Week planning + blockers
- Wednesday: Data→Frontend handoff review
- Friday: Demo + metrics

---

## 📈 SUCCESS METRICS (Track Weekly)

| Metric | Current | Goal (3 mo) |
|--------|---------|------------|
| Pages complete | 2 | 6 |
| Data sources connected | 0 | 3 |
| Neighborhoods live | 0 | 50+ |
| Stories submitted | 0 | 100+ |
| Community partners | 0 | 5+ |
| API endpoints | 0 | 10+ |

---

## 🎯 YOUR VISUAL TASK TRACKER

**[→ OPEN: REP_TodoPlan.html](../REP_TodoPlan.html)** ← Click this every day.

This is an **interactive task dashboard** with:
- ✅ All tasks across 5 phases (colored by phase)
- 📊 Real-time progress tracking (click tasks to mark done)
- 🚨 Active blockers highlighted in red at the top
- 📈 Phase-by-phase breakdown of what's done vs. remaining
- 🏷️ Tags: Design, Build, Data, Story, Ethics, Infra, Research

**What it shows right now:**
- Phase 1 (NOW ACTIVE): Bronx frontend + map
- Phase 2 (PLANNED): Backend, database, ETL, governance
- Phase 3 (CRITICAL): Story system (has 3 blockers)
- Phase 4-5 (FUTURE): Research portal, national scale

**Use this to:**
- See what's blocking you this week
- Track team progress
- Prioritize next tasks
- Show stakeholders visual progress

---

## 🎬 NEXT IMMEDIATE ACTIONS (This Week)

1. **[ ] Review this dashboard** (you're reading it!)
2. **[ ] Open [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)** and decide: Data-First, UI-First, or Backend-First?
3. **[ ] Confirm team capacity**: Solo? Small team? Contractors?
4. **[ ] Set up environment**: Census API key, Anthropic key, local dev working?
5. **[ ] Choose your starting point** and begin Phase 1

---

## 🗺️ FOUNDER'S QUICK LINKS

**Strategic Docs:**
- [Full Project Vision](./MISSION.md)
- [3-Month Roadmap](../IMPLEMENTATION_PLAN.md)
- [Agent Architecture (Governance System)](../AGENT_ARCHITECTURE.md)

**Implementation Docs:**
- [Hero Page Design System](../HERO_PAGE_GUIDE.md)
- [Agent Integration Guide](../AGENT_INTEGRATION_GUIDE.md)

**Code Navigation:**
- [App Structure](../README.md#file-structure)
- [Tech Stack](./PROJECT.md#tech-stack)

**Deployment:**
- [Getting Started](../README.md#getting-started)
- [Development Workflow](../README.md#development-workflow)

---

## ✨ THE VISION

REP is not another health mapping tool. It's a **public accountability platform** that makes structural inequity **impossible to ignore**.

When a patient in the South Bronx reads that 19 people from their neighborhood report the same care access barrier, they see **proof**: "It's not me. It's the system."

When a journalist sees how APOL1 burden clusters in neighborhoods with food deserts and long transit times, they write **a story** that funders and policymakers can no longer dismiss.

When a researcher validates that correlation at scale, they publish in a journal that **matters**.

**That's REP.**

---

**Last Updated**: January 29, 2026
**Status**: Ready to build
**Your Move**: Pick a path and let's go 🚀

