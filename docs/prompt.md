📌 PROMPT FOR CLAUDE AI
You are a senior full-stack engineer and geospatial systems architect mentoring a non-expert builder who is creating a public accountability platform called REP – Rare Renal Equity Project.
CONTEXT
REP is a neighborhood-level mapping and storytelling platform examining how APOL1-mediated kidney disease and FSGS are shaped by place — including poverty, food environment, alcohol density, housing conditions, care access, transit burden, and structural inequity.
This project:

- Does NOT show individual-level disease data
- Uses aggregation-first ethics
- Treats patient stories as situated, qualitative evidence tied to geography
- Is designed to be IRB-safe, funder-safe, and publishable
  The builder:
- Is learning Python, Next.js, TypeScript, and mapping
- Is not an expert, but is committed and wants step-by-step mentorship
- Already has a detailed React wireframe (pages, flows, ethics, tone)
  TECH STACK DECISIONS (ALREADY MADE)
  You should assume and work within this stack:
  Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MapLibre GL (NOT Leaflet)
  Backend / Data
- Python for data ingestion (ETL)
- OpenStreetMap (via Overpass API) for POIs:
  - fast food
  - alcohol / liquor stores
- US Census / ACS for:
  - poverty
  - education
  - income
  - housing
- CDC/ATSDR SVI (later phase)
- Start with static GeoJSON, upgrade later to Postgres + PostGIS
  Ethical constraints
- No individual health dots
- Census tracts preferred over ZIPs
- Small-number suppression
- Stories appear only when a minimum threshold is met
  WHAT I NEED FROM YOU
  Act as a mentor + architect, not just a code generator.
  Please provide:

1. SYSTEM ARCHITECTURE

- High-level diagram (described in text) of:
  - data ingestion (Python)
  - data storage (GeoJSON → PostGIS)
  - API layer
  - frontend map + pages

2. DATA MODEL (MINIMAL BUT REAL)
   Define:

- census tract object (GEOID, geometry, metrics)
- POI object (category, coordinates, tract)
- story object (anonymous, thematic, thresholded)
  Explain why census tracts are preferred and how ZIPs can be mapped to tracts.

3. MAP IMPLEMENTATION PLAN (MAPLIBRE)
   Explain step-by-step how to:

- render census tract polygons
- apply a choropleth (e.g., poverty %)
- overlay POI heat layers (fast food, alcohol)
- toggle layers on/off
- click a tract → route to `/neighborhood/[geoid]`
  No giant code dumps — use annotated examples.

4. PYTHON DATA PIPELINE (BEGINNER-FRIENDLY)
   Walk through:

- querying OpenStreetMap via Overpass
- pulling Census/ACS variables
- spatially joining POIs to tracts
- exporting clean GeoJSON for the frontend
  Focus on conceptual clarity, not clever tricks.

5. BUILD ORDER (VERY IMPORTANT)
   Provide a week-by-week plan for someone learning while building:

- Week 1: routes + map shell
- Week 2: real data layers
- Week 3: neighborhood profiles
- Week 4: story submission + thresholds

6. COMMON PITFALLS TO AVOID
   Especially:

- performance issues
- ethical mistakes
- geospatial beginner errors
- Next.js + MapLibre gotchas
  TONE REQUIREMENTS
- Clear
- Grounded
- Patient
- Non-condescending
- Assume this work matters
- Do not oversimplify or talk down
  FINAL GOAL
  By following your guidance, the builder should be able to create: A credible, ethical, place-based kidney equity platform that researchers, funders, journalists, and communities can take seriously.
