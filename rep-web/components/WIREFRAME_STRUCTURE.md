# REP Wireframe Component Structure

This is the high-fidelity interactive wireframe for REP (Rare Renal Equity Project).

## File Organization

```
components/
├── REPWireframe.tsx              # Main app component (orchestrates everything)
├── Navigation.tsx                 # Fixed top navigation
├── WIREFRAME_STRUCTURE.md         # This file
│
└── pages/
    ├── HeroPage.tsx              # Home page with hero section
    ├── MapPage.tsx               # Interactive map explorer
    ├── NeighborhoodPage.tsx       # Signature neighborhood profile page
    ├── StoriesPage.tsx            # Story submission form
    ├── AboutPage.tsx              # About & commitment
    └── MethodsPage.tsx            # Methods & transparency

lib/
└── mockData.ts                    # Mock data (types + sample data)
```

## Component Architecture

### REPWireframe (Main App)
- **Purpose**: Root component that manages page navigation and state
- **State**:
  - `currentPage`: Which page to display (home, map, neighborhood, stories, about, methods)
  - `selectedZip`: Currently selected ZIP code for neighborhood view
- **Responsibilities**:
  - Render Navigation
  - Conditionally render pages based on `currentPage`
  - Manage page transitions
  - Handle ZIP code selection

### Navigation
- **Props**: `currentPage`, `onNavigate(page)`
- **Features**:
  - Fixed top navbar
  - Logo / branding
  - Navigation buttons for all pages
  - Active state indicator (underline)

### HeroPage
- **Props**: `onNavigate(page)`
- **Sections**:
  1. Hero section with headline + CTAs
  2. "What Makes REP Different" grid
  3. Pull quote section (dark)
  4. "How It Works" with visual diagram

### MapPage
- **Props**: `selectedZip`, `onSelectZip(zip)`, `onNavigate(page)`
- **Features**:
  - Mock map canvas (placeholder for MapLibre)
  - ZIP code markers (clickable)
  - Layer toggle controls
  - Neighborhood cards in sidebar
  - Link to neighborhood profile on ZIP click

### NeighborhoodPage
- **Props**: `selectedZip`, `onNavigate(page)`, `onReturn()`
- **The Signature Feature**: Shows:
  1. Header with stats (Burden Index, Travel time, Exposure Index, Story count)
  2. Data cards (Disease Context, Care Access, Structural Exposure)
  3. **"What Patients and Caregivers Report"** — The key feature
     - Top themes display
     - Story cards with quotes
     - Role + condition badges
     - Theme tags + dates

### StoriesPage
- **Props**: `selectedZip`
- **Features**:
  - Story submission form
  - ZIP code field (pre-filled if from map)
  - Role selector (Patient / Caregiver)
  - Condition dropdown
  - Theme multi-select buttons
  - Text area for story
  - Consent checkbox
  - "How stories become evidence" explanation

### AboutPage
- **Props**: `onNavigate(page)`
- **Sections**:
  1. Hero section (dark)
  2. Commitment + Who it's for
  3. REP is designed to be (grid)

### MethodsPage
- **Props**: None
- **Sections**:
  1. Data sources
  2. Safety & suppression rules
  3. What REP shows / doesn't show
  4. Governance & oversight

## Usage

### Import in your Next.js app:

```typescript
// app/page.tsx (or wherever you want the wireframe)

import REPWireframe from '@/components/REPWireframe';

export default function Home() {
  return <REPWireframe />;
}
```

### Current Implementation Notes

- **Styling**: Inline styles (React style objects) for now
  - Migration to Tailwind or CSS modules can happen later
  - Color palette: cream background (#faf7f3), dark charcoal (#1a1a1a), terracotta accent (#c45a3b)

- **Mock Data**: All data lives in `lib/mockData.ts`
  - Replace with real API calls when backend is ready
  - Types are defined (Neighborhood, Story, etc.)

- **Map**: Currently a placeholder grid
  - When ready, replace with actual MapLibre GL integration
  - GeoJSON will come from backend

- **State Management**: Simple React useState for now
  - When app scales, consider React Context or state management library
  - No global state needed yet

## Next Steps to Production

1. **Replace mock data** with API calls to your backend
2. **Integrate MapLibre GL** in place of mock map container
3. **Connect story form** to submission endpoint
4. **Add authentication** for role-based access (public, researcher, community partner, admin)
5. **Migrate styling** to Tailwind CSS or CSS modules
6. **Add loading states** and error handling
7. **Optimize images** and add accessibility features
8. **Test with real data** and community partners

## Styling System

All components use inline React styles for flexibility. Key variables:

```typescript
const colors = {
  cream: '#faf7f3',
  darkCharcoal: '#1a1a1a',
  terracotta: '#c45a3b',
  gray600: '#666',
  gray800: '#888',
  border: '#e8e4df'
};

const fonts = {
  serif: 'Georgia, serif',
  sans: 'system-ui, sans-serif'
};

const spacing = {
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '48px',
  xxl: '80px'
};
```

## Key Design Principles

1. **Editorial Authority**: Typography and spacing suggest journalistic credibility
2. **Human Warmth**: Color, curves, and imagery feel approachable
3. **Accessibility**: Sufficient contrast, clear hierarchy, readable font sizes
4. **Mobile-First**: Responsive grid layouts use `minmax()` for flexibility
5. **Performance**: No heavy dependencies, clean component structure

## Accessibility Checklist

- [ ] All buttons have clear hover states
- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels are properly associated with inputs
- [ ] Navigation is keyboard accessible
- [ ] Image alt text (when images added)
- [ ] Screen reader testing
- [ ] Mobile touch targets (min 44x44px)

## Testing Recommendations

Test these user flows:

1. **Home → Map**: Click "Explore the Map" CTA
2. **Map → Neighborhood**: Click a ZIP code marker
3. **Neighborhood → Stories**: Click "Share a story for [ZIP]"
4. **Stories form submission**: Fill form, click Submit
5. **Back button**: Return from neighborhood to map
6. **Navigation**: Use nav links to jump between pages

## Notes for Developers

- This wireframe is **high-fidelity but static**. No backend integration yet.
- All colors, typography, spacing are **intentional and consistent**.
- Components are **modular** — easy to swap out pages or refactor styling.
- The **story cards** on NeighborhoodPage are the **signature feature** — this is where patient voices matter most.
- **Ethics language** ("anonymous," "aggregated," "threshold") is baked into UI copy, not an afterthought.

---

**Not genetics. Geography and justice.**
