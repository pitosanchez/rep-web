# REP Agent Architecture

## Overview

REP uses a **governance-first, bounded-intelligence** agent system. Agents are single-responsibility units that enforce safety rules, fetch external data, or compute aggregations.

**Core principle**: _Nothing touches raw data. Everything flows through governance._

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
│                                                             │
│  - Interactive map (MapLibre GL)                           │
│  - Neighborhood profiles (/neighborhood/[geoid])           │
│  - Story displays                                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ Governance-Approved Data Only
        ┌──────────────────────────────────────┐
        │  Data Governance Agent               │
        │  (src/agents/dataGovernanceAgent.ts) │
        │                                      │
        │  ✓ Check minimum cell size           │
        │  ✓ Downgrade geographies             │
        │  ✓ Block individual inference        │
        │  ✓ Flag uncertainty                  │
        └──────────┬───────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
┌──────────────────┐    ┌────────────────────────┐
│ LLM Narrative    │    │ Role-Based Filtering   │
│ Agent            │    │ (src/lib/permissions)  │
│ (Frontend-safe)  │    │                        │
└──────────────────┘    │ - Public → County only │
                        │ - Researcher → Tract   │
                        │ - Community → Tract    │
                        │ - Admin → All data     │
                        └────────────────────────┘


┌────────────────────────────────────────────────────────────┐
│         BACKEND DATA PIPELINE (Server-Side Only)           │
│                                                            │
│  ┌─────────────┐      ┌─────────────┐                    │
│  │ Census API  │      │ Overpass    │                    │
│  │ Agent       │      │ OSM Agent   │                    │
│  │ (fetch)     │      │ (fetch)     │                    │
│  └──────┬──────┘      └──────┬──────┘                    │
│         │                    │                           │
│         └────────┬───────────┘                           │
│                  ▼                                        │
│  ┌────────────────────────────────┐                     │
│  │  ETL Agents (Backend)           │                     │
│  │                                │                     │
│  │ • Spatial join POIs to tracts   │                     │
│  │ • Aggregate counts              │                     │
│  │ • Calculate indices             │                     │
│  │ • Apply suppression             │                     │
│  └────────────┬───────────────────┘                     │
│               ▼                                          │
│  ┌────────────────────────────────┐                     │
│  │  Clean, Aggregated Data Store  │                     │
│  │  (GeoJSON → PostGIS)            │                     │
│  └────────────────────────────────┘                     │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Agent Types

### 1️⃣ Frontend Agents (Safety-Gated)

#### **Data Governance Agent** (`src/agents/dataGovernanceAgent.ts`)
- **Purpose**: Gatekeeper for all frontend data
- **Runs**: Before rendering, before narration, before export
- **Rules**:
  - ✓ Minimum cell size (n ≥ 11)
  - ✓ Geography downgrading (ZIP → tract → county)
  - ✓ Individual inference blocking
  - ✓ Uncertainty disclaimers
  - ✓ Asset framing requirements
- **Output**: `GovernanceCheckResult` with `allow/block/downgrade` decisions
- **Audit**: Logs every decision for IRB/funder review

#### **LLM Narrative Agent** (`src/agents/llmNarrativeAgent.ts`)
- **Purpose**: Translate pre-approved data into plain language
- **Constraints**:
  - ✓ No causal claims ("poverty causes disease")
  - ✓ No genetic-deterministic language
  - ✓ Always explain what the map DOES NOT show
  - ✓ Frame with assets + burdens
  - ✓ Use plain language (short sentences, no jargon)
- **Input**: `NarrativeContext` (governance-approved data only)
- **Output**: `Narrative` (summary, insights, uncertainty, assets)
- **Safety Check**: Scans for unsafe patterns; falls back to safe template if LLM violates guardrails

---

### 2️⃣ Role-Based Access Control

#### **Permissions Module** (`src/lib/permissions.ts`)
- **Roles**: `public` | `researcher` | `community_partner` | `admin`
- **Controls**:
  - Data resolution (county vs. tract vs. all)
  - Export capability
  - Cell count visibility
  - Governance metadata visibility
  - Annotation rights
- **Usage**: Filter datasets before rendering; block unauthorized exports

---

### 3️⃣ External Data Agents (Fetch-Only)

#### **Census Agent** (`src/agents/censusAgent.ts`)
- **Purpose**: Fetch raw Census/ACS data
- **No transformation**: Returns raw API responses
- **Supported variables**: Poverty, education, income, housing (Bureau-defined)
- **Caching**: 7-day TTL (Census data released annually)
- **Rate limiting**: Respects Census API limits

#### **Overpass Agent** (`src/agents/overpassAgent.ts`)
- **Purpose**: Fetch raw POI data from OpenStreetMap
- **No aggregation**: Returns raw GeoJSON
- **Supported POIs**: Fast food, alcohol, groceries, transit, clinics
- **Caching**: 30-day TTL (OSM changes frequently)
- **Rate limiting**: 5-second delays between requests (respects Overpass)

---

### 4️⃣ Backend ETL Agents (Server-Only)

#### **Suppression Agent** (`backend/agents/etl/suppressionAgent.ts`)
- **Purpose**: Apply small-number suppression
- **Rules**:
  - Block metrics with n < 11 (NCHS standard)
  - Set value to `null` (never reveal why)
  - Document in metadata (not in user view)
- **Output**: Suppressed dataset + audit log
- **Never exposed to frontend**

#### **Burden Index Agent** (`backend/agents/etl/burdenIndexAgent.ts`)
- **Purpose**: Compute composite burden index
- **Factors** (weighted):
  - Poverty (25%)
  - Fast food density (15%)
  - Alcohol store density (15%)
  - Food desert severity (20%)
  - Education attainment (15%)
  - Transit access (10%)
- **Score**: 0–100 (higher = more structural burden)
- **Confidence**: High / Medium / Low (based on data completeness)
- **Key**: Explicitly NOT causal; shows co-occurrence of structural factors

---

## Geography Utilities (`src/lib/geography.ts`)

Helpers for working with census geographies:
- **GEOID parsing**: Extract state, county, tract from FIPS codes
- **GEOID validation**: Check format
- **Geography context building**: Create structured geographic objects
- **Geography downgrading**: Move from tract → county when needed
- **Bounding boxes**: Work with [minLon, minLat, maxLon, maxLat]

---

## Data Types (`src/agents/types.ts`)

All agents share these types:

```typescript
// Raw data (before governance)
RawDataset {
  geographies: GeographicContext[]
  metrics: Record<string, number | null>
  cellCounts: Record<string, number>
  source: "census" | "osm" | "user_story" | "computational"
}

// Safe data (after governance)
GovernanceApprovedDataset {
  ...RawDataset
  appliedRules: string[]
  downgradedFrom?: "tract" | "county" | "zip"
  warnings: GovernanceWarning[]
  governanceCheckedAt: Date
}

// Context for LLM narration (pre-aggregated)
NarrativeContext {
  geography: GeographicContext
  metrics: Record<string, number | null>
  metricLabels: Record<string, string>
  warnings: GovernanceWarning[]
  confidence: Record<string, "high" | "medium" | "low">
  assets?: Record<string, string | number>
  burdens?: Record<string, string | number>
}
```

---

## Data Flow: Example

### Story: Rendering a neighborhood map

1. **User requests neighborhood** → `/neighborhood/[geoid]`

2. **Backend fetches aggregated data**
   - GeoJSON from database (already computed by ETL)
   - Contains: Poverty %, fast food density, etc.
   - Has cell counts (hidden from frontend)

3. **Data Governance Agent checks**
   - ✓ All cell counts ≥ 11?
   - ✓ No individual-level inference risk?
   - ✓ All uncertain metrics flagged?
   - → Returns `GovernanceApprovedDataset`

4. **Role-based filtering**
   - User is "public"?
   - ✓ Filter to county-level only
   - ✓ Hide cell counts
   - → Returns `GovernanceApprovedDataset` (downgraded)

5. **Render to map**
   - MapLibre displays safe tract boundaries
   - Choropleth colors (poverty %)
   - POI layer (fast food, alcohol)

6. **Generate narrative**
   - LLM receives `NarrativeContext` (pre-approved data)
   - System prompt enforces guardrails
   - Safety check scans output for causal language
   - Returns safe `Narrative` with:
     - Summary
     - "What it DOES show"
     - **"What it DOES NOT show"** (critical)
     - Uncertainty language
     - Asset context

7. **User sees**
   - Map with safe data
   - Plain-language explanation
   - No individual health data
   - No genetic claims
   - No causal language
   - Clear uncertainty statements

---

## Development Checklist

- [ ] **Phase 1: Governance Infrastructure**
  - [ ] Set up type system (`src/agents/types.ts`)
  - [ ] Implement data governance agent with rules
  - [ ] Test suppression logic
  - [ ] Create audit logging

- [ ] **Phase 2: External Data**
  - [ ] Set up Census API authentication
  - [ ] Implement Census agent
  - [ ] Test with sample counties
  - [ ] Implement Overpass agent
  - [ ] Set up caching

- [ ] **Phase 3: Backend ETL**
  - [ ] Build spatial join logic (POIs → tracts)
  - [ ] Implement aggregation
  - [ ] Apply suppression
  - [ ] Compute burden indices
  - [ ] Store safe outputs

- [ ] **Phase 4: LLM Integration**
  - [ ] Set up Anthropic API key
  - [ ] Implement narrative generation
  - [ ] Build safety checks
  - [ ] Test with domain experts
  - [ ] Implement fallback template

- [ ] **Phase 5: Frontend + Roles**
  - [ ] Integrate governance agent in API layer
  - [ ] Implement role-based filtering
  - [ ] Build permission checks
  - [ ] Set up user signup/verification
  - [ ] Create export endpoints

- [ ] **Phase 6: Community Testing**
  - [ ] Engage community partners
  - [ ] Test narratives for accuracy + tone
  - [ ] Audit data suppression decisions
  - [ ] Gather feedback on map readability
  - [ ] Refine uncertainty language

---

## Security & Compliance

### Governance Rules (Non-Negotiable)
- ✓ Minimum cell size ≥ 11 (NCHS standard)
- ✓ No individual-level data shown
- ✓ Geography downgraded if insufficient sample
- ✓ Uncertainty disclosed
- ✓ Asset framing always present

### Audit Trail
- Every governance decision logged with reasoning
- Every data access logged (user, role, dataset, timestamp)
- Suppression decisions documented
- LLM responses checked for policy violations

### Transparency
- Metadata explains what data is shown + hidden
- "What this map DOES NOT show" section is mandatory
- Uncertainty statements required
- Community partners can see governance decisions

### Compliance
- IRB-safe: No individual-level data leaked
- HIPAA-aligned: Small-number suppression + aggregation
- Funder-friendly: Audit trail + governance reports
- Open-source ready: Clear documentation + testing

---

## Next Steps

1. **Read this file**: Understand the architecture
2. **Review agent files**: Understand function signatures and constraints
3. **Implement Phase 1**: Set up governance infrastructure
4. **Test with sample data**: Use a real county + neighborhoods
5. **Involve community**: Share architecture + narrative outputs with partners
6. **Iterate**: Refine rules based on feedback

---

## References

- **NCHS Small-Number Suppression**: https://www.cdc.gov/nchs/data_access_files/guidelines.htm
- **Census Tract Info**: https://www.census.gov/topics/housing/census-tracts.html
- **ACS Data Documentation**: https://www.census.gov/data/developers/data-sets/acs-5year.html
- **OpenStreetMap Wiki**: https://wiki.openstreetmap.org/
- **Overpass API**: https://overpass-api.de/

---

**Built with clarity, governance, and equity in mind.**
