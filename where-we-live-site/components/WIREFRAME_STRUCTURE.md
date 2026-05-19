# Component Structure

Where We Live — Rare Renal Equity Project

## File Organization

```
where-we-live-site/components/
├── REPWireframe.tsx              # Root app (page state machine + ZIP state)
├── Navigation.tsx                # Fixed top nav + language switcher
├── MapLibreMap.tsx               # Interactive MapLibre GL map
├── LanguageSwitcher.tsx          # EN/ES toggle
│
└── pages/
    ├── HeroPage.tsx              # Home: mission, CTAs, story previews
    ├── MapPage.tsx               # Map Explorer: floating panels, layer controls
    ├── NeighborhoodPage.tsx      # Neighborhood Profile: WWLI + signals + stories
    ├── StoriesPage.tsx           # Stories: submission form + reading view
    ├── AboutPage.tsx             # About: editorial chapter layout
    ├── MethodsPage.tsx           # Methods: data transparency
    ├── KidneyDiseasePage.tsx     # CKD: CDC stats, SVG charts, stage viz
    ├── Apol1Page.tsx             # APOL1-mediated kidney disease
    └── FsgsPage.tsx              # Focal Segmental Glomerulosclerosis
```

## Navigation / Page Routing

REPWireframe manages `currentPage` state — no URL routing, all client-side.

Valid page keys: `home`, `map`, `neighborhood`, `stories`, `about`, `methods`, `kidney-disease-overview`, `apol1`, `fsgs`

```tsx
// REPWireframe.tsx
const [currentPage, setCurrentPage] = useState('home');
const [selectedZip, setSelectedZip] = useState<string | null>(null);

const handleNavigate = (page: string) => setCurrentPage(page);
const handleSelectZip = (zip: string) => setSelectedZip(zip);
```

## Component Details

### REPWireframe
- Manages `currentPage` + `selectedZip` state
- Passes `onNavigate` and `onSelectZip` to children
- Renders `Navigation` + whichever page is active

### Navigation
- Fixed top bar, `z-index: 1000`
- Dropdown: Kidney Disease → (Kidney Disease, APOL1, FSGS)
- Language switcher (EN / ES)
- Props: `currentPage`, `onNavigate`

### MapLibreMap
- MapLibre GL JS, edge-to-edge rendering
- 5 choropleth layers: Disease Burden, Care Access, Environmental Exposure, Transit, Area Deprivation Index
- Props: `selectedZip`, `onZipClick`, `visibleLayers`
- Click ZIP → calls `onZipClick(zip)` → parent navigates to neighborhood

### MapPage
- Floating glass Panel UI over full-viewport map
- Top-left: identity panel
- Left: collapsible layer toggle panel
- Bottom-center: selected ZIP bar (or pulsing prompt)

### NeighborhoodPage
Fetches from two APIs:
- `GET /api/geo/neighborhood-profile?zip=` → WWLI, residentialBurden, structuralWeight, tier
- `GET /api/stories/signals-by-zip?zip=` → 12 AI signal averages + SBI score

Components rendered:
- `WwliGauge` — SVG arc 0–100
- `SignalBar` — 12-bar chart with ghost mode when no stories
- Stories section — fetched from `/api/stories/by-zip`

### StoriesPage
- Controlled form: zip, role, condition, storyText, consent
- `POST /api/stories` on submit
- `StoryReadingView` — immersive full-screen reading on card click
- `StoryCard` — featured (large) and standard variants

### KidneyDiseasePage
- `DonutChart` — SVG donut for ESKD causes + treatment split
- `RaceBar` — horizontal bar chart for racial disparity
- Stage progression: 6 vertical bars, color-coded
- All CDC data sourced from March 2026 + 2023 Fact Sheets

## Design System

All styles are inline React objects. No Tailwind, no CSS modules.

```typescript
// Colors
'#c45a3b'   // Terracotta accent
'#1a1a1a'   // Near-black text
'#faf7f3'   // Warm cream (section alternating bg)
'#fff'      // White (section alternating bg)

// Typography
fontFamily: 'Georgia, serif'          // Headings, pull quotes
fontFamily: 'system-ui, sans-serif'   // Body, labels, UI

// Chapter labels (terracotta, 11px, 3px letter-spacing, uppercase)
// Rule dividers (48px wide, 1px height)
// Section padding: 80px vertical, 32px horizontal
```

## Data Flow

```
User clicks ZIP on map
  → MapLibreMap.onZipClick(zip)
  → REPWireframe: setSelectedZip + navigate('neighborhood')
  → NeighborhoodPage fetches /api/geo/neighborhood-profile + /api/stories/signals-by-zip
  → Renders WWLI, signals, stories

User submits story
  → StoriesPage POST /api/stories
  → Next.js API route stores to PostgreSQL
  → Triggers Python service POST /analyze-story
  → Claude extracts 12 signals
  → Signals stored in story_signals table
  → Aggregated at /api/stories/signals-by-zip
```

## Notes for Developers

- All components are `'use client'` — this is a client-side SPA within Next.js
- No router.push() calls — navigation is all `onNavigate(page)` prop callbacks
- DB pool in `lib/db.ts` is lazy (Proxy pattern) — safe for Vercel build-time imports
- Translations live in `messages/en.json` and `messages/es.json`
- When adding a new page: add to REPWireframe state machine + Navigation component + messages files

---

**Not genetics. Geography and justice.**
