-- Migration 002: AI signal extraction output table
-- Stores the structured output from the Claude analysis service.

CREATE TABLE IF NOT EXISTS story_signals (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id                   UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,

  -- Signal scores: NULL = unclear, 0 = not_present, 0.5 = possible, 1 = present
  economic_instability_score     FLOAT CHECK (economic_instability_score BETWEEN 0 AND 1),
  healthcare_access_score        FLOAT CHECK (healthcare_access_score BETWEEN 0 AND 1),
  insurance_instability_score    FLOAT CHECK (insurance_instability_score BETWEEN 0 AND 1),
  food_environment_score         FLOAT CHECK (food_environment_score BETWEEN 0 AND 1),
  environmental_exposure_score   FLOAT CHECK (environmental_exposure_score BETWEEN 0 AND 1),
  neighborhood_safety_score      FLOAT CHECK (neighborhood_safety_score BETWEEN 0 AND 1),
  education_literacy_score       FLOAT CHECK (education_literacy_score BETWEEN 0 AND 1),
  justice_system_score           FLOAT CHECK (justice_system_score BETWEEN 0 AND 1),
  mental_health_score            FLOAT CHECK (mental_health_score BETWEEN 0 AND 1),
  substance_use_score            FLOAT CHECK (substance_use_score BETWEEN 0 AND 1),
  social_support_score           FLOAT CHECK (social_support_score BETWEEN 0 AND 1),
  structural_barriers_score      FLOAT CHECK (structural_barriers_score BETWEEN 0 AND 1),

  -- Metadata
  ai_summary          TEXT,
  overall_confidence  FLOAT CHECK (overall_confidence BETWEEN 0 AND 1),
  model_version       TEXT DEFAULT 'claude-opus-4-6',
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_signals_story_id ON story_signals (story_id);
