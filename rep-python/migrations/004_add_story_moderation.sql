-- Migration 004: Add story moderation status
-- Run: psql $DATABASE_URL -f rep-python/migrations/004_add_story_moderation.sql

ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS moderation_note TEXT,
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS moderated_by VARCHAR(100);

-- Index for fast pending queue queries
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_zip_status ON stories(zip_code, status);

-- Only approved stories should be visible to the public.
-- Update existing rows to 'approved' (retroactive — they were shown before moderation existed)
UPDATE stories SET status = 'approved' WHERE status = 'pending';

-- Comment
COMMENT ON COLUMN stories.status IS 'pending | approved | rejected | flagged';
