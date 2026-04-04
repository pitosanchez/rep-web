/**
 * GET /api/stories/signals-by-zip?zip=10456
 *
 * Returns AI-extracted signal averages for all stories submitted from a ZIP code.
 * No governance threshold is applied — this is a raw read for the neighborhood profile.
 * Returns null signal values when fewer than 2 stories exist.
 */

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { calculateSBI } from '@/lib/signalUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip) {
    return NextResponse.json({ success: false, error: 'ZIP code is required' }, { status: 400 });
  }

  try {
    const result = await pool.query<{
      economic_instability_score:   number | null;
      healthcare_access_score:      number | null;
      insurance_instability_score:  number | null;
      food_environment_score:       number | null;
      environmental_exposure_score: number | null;
      neighborhood_safety_score:    number | null;
      education_literacy_score:     number | null;
      justice_system_score:         number | null;
      mental_health_score:          number | null;
      substance_use_score:          number | null;
      social_support_score:         number | null;
      structural_barriers_score:    number | null;
      overall_confidence:           number | null;
    }>(
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
      [zip]
    );

    const rows = result.rows;
    const storyCount = rows.length;

    if (storyCount === 0) {
      return NextResponse.json({
        success: true,
        zip,
        story_count: 0,
        signals: null,
        sbi_score: null,
        avg_confidence: null,
      });
    }

    // Null-safe column average
    const avg = (col: keyof typeof rows[0]): number | null => {
      const values = rows
        .map(r => r[col])
        .filter((v): v is number => v !== null && typeof v === 'number');
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    const signals = {
      economic_instability:   avg('economic_instability_score'),
      healthcare_access:      avg('healthcare_access_score'),
      insurance_instability:  avg('insurance_instability_score'),
      food_environment:       avg('food_environment_score'),
      environmental_exposure: avg('environmental_exposure_score'),
      neighborhood_safety:    avg('neighborhood_safety_score'),
      education_literacy:     avg('education_literacy_score'),
      justice_system:         avg('justice_system_score'),
      mental_health:          avg('mental_health_score'),
      substance_use:          avg('substance_use_score'),
      social_support:         avg('social_support_score'),
      structural_barriers:    avg('structural_barriers_score'),
    };

    const sbi_score = calculateSBI({
      economic:    signals.economic_instability,
      healthcare:  signals.healthcare_access,
      insurance:   signals.insurance_instability,
      food:        signals.food_environment,
      environment: signals.environmental_exposure,
      safety:      signals.neighborhood_safety,
      literacy:    signals.education_literacy,
      justice:     signals.justice_system,
      mental:      signals.mental_health,
      substance:   signals.substance_use,
      support:     signals.social_support,
      structural:  signals.structural_barriers,
    });

    const avg_confidence =
      rows.reduce((sum, r) => sum + (r.overall_confidence ?? 0), 0) / rows.length;

    return NextResponse.json({
      success: true,
      zip,
      story_count: storyCount,
      signals,
      sbi_score,
      avg_confidence,
    });

  } catch (err) {
    console.error('Error fetching signals for ZIP:', err);
    return NextResponse.json({
      success: true,
      zip,
      story_count: 0,
      signals: null,
      sbi_score: null,
      avg_confidence: null,
    });
  }
}
