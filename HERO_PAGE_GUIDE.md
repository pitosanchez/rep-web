# REP Hero Page Development Guide

## Overview

The Hero Page is the landing page for REP. It introduces the platform, explains its mission, showcases patient stories, and drives users to explore the map or share their experience.

## Files

```
components/pages/HeroPage.tsx      # Main hero page component
app/page.tsx                        # Home route (uses REPWireframe)
app/hero/page.tsx                   # Standalone hero page route (/hero)
```

## Sections

### 1. Hero Section (85vh)
**Visual**: Gradient background with subtle grid pattern and accent shape
**Content**:
- Eyebrow: "A Public Accountability Platform"
- Main headline: "Where You Live Shapes _Kidney Disease_"
- Subheading: Context about APOL1 and FSGS
- CTAs: "Explore the Map" (primary) + "Share Your Experience" (secondary)

**Interactive**: Hover effects on buttons, smooth transitions

### 2. What Makes REP Different (4 cards)
**Content**: Four differentiators with icons
- Aggregation-First
- Stories Tied to Place
- Structural Visibility
- Built for Accountability

**Interactive**: Cards lift on hover with shadow effect, background color changes

### 3. Pull Quote Section (Dark background)
**Visual**: Dark (#1a1a1a) background with terracotta accent
**Content**:
- Large italicized quote about travel times and "noncompliance"
- Attribution: "South Bronx, NY · Aggregated from 19 submissions"

### 4. How It Works (Left text + Right diagram)
**Content**:
- "Disease does not happen in a vacuum"
- Explanation of REP's approach
- Visual diagram showing three layers: Genetic Context, Structural Conditions, Lived Experience
- "Learn more about REP" link

### 5. Featured Story Preview (3 story cards)
**NEW SECTION**: Real story previews
- Three example stories from different neighborhoods
- Each card shows: Quote, location, condition, theme
- Interactive hover: Lift up, shadow, cursor pointer
- Responsive grid (mobile-friendly)

### 6. Call to Action Banner (Dark background)
**Visual**: Dark background with accent circle shape
**Content**:
- Headline: "Ready to explore how place shapes disease?"
- Subheading: "Browse, read, or share"
- CTAs: "Explore the Map" + "Share Your Experience"

### 7. Trust Badges (Light background)
**Content**: Four badges showing platform principles
- IRB-Safe
- Auditable
- Community-Centered
- Publishable

## How to Use

### View in Browser

**Option 1: Full App**
```bash
npm run dev
# Visit http://localhost:3000
```

**Option 2: Standalone Hero Page**
```bash
npm run dev
# Visit http://localhost:3000/hero
```

### Import in Code

```typescript
import { HeroPage } from '@/components/pages/HeroPage';

<HeroPage onNavigate={(page) => console.log(page)} />
```

## Styling & Design

### Colors
```typescript
const colors = {
  cream: '#faf7f3',
  darkCharcoal: '#1a1a1a',
  terracotta: '#c45a3b',
  gray: '#666',
  lightGray: '#888',
  border: '#e8e4df'
};
```

### Typography
- **Serif headings**: Georgia
- **Body text**: system-ui, sans-serif
- **Font weights**: 400 (regular), 500 (medium), 600 (bold)

### Spacing
- **Padding**: 32px (standard), 48px (large), 80px (sections), 100px (section padding)
- **Gap**: 24px (cards), 32px (larger), 48px (extra)

### Interactive Elements
All buttons and cards use:
- Smooth transitions: `transition: 'all 0.2s ease'`
- Hover lift: `transform: 'translateY(-2px)' or translateY(-4px)`
- Shadow effects on hover
- Color changes on hover

## State Management

The HeroPage uses **one simple state variable**:

```typescript
const [hoveredDiff, setHoveredDiff] = useState<number | null>(null);
```

This tracks which "What Makes REP Different" card is currently hovered, allowing for the lift/shadow effect.

**Why state?** Provides visual feedback and makes the page feel interactive without any external dependencies.

## Responsive Design

The hero page uses CSS Grid with `minmax()` for responsive layouts:

```typescript
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
gap: '32px'
```

This means:
- **Desktop**: Multiple columns
- **Tablet**: 2 columns
- **Mobile**: Single column
- All automatic, no media queries needed!

## Font Sizes

Uses `clamp()` for responsive typography:

```typescript
fontSize: 'clamp(28px, 5vw, 48px)'
// Min: 28px, Preferred: 5% of viewport width, Max: 48px
```

## Animations & Transitions

### Button Hover
```typescript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}
```

### Card Hover (Featured Stories)
```typescript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-8px)';
  e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
}}
```

## Navigation

The `onNavigate` prop controls page transitions:

```typescript
<HeroPage onNavigate={(page) => {
  // 'page' can be: 'map', 'stories', 'about'
  // In full app, this triggers page change
  // In standalone, you can log or redirect
}} />
```

## Accessibility Considerations

- ✓ High contrast text (#1a1a1a on light backgrounds)
- ✓ Readable font sizes (min 15px body text)
- ✓ Clear button labels
- ✓ Focus states (inherited from browser)
- ✓ Semantic HTML (section, nav, etc.)
- ⚠️ TODO: Add ARIA labels for interactive elements
- ⚠️ TODO: Test keyboard navigation

## Testing Checklist

- [ ] Test button clicks (map, stories CTAs)
- [ ] Test hover effects on cards
- [ ] Test responsive layout on mobile/tablet
- [ ] Test font sizes scale correctly
- [ ] Verify colors match design palette
- [ ] Check contrast ratios (WCAG AA)
- [ ] Test accessibility with screen reader
- [ ] Verify animation smoothness
- [ ] Test on dark mode (if implemented)

## Performance Notes

- **No external dependencies**: Pure React + inline styles
- **No images yet**: Uses CSS shapes and gradients (scalable)
- **No animations on load**: Only on interaction (better performance)
- **Inline styles**: No CSS-in-JS library overhead

## Next Steps

1. **Add real story data** from backend API
2. **Integrate actual map** (currently link only)
3. **Add testimonials section** (optional)
4. **Optimize images** when added
5. **Add footer** with links and contact
6. **Implement dark mode** (if desired)
7. **A/B test CTAs** (measure click-through rates)

## Code Examples

### Basic Usage
```typescript
import { HeroPage } from '@/components/pages/HeroPage';

export default function Home() {
  return <HeroPage onNavigate={(page) => router.push(`/${page}`)} />;
}
```

### With Navigation Context
```typescript
import { HeroPage } from '@/components/pages/HeroPage';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <HeroPage
      onNavigate={(page) => {
        window.scrollTo(0, 0);
        router.push(`/${page}`);
      }}
    />
  );
}
```

## Design Philosophy

The hero page embodies REP's core values:

1. **Clear authority**: Editorial typography, professional layout
2. **Human warmth**: Warm colors, patient stories, genuine tone
3. **Structural focus**: Emphasize place, not individuals
4. **Privacy first**: Stories aggregated by neighborhood
5. **Ethical design**: Transparency about what data shows/doesn't show

Every visual choice serves the mission: **"Where You Live Shapes Kidney Disease"**

---

**Questions?** Check the component code comments or refer to [WIREFRAME_STRUCTURE.md](./components/WIREFRAME_STRUCTURE.md).
