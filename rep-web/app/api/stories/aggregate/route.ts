/**
 * POST /api/stories/aggregate
 *
 * Rolls up story_signals into aggregated_signals for a given ZIP code.
 * Applies governance guardrails before writing:
 *   - Minimum 5 stories
 *   - Average confidence ≥ 0.6
 *   - No single story may dominate (max 40% weight)
 *
 * Calculates the Structural Burden Index (SBI / CRSBI).
 * This is what feeds the map layer.
 */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { calculateSBI } from '@/lib/signalUtils';

const MIN_STORIES = 5;
const MIN_AVG_CONFIDENCE = 0.6;

export async function POST(req: NextRequest) {
  const { zip_code } = await req.json();

  if (!zip_code) {
    return NextResponse.json({ error: 'zip_code required.' }, { status: 400 });
  }

  // ── Pull all signals for this ZIP ───────────────────────────────────────────
  const result = await pool.query(
    `SELECT
       ss.economic_instability_score,
       ss.healthcare_access_score,
       ss.insurance_instability_score,
       ss.food_environment_score,
       ss.environmental_exposure_score,
       ss.neighborhood_safety_score,
       ss.education_literacy_score,
       ss.justice_system_score,
       ss.mental_health_score,
       ss.substance_use_score,
       ss.social_support_score,
       ss.structural_barriers_score,
       ss.overall_confidence
     FROM story_signals ss
     JOIN stories s ON s.id = ss.story_id
     WHERE s.zip_code = $1`,
    [zip_code]
  );

  const rows = result.rows;

  // ── Governance check 1: minimum story count ────────────────────────────────
  if (rows.length < MIN_STORIES) {
    return NextResponse.json({
      status: 'suppressed',
      reason: `Only ${rows.length} stories — minimum is ${MIN_STORIES}.`,
    });
  }

  // ── Governance check 2: average confidence ─────────────────────────────────
  const avgConfidence =
    rows.reduce((sum, r) => sum + (r.overall_confidence ?? 0), 0) / rows.length;

  if (avgConfidence < MIN_AVG_CONFIDENCE) {
    return NextResponse.json({
      status: 'suppressed',
      reason: `Average confidence ${avgConfidence.toFixed(2)} below threshold ${MIN_AVG_CONFIDENCE}.`,
    });
  }

  // ── Governance check 3: no single story dominates (> 40% weight) ──────────
  const maxWeight = 1 / rows.length;
  if (maxWeight > 0.4) {
    return NextResponse.json({
      status: 'suppressed',
      reason: 'Single story would dominate the aggregate.',
    });
  }

  // ── Compute column averages (null-safe) ─────────────────────────────────────
  const avg = (col: string) => {
    const values = rows.map(r => r[col]).filter((v): v is number => v !== null);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  };

  const economic    = avg('economic_instability_score');
  const healthcare  = avg('healthcare_access_score');
  const insurance   = avg('insurance_instability_score');
  const food        = avg('food_environment_score');
  const environment = avg('environmental_exposure_score');
  const safety      = avg('neighborhood_safety_score');
  const literacy    = avg('education_literacy_score');
  const justice     = avg('justice_system_score');
  const mental      = avg('mental_health_score');
  const substance   = avg('substance_use_score');
  const support     = avg('social_support_score');
  const structural  = avg('structural_barriers_score');

  const sbiScore = calculateSBI({
    economic, healthcare, insurance, food, environment,
    safety, literacy, justice, mental, substance, support, structural,
  });

  // ── Upsert into aggregated_signals ─────────────────────────────────────────
  // Uses ZIP code as geoid — extend to census_tract when geographies table is populated
  await pool.query(
    `INSERT INTO aggregated_signals (
      geoid,
      story_count,
      economic_instability_avg,
      healthcare_access_avg,
      insurance_instability_avg,
      food_environment_avg,
      environmental_exposure_avg,
      neighborhood_safety_avg,
      education_literacy_avg,
      justice_system_avg,
      mental_health_avg,
      substance_use_avg,
      social_support_avg,
      structural_barriers_avg,
      sbi_score,
      avg_confidence,
      updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW())
    ON CONFLICT (geoid) DO UPDATE SET
      story_count                 = EXCLUDED.story_count,
      economic_instability_avg    = EXCLUDED.economic_instability_avg,
      healthcare_access_avg       = EXCLUDED.healthcare_access_avg,
      insurance_instability_avg   = EXCLUDED.insurance_instability_avg,
      food_environment_avg        = EXCLUDED.food_environment_avg,
      environmental_exposure_avg  = EXCLUDED.environmental_exposure_avg,
      neighborhood_safety_avg     = EXCLUDED.neighborhood_safety_avg,
      education_literacy_avg      = EXCLUDED.education_literacy_avg,
      justice_system_avg          = EXCLUDED.justice_system_avg,
      mental_health_avg           = EXCLUDED.mental_health_avg,
      substance_use_avg           = EXCLUDED.substance_use_avg,
      social_support_avg          = EXCLUDED.social_support_avg,
      structural_barriers_avg     = EXCLUDED.structural_barriers_avg,
      sbi_score                   = EXCLUDED.sbi_score,
      avg_confidence              = EXCLUDED.avg_confidence,
      updated_at                  = NOW()`,
    [
      zip_code, rows.length,
      economic, healthcare, insurance, food, environment,
      safety, literacy, justice, mental, substance, support, structural,
      sbiScore, avgConfidence,
    ]
  );

  return NextResponse.json({
    status: 'aggregated',
    geoid: zip_code,
    story_count: rows.length,
    sbi_score: sbiScore,
    avg_confidence: avgConfidence,
  });
}
