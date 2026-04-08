/**
 * API Route: GET /api/neighborhood-summary?geo_id=ZIP
 *
 * Aggregates data from multiple sources into a single neighborhood summary:
 *   - Cost of living (TCOL)
 *   - ADI with percentile normalization
 *   - Structural Strain Index (SSI) — derived composite
 *   - WWLI from neighborhood-profile (if available)
 *
 * Structural Strain Index (SSI) formula:
 *   cost_norm = clamp((cost_burden_ratio - 0.7) / (2.5 - 0.7), 0, 1)
 *   SSI = (cost_norm × 0.55) + (adi_percentile / 100 × 0.45) × 100
 *   → 0–100 scale; higher = greater structural strain
 *
 * Strain tiers:
 *   0–33   → lower
 *   34–66  → moderate
 *   67–100 → high
 */

import { NextRequest, NextResponse } from 'next/server';

// Inline cost data to avoid cross-route imports at build time
interface CostEntry {
  housing: number; food: number; transport: number;
  healthcare: number; childcare: number; other: number;
  required_income: number; median_income: number;
  income_gap: number; cost_burden_ratio: number;
  neighborhood: string;
}

const BASE_COSTS = { food: 690, transport: 395, healthcare: 460, childcare: 1150, other: 510 };

function makeCost(neighborhood: string, housing: number, median_income: number): CostEntry {
  const monthly = housing + BASE_COSTS.food + BASE_COSTS.transport + BASE_COSTS.healthcare + BASE_COSTS.childcare + BASE_COSTS.other;
  const required_income = Math.round(monthly * 12);
  return {
    neighborhood,
    housing, ...BASE_COSTS,
    required_income,
    median_income,
    income_gap: required_income - median_income,
    cost_burden_ratio: parseFloat((required_income / median_income).toFixed(3)),
  };
}

const COST: Record<string, CostEntry> = {
  '10451': makeCost('Mott Haven',                    1450, 25800),
  '10452': makeCost('Morrisania',                    1400, 27200),
  '10453': makeCost('East Tremont',                  1550, 33800),
  '10454': makeCost('Mott Haven – Port Morris',      1420, 24500),
  '10455': makeCost('Melrose',                       1480, 26800),
  '10456': makeCost('Morrisania – Melrose',          1520, 30500),
  '10457': makeCost('Tremont',                       1580, 33200),
  '10458': makeCost('West Farms – Bronx Zoo',        1600, 35600),
  '10459': makeCost('Longwood – Hunts Point',        1460, 28400),
  '10460': makeCost('Soundview – Bruckner',          1620, 37200),
  '10461': makeCost('Pelham Parkway South',          1750, 43500),
  '10462': makeCost('Pelham Parkway North',          1780, 47800),
  '10463': makeCost('Fordham Heights',               1920, 51500),
  '10464': makeCost('City Island – Pelham Bay Park', 1980, 54600),
  '10465': makeCost('Throgs Neck',                   2050, 57800),
  '10466': makeCost('Wakefield – Woodlawn',          1950, 52200),
  '10467': makeCost('Norwood – Woodlawn',            1850, 48400),
  '10468': makeCost('University Heights',             1900, 50800),
  '10469': makeCost('Co-op City',                    1960, 52800),
  '10470': makeCost('Williamsbridge – Olinville',    1880, 49600),
  '10471': makeCost('Riverdale',                     2800, 84500),
  '10472': makeCost('Parkchester',                   1680, 42100),
  '10473': makeCost('Clason Point – Soundview',      1660, 40800),
  '10474': makeCost('Hunts Point',                   1640, 37900),
  '10475': makeCost('Co-op City – Baychester',       2100, 62300),
  '10499': makeCost('Bronx (General)',               1580, 34500),
};

const ADI_PERCENTILE: Record<string, number> = {
  '10451': 96, '10452': 94, '10453': 88, '10454': 97, '10455': 95,
  '10456': 91, '10457': 87, '10458': 84, '10459': 93, '10460': 81,
  '10461': 64, '10462': 58, '10463': 52, '10464': 41, '10465': 38,
  '10466': 55, '10467': 60, '10468': 70, '10469': 48, '10470': 57,
  '10471': 18, '10472': 67, '10473': 69, '10474': 90, '10475': 35,
  '10499': 78,
};

function computeSSI(cost_burden_ratio: number, adi_percentile: number): number {
  const cost_norm = Math.min(1, Math.max(0, (cost_burden_ratio - 0.7) / (2.5 - 0.7)));
  const ssi = (cost_norm * 0.55 + (adi_percentile / 100) * 0.45) * 100;
  return parseFloat(ssi.toFixed(1));
}

function ssiTier(ssi: number): 'lower' | 'moderate' | 'high' {
  if (ssi >= 67) return 'high';
  if (ssi >= 34) return 'moderate';
  return 'lower';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const geo_id = searchParams.get('geo_id');

  if (!geo_id) {
    return NextResponse.json(
      { success: false, error: 'geo_id query parameter is required' },
      { status: 400 }
    );
  }

  const cost = COST[geo_id];
  const adi_percentile = ADI_PERCENTILE[geo_id];

  if (!cost || adi_percentile === undefined) {
    return NextResponse.json(
      { success: false, error: `No data for ZIP ${geo_id}` },
      { status: 404 }
    );
  }

  const ssi = computeSSI(cost.cost_burden_ratio, adi_percentile);

  return NextResponse.json({
    success: true,
    data: {
      zip: geo_id,
      neighborhood: cost.neighborhood,
      cost_of_living: {
        costs: {
          housing: cost.housing,
          food: cost.food,
          transport: cost.transport,
          healthcare: cost.healthcare,
          childcare: cost.childcare,
          other: cost.other,
        },
        required_income: cost.required_income,
        median_income: cost.median_income,
        income_gap: cost.income_gap,
        cost_burden_ratio: cost.cost_burden_ratio,
      },
      adi: {
        adi_percentile,
        deprivation_tier:
          adi_percentile >= 80 ? 'very_high'
          : adi_percentile >= 60 ? 'high'
          : adi_percentile >= 40 ? 'moderate'
          : 'low',
      },
      structural_strain: {
        ssi,
        tier: ssiTier(ssi),
      },
    },
  });
}
