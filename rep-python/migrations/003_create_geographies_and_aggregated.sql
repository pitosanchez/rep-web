-- Migration 003: Geography + aggregated signal tables
-- aggregated_signals is the public-facing map layer.

-- ─── TABLE: geographies ──────────────────────────────────────────────────────
-- PostGIS-enabled geography reference table.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS geographies (
  geoid     TEXT PRIMARY KEY,
  name      TEXT,
  state     TEXT,
  geo_type  TEXT CHECK (geo_type IN ('zip', 'tract', 'nta', 'county')),
  geometry  GEOMETRY(MULTIPOLYGON, 4326)
);

CREATE INDEX IF NOT EXISTS idx_geographies_geoid    ON geographies (geoid);
CREATE INDEX IF NOT EXISTS idx_geographies_geometry ON geographies USING GIST (geometry);

-- ─── TABLE: aggregated_signals ───────────────────────────────────────────────
-- Rolled-up signals per geography. This is what the map reads.
-- Only written when guardrails pass (min 5 stories, avg confidence >= 0.6).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS aggregated_signals (
  geoid   TEXT PRIMARY KEY REFERENCES geographies(geoid),

  -- Story count (suppressed if < 5)
  story_count INT NOT NULL DEFAULT 0,

  -- Averaged signal scores
  economic_instability_avg     FLOAT,
  healthcare_access_avg        FLOAT,
  insurance_instability_avg    FLOAT,
  food_environment_avg         FLOAT,
  environmental_exposure_avg   FLOAT,
  neighborhood_safety_avg      FLOAT,
  education_literacy_avg       FLOAT,
  justice_system_avg           FLOAT,
  mental_health_avg            FLOAT,
  substance_use_avg            FLOAT,
  social_support_avg           FLOAT,
  structural_barriers_avg      FLOAT,

  -- Community-Reported Structural Burden Index
  -- Weighted composite of all signals (see SBI formula in docs)
  sbi_score FLOAT CHECK (sbi_score BETWEEN 0 AND 1),

  -- Governance: average confidence across all contributing stories
  avg_confidence FLOAT,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aggregated_geoid ON aggregated_signals (geoid);

-- ─── FUNCTION: calculate_sbi ─────────────────────────────────────────────────
-- Structural Burden Index formula v1
-- Weights align with the REP index design spec.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION calculate_sbi(
  economic        FLOAT,
  healthcare      FLOAT,
  insurance       FLOAT,
  food            FLOAT,
  environment     FLOAT,
  safety          FLOAT,
  literacy        FLOAT,
  justice         FLOAT,
  mental          FLOAT,
  substance       FLOAT,
  support         FLOAT,
  structural      FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN COALESCE(
    (COALESCE(economic, 0)   * 0.20) +
    (COALESCE(healthcare, 0) * 0.20) +
    (COALESCE(insurance, 0)  * 0.15) +
    (COALESCE(food, 0)       * 0.10) +
    (COALESCE(environment, 0)* 0.10) +
    (COALESCE(safety, 0)     * 0.05) +
    (COALESCE(literacy, 0)   * 0.05) +
    (COALESCE(justice, 0)    * 0.05) +
    (COALESCE(mental, 0)     * 0.05) +
    (COALESCE(substance, 0)  * 0.025)+
    (COALESCE(support, 0)    * 0.025)+
    (COALESCE(structural, 0) * 0.10),
    0
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
