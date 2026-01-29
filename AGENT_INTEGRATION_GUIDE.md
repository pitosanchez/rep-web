# REP Agent Integration Guide

How to use the agent system in your Next.js frontend and backend routes.

---

## Quick Reference

| Agent | File | Use Case | Runs On | Returns |
|-------|------|----------|---------|---------|
| **Data Governance** | `src/agents/dataGovernanceAgent.ts` | Gate all frontend data | Backend API | ✓/✗ + warnings |
| **LLM Narrative** | `src/agents/llmNarrativeAgent.ts` | Generate plain-language text | Backend API | Story text |
| **Census** | `src/agents/censusAgent.ts` | Fetch Census/ACS data | Backend (scheduled) | Raw API response |
| **Overpass** | `src/agents/overpassAgent.ts` | Fetch OSM POIs | Backend (scheduled) | Raw GeoJSON |
| **Suppression** | `backend/agents/etl/suppressionAgent.ts` | Hide small-n cells | Backend (scheduled) | Suppressed dataset |
| **Burden Index** | `backend/agents/etl/burdenIndexAgent.ts` | Compute composite index | Backend (scheduled) | Score 0–100 |

---

## Frontend Routes

### Example: `/api/neighborhood/[geoid]`

Fetch data for a single neighborhood:

```typescript
// app/api/neighborhood/[geoid]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { validateDataset } from "@/agents/dataGovernanceAgent";
import { filterDatasetByRole } from "@/lib/permissions";
import { getPermissions } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { geoid: string } }
) {
  const { geoid } = params;

  // Get user role from session/JWT
  const userRole = (request.headers.get("x-user-role") ||
    "public") as UserRole;

  try {
    // 1. Fetch aggregated data from database
    // (This was computed offline by ETL pipeline)
    const rawData = await fetchNeighborhoodDataFromDB(geoid);

    // 2. Run through governance agent
    const governanceResult = validateDataset(rawData);

    if (!governanceResult.isAllowed) {
      return NextResponse.json(
        { error: "Data unavailable: " + governanceResult.userMessage },
        { status: 403 }
      );
    }

    // 3. Apply role-based filtering
    const filtered = filterDatasetByRole(
      governanceResult.approvedData!,
      userRole
    );

    if (!filtered) {
      return NextResponse.json(
        {
          error: "You do not have access to data at this resolution",
        },
        { status: 403 }
      );
    }

    // 4. Optionally generate narrative
    const narrative = await generateNarrative({
      geography: filtered.dataset.geographies[0],
      metrics: filtered.dataset.metrics,
      metricLabels: METRIC_LABELS,
      warnings: filtered.dataset.warnings,
      confidence: getConfidenceByMetric(filtered.dataset),
    });

    // 5. Return safe data to frontend
    return NextResponse.json({
      geoid,
      data: filtered.dataset,
      narrative,
      role: userRole,
      permissions: getPermissions(userRole),
    });
  } catch (error) {
    console.error("[neighborhood API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch neighborhood data" },
      { status: 500 }
    );
  }
}
```

**Frontend usage:**

```typescript
// app/neighborhood/[geoid]/page.tsx

import { useEffect, useState } from "react";
import MapComponent from "@/components/Map";

export default function NeighborhoodPage({
  params,
}: {
  params: { geoid: string };
}) {
  const [data, setData] = useState(null);
  const [narrative, setNarrative] = useState(null);

  useEffect(() => {
    // Fetch from API route
    fetch(`/api/neighborhood/${params.geoid}`)
      .then(r => r.json())
      .then(result => {
        setData(result.data);
        setNarrative(result.narrative);
      });
  }, [params.geoid]);

  return (
    <div>
      {/* Map: receives only safe, filtered data */}
      <MapComponent data={data} />

      {/* Narrative: plain-language explanation */}
      {narrative && (
        <section className="narrative">
          <h2>About this neighborhood</h2>
          <p>{narrative.summary}</p>

          <h3>What this map shows</h3>
          <ul>
            {narrative.whatItShows.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>What this map does NOT show</h3>
          <ul>
            {narrative.whatItDoesNotShow.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <div className="disclaimer">
            <strong>Uncertainty:</strong> {narrative.uncertaintyStatement}
          </div>

          {narrative.assetContext && (
            <div className="assets">
              <strong>Community strengths:</strong> {narrative.assetContext}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
```

---

### Example: `/api/export`

Allow researchers to export data:

```typescript
// app/api/export/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  const userRole = (request.headers.get("x-user-role") ||
    "public") as UserRole;

  // Check permission
  if (!hasPermission(userRole, "canExport")) {
    return NextResponse.json(
      { error: "You do not have export permission" },
      { status: 403 }
    );
  }

  const { geoids, format } = await request.json();

  // format: "csv" | "geojson" | "shapefile"

  try {
    // 1. Fetch data for requested geographies
    const datasets = await Promise.all(
      geoids.map(geoid => fetchNeighborhoodDataFromDB(geoid))
    );

    // 2. Run each through governance agent
    const approved = datasets.map(d => validateDataset(d).approvedData);

    // 3. Filter by role
    const filtered = approved.map(d =>
      filterDatasetByRole(d, userRole)?.dataset || d
    );

    // 4. Convert to requested format
    const exported = await convertToFormat(filtered, format);

    // 5. Return with appropriate headers
    return new NextResponse(exported, {
      headers: {
        "Content-Type": getContentType(format),
        "Content-Disposition": `attachment; filename="rep-export.${getFileExtension(format)}"`,
      },
    });
  } catch (error) {
    console.error("[export API] Error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
```

---

## Backend Routes: Scheduled ETL

### Example: Daily Data Pipeline

```typescript
// lib/etl/pipeline.ts

import { fetchCensusData } from "@/agents/censusAgent";
import { fetchPOIData } from "@/agents/overpassAgent";
import { applySuppressionToGeography } from "@/backend/agents/etl/suppressionAgent";
import { calculateBurdenIndex } from "@/backend/agents/etl/burdenIndexAgent";

/**
 * Daily ETL job (runs server-side only, never on client)
 * Fetch → Aggregate → Suppress → Index → Store
 */
export async function runETLPipeline(
  countyGEOID: string
) {
  console.log(`[ETL] Starting pipeline for county ${countyGEOID}`);

  // 1. Fetch raw Census data
  console.log("[ETL] Fetching Census data...");
  const censusResponse = await fetchCensusData(
    countyGEOID.substring(0, 2), // state
    countyGEOID.substring(2, 5), // county
    [
      "B17001_001E", // poverty total
      "B17001_002E", // poverty below line
      "B19001_001E", // household income
    ]
  );

  // 2. Fetch raw OSM data
  console.log("[ETL] Fetching OSM POIs...");
  const osmResponse = await fetchMultiplePOITypes(
    ["fast_food", "alcohol", "supermarket", "public_transport"],
    getCountyBoundingBox(countyGEOID)
  );

  // 3. Spatial join + aggregate
  console.log("[ETL] Aggregating to census tracts...");
  const aggregated = await spatialJoinAndAggregate({
    censusData: censusResponse.rawData,
    poisData: Array.from(osmResponse.values()).map(r => r.rawData),
    targetGeography: "tract",
  });

  // 4. Apply suppression
  console.log("[ETL] Applying suppression rules...");
  const suppressed = applySuppressionBatch(aggregated);

  // 5. Compute burden indices
  console.log("[ETL] Computing burden indices...");
  const burdenIndices = calculateBurdenIndexBatch(aggregated);

  // 6. Store in database
  console.log("[ETL] Storing results...");
  await saveToDatabase({
    county: countyGEOID,
    tracts: suppressed,
    indices: burdenIndices,
    timestamp: new Date(),
  });

  console.log(`[ETL] Pipeline complete for ${countyGEOID}`);
}
```

**Schedule with cron** (e.g., Vercel Cron, AWS Lambda):

```typescript
// app/api/cron/etl/route.ts

import { runETLPipeline } from "@/lib/etl/pipeline";

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Run ETL for each county in the platform
    const counties = await getCountiesToProcess();

    for (const countyGEOID of counties) {
      await runETLPipeline(countyGEOID);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[cron] ETL failed:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
```

---

## Testing Agents Locally

### Test Data Governance

```typescript
// __tests__/dataGovernance.test.ts

import { validateDataset } from "@/agents/dataGovernanceAgent";

describe("Data Governance Agent", () => {
  it("should suppress metrics with small n", () => {
    const dataset = {
      geographies: [
        { geoid: "06001403100", resolutionLevel: "tract" as const },
      ],
      metrics: {
        poverty_pct: 25,
      },
      cellCounts: {
        poverty_pct: 5, // < 11, should be suppressed
      },
      source: "census" as const,
      timestamp: new Date(),
    };

    const result = validateDataset(dataset);

    expect(result.isAllowed).toBe(false);
    expect(result.decisions.some(d => d.rule === "minimum_cell_size")).toBe(
      true
    );
  });

  it("should allow metrics with sufficient n", () => {
    const dataset = {
      geographies: [
        { geoid: "06001403100", resolutionLevel: "tract" as const },
      ],
      metrics: {
        poverty_pct: 25,
      },
      cellCounts: {
        poverty_pct: 50, // >= 11, allowed
      },
      source: "census" as const,
      timestamp: new Date(),
    };

    const result = validateDataset(dataset);

    expect(result.isAllowed).toBe(true);
    expect(result.approvedData).toBeDefined();
  });
});
```

### Test LLM Narrative

```typescript
// __tests__/llmNarrative.test.ts

import { generateNarrative, checkNarrativeSafety } from "@/agents/llmNarrativeAgent";
import { NarrativeContext } from "@/agents/types";

describe("LLM Narrative Agent", () => {
  it("should flag unsafe causal language", () => {
    const unsafe = {
      summary: "Poverty causes kidney disease in this neighborhood",
      whatItShows: [],
      whatItDoesNotShow: [],
      insights: [],
      uncertaintyStatement: "",
    };

    const { isSafe, flaggedPhrases } = checkNarrativeSafety(unsafe);

    expect(isSafe).toBe(false);
    expect(flaggedPhrases).toContain("causes kidney disease");
  });

  it("should approve safe language", () => {
    const safe = {
      summary: "Kidney disease and poverty co-occur in this neighborhood",
      whatItShows: ["Aggregated health data"],
      whatItDoesNotShow: ["Individual health records"],
      insights: ["Multiple factors shape health outcomes"],
      uncertaintyStatement: "This is aggregated data",
    };

    const { isSafe } = checkNarrativeSafety(safe);

    expect(isSafe).toBe(true);
  });
});
```

---

## Environment Variables

```bash
# .env.local

# Census API
CENSUS_API_KEY=your_key_here

# LLM (Anthropic Claude)
ANTHROPIC_API_KEY=your_key_here

# Cron secret
CRON_SECRET=your_secret_here

# Database
DATABASE_URL=postgresql://...

# Feature flags
ENABLE_LLM_NARRATIVES=true
ENABLE_BURDEN_INDEX=true
```

---

## Common Patterns

### Pattern 1: Gate Data Behind Governance

**Always follow this flow:**

```
Raw Data → Validate → Filter by Role → Safe Data → Frontend
```

Never expose raw data to the frontend. Always:
1. Load from database (already suppressed)
2. Run through governance agent
3. Filter by user role
4. Return to frontend

### Pattern 2: Generate Narratives On-Demand

```typescript
const result = validateDataset(rawData);
if (result.isAllowed) {
  const narrative = await generateNarrative({
    geography: result.approvedData.geographies[0],
    metrics: result.approvedData.metrics,
    // ... other context
  });
  // Safe to display
  return narrative;
}
```

### Pattern 3: Audit Every Access

```typescript
const auditLog = auditGovernanceDecision(result, datasetId);
await database.auditLogs.insert(auditLog);
```

### Pattern 4: Cache External Data

Agents have built-in caching:
- Census: 7 days (data released annually)
- Overpass: 30 days (OSM changes frequently)
- Disable cache for testing: `clearCensusCache()`

### Pattern 5: Handle Missing Data Gracefully

```typescript
const narrative = approvedData
  ? await generateNarrative(context)
  : generateFallbackNarrative(context);
// Fallback template is always safe
```

---

## Debugging

### Enable Agent Logging

```typescript
// lib/logging.ts

export function logAgentAction(agent: string, action: string, data?: unknown) {
  if (process.env.DEBUG_AGENTS === "true") {
    console.log(`[${agent}] ${action}`, data);
  }
}
```

### Inspect Governance Decisions

```typescript
const result = validateDataset(data);
console.log(generateGovernanceReport(result));
// Prints human-readable governance decisions
```

### Test Suppression Independently

```typescript
import { applySuppressionToGeography } from "@/backend/agents/etl/suppressionAgent";

const result = applySuppressionToGeography(
  "06001403100",
  { poverty_pct: 25 },
  { poverty_pct: 5 }
);
console.log(generateSuppressionReport(result));
```

---

## Checklist for Using Agents

- [ ] Never fetch raw Census/OSM data in frontend
- [ ] Always run data through governance agent before rendering
- [ ] Always apply role-based filtering
- [ ] Always include "What this map DOES NOT show"
- [ ] Always include uncertainty statements
- [ ] Generate narratives on-demand (compute cost)
- [ ] Cache external API responses
- [ ] Log all governance decisions
- [ ] Test with domain experts before deploying

---

## Support

- **Questions about architecture?** Read `AGENT_ARCHITECTURE.md`
- **Issues with agents?** Check `__tests__/` for examples
- **Need to modify governance rules?** Edit `GOVERNANCE_CONFIG` in `dataGovernanceAgent.ts`
- **Need to adjust burden index weights?** Edit `BURDEN_INDEX_CONFIG` in `burdenIndexAgent.ts`

**Remember: Governance is a feature, not a limitation.**
