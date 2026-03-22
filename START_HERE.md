# START HERE

Welcome to **REP** — Rare Renal Equity Project.

If you're opening this repo for the first time, here's the path:

---

## 🎯 First: Read the Dashboard

**[→ Open docs/REP_FOUNDER_DASHBOARD.md](docs/REP_FOUNDER_DASHBOARD.md)**

This is your daily command center. It has:
- What REP does (one sentence)
- Current status + what's built
- This week's priorities
- Quick navigation to everything else

**Time to read**: 5-10 minutes

---

## 📚 Second: Understand the Vision

If you need deeper context, read in order:

1. **[docs/MISSION.md](docs/MISSION.md)** — Why REP exists + the one-sentence pitch (2 min)
2. **[docs/PROJECT.md](docs/PROJECT.md)** — Tech stack overview (2 min)
3. **[README.md](README.md)** — Full project architecture + setup (10 min)

---

## 🚀 Third: Start Building

1. **Open the dashboard** and review current status
2. **[Read IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** to choose your next phase
3. **Follow the phase instructions** to begin

Or, if you just want to run the code locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🗂️ Key Files by Use Case

### **If you're a developer...**
- [README.md](README.md) — Full setup + architecture
- [docs/architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md](docs/architecture/REP_SYSTEM_ARCHITECTURE_BLUEPRINT.md) — Detailed technical blueprint (data model, APIs, ETL, deployment)
- [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) — How the governance system works
- [AGENT_INTEGRATION_GUIDE.md](AGENT_INTEGRATION_GUIDE.md) — How to use agents in your code

### **If you're planning next phases...**
- [docs/REP_FOUNDER_DASHBOARD.md](docs/REP_FOUNDER_DASHBOARD.md) — Weekly priorities
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — 3 strategic options (Data-First, UI-First, Backend-First)

### **If you're designing the hero page...**
- [HERO_PAGE_GUIDE.md](HERO_PAGE_GUIDE.md) — Design system, colors, interactions

### **If you're building the data pipeline...**
- [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) — Data flow + suppression logic
- [DATA_PIPELINE_TASK.md](DATA_PIPELINE_TASK.md) — Detailed tasks

### **If you're working with the map...**
- [components/WIREFRAME_STRUCTURE.md](components/WIREFRAME_STRUCTURE.md) — Map component design
- [HERO_PAGE_GUIDE.md](HERO_PAGE_GUIDE.md) — Visual design reference

---

## 🎓 Quick Reference

**One-sentence pitch:**
> A public accountability platform that maps how where you live shapes kidney disease outcomes.

**Tech stack:**
- Frontend: Next.js 16, TypeScript, Tailwind, MapLibre GL
- Backend: Node.js, PostgreSQL (future PostGIS)
- Data: Python (ETL), Census API, OpenStreetMap API

**Current status:**
- ✅ Hero page complete
- ✅ Map explorer complete (mock data)
- 🔴 Everything else: not started or in progress

**Next priority:**
Choose a path from [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md):
- **Data-First** (Recommended): Build geographic + health data foundation
- **UI-First**: Build remaining pages with mock data
- **Backend-First**: Build API + authentication

---

## 🚨 CRITICAL: Visual Task Tracker

> **[OPEN: REP_TodoPlan.html](REP_TodoPlan.html)** — Your complete task planning dashboard
>
> This is a **visual, interactive tracker** of all 5 phases of REP development:
> - **Phase 1 (NOW ACTIVE)**: Bronx Prototype — Frontend, Map Explorer
> - **Phase 2**: Data Platform — Backend API, Database, ETL, Governance
> - **Phase 3 (CRITICAL PATH)**: Story System — Design, Build, Integration
> - **Phase 4**: Research Access Portal
> - **Phase 5**: National Expansion
>
> **Active Blockers** (blocking work right now):
> 1. ⚠️ Real census data not yet in database → blocks Map real data
> 2. ⚠️ PostGIS extension not configured → blocks spatial queries
> 3. ⚠️ Story System UX decision pending → blocks Phase 3 build
>
> **Open this file in your browser.** It's fully interactive:
> - ☑️ Check off completed tasks
> - 📊 Track progress by phase
> - 🔴 See active blockers at top
> - 📈 Real-time progress percentages

---

## ❓ Questions?

### "Where do I find X?"
→ Search the [FOUNDER DASHBOARD](docs/REP_FOUNDER_DASHBOARD.md) — it has a "Quick Navigation" section

### "How do I set up locally?"
→ Run:
```bash
npm install
npm run dev
```
Full instructions: [README.md → Getting Started](README.md#getting-started)

### "What's the next phase of work?"
→ Open [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) and pick Option 1, 2, or 3

### "How does the data governance work?"
→ [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md)

### "What are the ethical rules?"
→ [docs/REP_FOUNDER_DASHBOARD.md → Core Principles](docs/REP_FOUNDER_DASHBOARD.md#-core-principles-non-negotiable)

---

## 🚀 You're Ready

You now have everything you need to:
1. Understand what REP does
2. See what's built
3. Plan the next phase
4. Start coding

**Next step:**
[→ Open docs/REP_FOUNDER_DASHBOARD.md](docs/REP_FOUNDER_DASHBOARD.md) and start there.

Welcome aboard. Let's build something that matters. 🏥🗺️

