-- Migration 001: Core story tables
-- REP Story Signal Extraction Pipeline
-- Run in order: 001 → 002 → 003

-- Enable PostGIS (must be enabled once per database)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TABLE: stories ──────────────────────────────────────────────────────────
-- Raw story submissions. Restricted access — not exposed to public API.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code     TEXT NOT NULL,
  census_tract TEXT,                        -- populated async by geo lookup
  role         TEXT CHECK (role IN ('patient', 'caregiver')),
  condition    TEXT,
  story_text   TEXT NOT NULL,
  themes       TEXT[],                      -- array of selected theme tags
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for geo aggregation queries
CREATE INDEX IF NOT EXISTS idx_stories_zip_code    ON stories (zip_code);
CREATE INDEX IF NOT EXISTS idx_stories_census_tract ON stories (census_tract);
CREATE INDEX IF NOT EXISTS idx_stories_created_at  ON stories (created_at);
