# Cost of Living Burden Layer + Map Layer Audit + ADI Enhancement

**Date:** April 2026  
**Branch:** `feat/cost-of-living-burden-layer`

---

## What Was Built

A new primary map layer, three API routes, a reusable cost dashboard component, and a formal layer audit config that documents every map layer's data provenance and keep/remove decisions.

---

## New Files

### `where-we-live-site/lib/mapLayers.config.ts`

Formal audit of all map layers. Each entry contains:

```typescript
{
  id: string;
  name: string;
  description: string;
  data_source: string;          // Where the underlying data actually comes from
  value_type: 'ratio' | 'percentile' | 'index' | 'percent';
  is_core: boolean;             // Drives a primary platform narrative
  keep: boolean;                // Audit decision: keep in production
  default_on: boolean;          // Default visibility on map load
  is_approximate: boolean;      // Proxy/derived metric, not direct measurement
  map_layer_id: string;         // MapLibre layer ID
  state_key: string;            // visibleLayers key in MapPage
  gradient: string;             // CSS color gradient for legend
}
```

**Audit decisions:**

| Layer | Decision | Reason |
|---|---|---|
| Cost Burden | **NEW — default ON** | Primary structural equity signal (TCOL-based) |
| Disease Burden | Keep (proxy) | Core narrative, data is `weight_tot` approximation |
| Care Access | Keep (proxy) | Core narrative, data is `weight_res` approximation |
| Environmental Exposure | Keep (approximate) | Derived from latitude + `weight_tot` |
| Transit | **Flagged — `keep: false`** | Uses same `weight_tot` source as Disease Burden — duplicate signal |
| Area Deprivation Index | Keep + Enhanced | Block-group polygons, normalized to national percentile 0–100 |

---

### `where-we-live-site/app/api/cost-of-living/route.ts`

**Endpoint:** `GET /api/cost-of-living?geo_id=ZIP`

Returns TCOL-based monthly cost breakdown for a reference household (1 adult + 1 child) in any of the 26 Bronx ZIP codes. Omit `geo_id` to get all ZIPs.

**Response shape:**
```json
{
  "success": true,
  "data": {
    "zip": "10451",
    "neighborhood": "Mott Haven",
    "costs": {
      "housing": 1450,
      "food": 690,
      "transport": 395,
      "healthcare": 460,
      "childcare": 1150,
      "other": 510
    },
    "required_income": 56460,
    "median_income": 25800,
    "income_gap": 30660,
    "cost_burden_ratio": 2.188
  }
}
```

`cost_burden_ratio = required_income / median_income`. Values above 1.0 mean basic needs exceed what most households earn.

---

### `where-we-live-site/app/api/adi/route.ts`

**Endpoint:** `GET /api/adi?geo_id=ZIP`

ZIP-level Area Deprivation Index, distinct from the block-group endpoint (`/api/adi/blockgroups`). Returns:
- `adi_natrank_avg` — average national rank across block groups in the ZIP
- `adi_percentile` — normalized 0–100 (higher = greater deprivation)
- `deprivation_tier` — `low | moderate | high | very_high`

---

### `where-we-live-site/app/api/neighborhood-summary/route.ts`

**Endpoint:** `GET /api/neighborhood-summary?geo_id=ZIP`

Aggregates cost-of-living, ADI, and the **Structural Strain Index** (SSI) into a single response.

**SSI Formula:**
```
cost_norm = clamp((cost_burden_ratio - 0.7) / (2.5 - 0.7), 0, 1)
SSI = (cost_norm × 0.55 + adi_percentile / 100 × 0.45) × 100
```

- SSI range: 0–100  
- Weights: cost burden 55%, area deprivation 45%  
- Tiers: 0–33 lower · 34–66 moderate · 67–100 high

---

### `where-we-live-site/components/NeighborhoodCostDashboard.tsx`

Reusable `'use client'` component that fetches `/api/neighborhood-summary` and renders:

1. **Monthly total callout** — large number with color-coded burden ratio badge (blue/amber/red)
2. **Stacked cost bar** — proportional horizontal bar with category legend

   | Category | Color |
   |---|---|
   | Housing | `#dc2626` red |
   | Food | `#d97706` orange |
   | Transport | `#2563eb` blue |
   | Healthcare | `#16a34a` green |
   | Childcare | `#7c3aed` purple |
   | Other | `#6b7280` gray |

3. **Income comparison** — Required vs. median income as proportional bars with annual shortfall callout when `income_gap > 0`
4. **Structural Strain Index gauge** — 0–100 bar with tier label and tier-colored display number

Skeleton loaders shown during fetch. Supports a `compact` prop for embedding inside NeighborhoodPage.

**Usage:**
```tsx
import NeighborhoodCostDashboard from '@/components/NeighborhoodCostDashboard';

<NeighborhoodCostDashboard zip="10451" />
<NeighborhoodCostDashboard zip="10471" compact />
```

---

## Modified Files

### `where-we-live-site/components/MapLibreMap.tsx`

- Added `costBurden: boolean` to `visibleLayers` interface
- Fetches `/api/cost-of-living` at map load time and merges `cost_burden_ratio` into every GeoJSON feature's properties
- New `bronx-cost-burden` circle layer with color scale:
  - `0.7×` → blue `#3b82f6` (low burden)
  - `1.0×` → amber `#f59e0b` (at threshold)
  - `1.5×` → red `#ef4444` (high burden)
  - `2.5×` → dark red `#7f1d1d` (severe burden)
- Hover popup now shows cost burden ratio badge with color-coded background
- Layer included in opacity adjustment logic alongside other ZIP-level layers

### `where-we-live-site/components/pages/MapPage.tsx`

- `costBurden: true` is now the default-on layer (Disease Burden switched to `false`)
- Cost Burden layer appears first in the layer toggle panel
- Blue→amber→red gradient shown in layer legend

### `where-we-live-site/messages/en.json` + `where-we-live-site/messages/es.json`

Added:
- `"costBurden"` — display label
- `"costBurdenDesc"` — layer description shown in the layer panel

---

## Data Notes

- Cost data is **mock TCOL** calibrated to 2023–2024 ACS + NYC DHS estimates for a 1 adult + 1 child household
- Base non-housing costs are constant across all Bronx ZIPs (food $690, transport $395, healthcare $460, childcare $1,150, other $510/month)
- Housing and median income vary by ZIP based on known neighborhood economics
- ADI data is derived from University of Wisconsin NNHC ADI (2022 vintage) aggregated to ZIP level
- Both datasets should be replaced with live data sources when available (see `data_source` field in `mapLayers.config.ts`)

---

## Structural Strain Index — Sample Values

| ZIP | Neighborhood | Cost Ratio | ADI Pct | SSI | Tier |
|---|---|---|---|---|---|
| 10454 | Mott Haven – Port Morris | 2.31 | 97 | 99.9 | High |
| 10451 | Mott Haven | 2.19 | 96 | 96.3 | High |
| 10459 | Longwood – Hunts Point | 2.00 | 93 | 89.9 | High |
| 10461 | Pelham Parkway South | 1.54 | 64 | 73.6 | High |
| 10469 | Co-op City | 1.45 | 48 | 60.0 | Moderate |
| 10471 | Riverdale | 1.02 | 18 | 9.3 | Lower |
