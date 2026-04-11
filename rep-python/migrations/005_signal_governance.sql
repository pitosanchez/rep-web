-- Migration 005: AI Signal Governance — per-signal confidence + override capability
-- Adds infrastructure for manual signal review, confidence filtering, and reviewer overrides.

-- ── 1. Add per-signal confidence tracking to story_signals ────────────────────
-- overall_confidence (from migration 002) remains as the model's holistic estimate.
-- reviewed_at / reviewed_by / confidence_override allow a human reviewer to accept
-- or reject individual signal rows that fall below the auto threshold.

ALTER TABLE story_signals
  ADD COLUMN IF NOT EXISTS reviewed_at        TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_by        TEXT,
  ADD COLUMN IF NOT EXISTS confidence_override FLOAT CHECK (confidence_override BETWEEN 0 AND 1),
  ADD COLUMN IF NOT EXISTS override_note       TEXT;

-- ── 2. signal_overrides — explicit record of every human review decision ──────
-- Separate audit log so the original story_signals rows are never mutated silently.

CREATE TABLE IF NOT EXISTS signal_overrides (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_signal_id UUID NOT NULL REFERENCES story_signals(id) ON DELETE CASCADE,
  reviewer       TEXT NOT NULL,
  action         TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'adjust_confidence')),
  old_confidence FLOAT,
  new_confidence FLOAT,
  note           TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signal_overrides_story_signal_id ON signal_overrides (story_signal_id);

-- ── 3. Sampling queue view — signals below threshold awaiting manual review ───
-- Used by GET /api/stories/signals-sample

CREATE OR REPLACE VIEW signal_review_queue AS
SELECT
  ss.id               AS signal_id,
  ss.story_id,
  s.zip_code,
  s.created_at        AS story_submitted_at,
  ss.overall_confidence,
  ss.model_version,
  ss.ai_summary,
  ss.reviewed_at,
  CASE
    WHEN ss.overall_confidence IS NULL THEN 'no_confidence'
    WHEN ss.overall_confidence < 0.6   THEN 'below_threshold'
    ELSE 'above_threshold'
  END                 AS confidence_bucket,
  -- effective confidence: use override if set, else model score
  COALESCE(ss.confidence_override, ss.overall_confidence) AS effective_confidence
FROM story_signals ss
JOIN stories s ON s.id = ss.story_id
WHERE ss.reviewed_at IS NULL
ORDER BY ss.overall_confidence ASC NULLS FIRST;

COMMENT ON VIEW signal_review_queue IS
  'Unreviewed story_signals ordered by confidence ascending — lowest confidence first for manual review.';
