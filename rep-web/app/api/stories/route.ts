/**
 * POST /api/stories
 *
 * Receives a story submission from the frontend, stores it,
 * calls the Python signal extraction service, stores the signals,
 * and triggers async aggregation.
 */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { statusToScore } from '@/lib/signalUtils';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

interface StorySubmission {
  zip_code: string;
  role: 'patient' | 'caregiver';
  condition?: string;
  story_text: string;
  themes?: string[];
}

export async function POST(req: NextRequest) {
  let body: StorySubmission;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { zip_code, role, condition, story_text, themes } = body;

  if (!zip_code || !role || !story_text || story_text.trim().length < 20) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 422 });
  }

  // ── 1. Store raw story ──────────────────────────────────────────────────────
  // ── Auto-filter before storage ─────────────────────────────────────────────
  const autoFlag = autoFilterStory(story_text);

  let storyId: string;
  try {
    const result = await pool.query<{ id: string }>(
      `INSERT INTO stories (zip_code, role, condition, story_text, themes, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [zip_code, role, condition ?? null, story_text, themes ?? [], autoFlag.status]
    );
    storyId = result.rows[0].id;
  } catch (err) {
    console.error('Failed to insert story:', err);
    return NextResponse.json({ error: 'Failed to save story.' }, { status: 500 });
  }

  // ── 2. Call Python signal extraction service ────────────────────────────────
  let signals: Record<string, { status: string; confidence: number; evidence: string | null }>;
  let summary: string;
  let overallConfidence: number;

  try {
    const pyResponse = await fetch(`${PYTHON_SERVICE_URL}/analyze-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_id: storyId, text: story_text, zip_code }),
    });

    if (!pyResponse.ok) {
      throw new Error(`Python service returned ${pyResponse.status}`);
    }

    const pyData = await pyResponse.json();
    signals = pyData.signals;
    summary = pyData.summary;
    overallConfidence = pyData.overall_confidence;
  } catch (err) {
    console.error('Signal extraction failed for story', storyId, err);
    // Return success to user — signal extraction runs best-effort
    return NextResponse.json({ story_id: storyId, status: 'saved', signals: 'pending' });
  }

  // ── 3. Convert status → numeric and store signals ──────────────────────────
  const s = signals;
  try {
    await pool.query(
      `INSERT INTO story_signals (
        story_id,
        economic_instability_score,
        healthcare_access_score,
        insurance_instability_score,
        food_environment_score,
        environmental_exposure_score,
        neighborhood_safety_score,
        education_literacy_score,
        justice_system_score,
        mental_health_score,
        substance_use_score,
        social_support_score,
        structural_barriers_score,
        ai_summary,
        overall_confidence
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        storyId,
        statusToScore(s.economic_instability.status),
        statusToScore(s.healthcare_access_barriers.status),
        statusToScore(s.insurance_instability.status),
        statusToScore(s.food_environment.status),
        statusToScore(s.environmental_exposure.status),
        statusToScore(s.neighborhood_safety.status),
        statusToScore(s.education_and_health_literacy.status),
        statusToScore(s.justice_system_exposure.status),
        statusToScore(s.mental_health_signals.status),
        statusToScore(s.substance_use_context.status),
        statusToScore(s.social_support.status),
        statusToScore(s.structural_barriers.status),
        summary,
        overallConfidence,
      ]
    );
  } catch (err) {
    console.error('Failed to store story signals for story', storyId, err);
  }

  // ── 4. Trigger aggregation async (fire-and-forget) ─────────────────────────
  triggerAggregation(zip_code).catch(err =>
    console.error('Aggregation trigger failed for ZIP', zip_code, err)
  );

  return NextResponse.json({
    story_id: storyId,
    status: 'saved',
    signals: 'extracted',
    overall_confidence: overallConfidence,
  });
}

// ── Auto-filter ────────────────────────────────────────────────────────────────
const PII_PATTERNS = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,           // phone
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,  // email
  /\b\d{3}-\d{2}-\d{4}\b/,                         // SSN pattern
];

const PROFANITY = ['fuck', 'shit', 'asshole', 'bitch', 'cunt', 'nigger', 'faggot'];

function autoFilterStory(text: string): { status: string; flags: string[] } {
  const flags: string[] = [];
  const lower = text.toLowerCase();

  if (text.trim().length < 50) flags.push('too_short');
  if (text.trim().length > 10000) flags.push('too_long');

  for (const pattern of PII_PATTERNS) {
    if (pattern.test(text)) { flags.push('possible_pii'); break; }
  }

  for (const word of PROFANITY) {
    if (lower.includes(word)) { flags.push('profanity'); break; }
  }

  const status = flags.length > 0 ? 'flagged' : 'pending';
  return { status, flags };
}

async function triggerAggregation(zip_code: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  await fetch(`${baseUrl}/api/stories/aggregate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zip_code }),
  });
}
