/**
 * API Route: GET /api/cost-of-living?geo_id=ZIP
 *
 * Returns TCOL-based cost of living data for a Bronx ZIP code.
 * All figures are monthly costs in USD for a reference household (1 adult + 1 child).
 *
 * Cost categories:
 *   housing     — median gross rent (1BR apartment)
 *   food        — USDA low-cost food plan
 *   transport   — MTA MetroCard + car-free transport costs
 *   healthcare  — ACA benchmark premiums + out-of-pocket
 *   childcare   — licensed center-based care (1 child)
 *   other       — clothing, personal care, miscellaneous necessities
 *
 * Derived fields:
 *   required_income  — annual income needed to cover all costs
 *   median_income    — median household income for the ZIP (ACS 5-year)
 *   income_gap       — required_income - median_income (negative = surplus)
 *   cost_burden_ratio — required_income / median_income (> 1.0 = unaffordable)
 *
 * Data source: Mock TCOL data calibrated to 2023-2024 ACS + NYC DHS cost estimates.
 * When geo_id is omitted, returns all 26 Bronx ZIPs as an array.
 */

import { NextRequest, NextResponse } from 'next/server';

export interface CostOfLivingEntry {
  zip: string;
  neighborhood: string;
  /** Monthly costs in USD */
  costs: {
    housing: number;
    food: number;
    transport: number;
    healthcare: number;
    childcare: number;
    other: number;
  };
  required_income: number;
  median_income: number;
  income_gap: number;
  cost_burden_ratio: number;
}

/** Base non-housing monthly costs — constant across Bronx ZIPs */
const BASE: Omit<CostOfLivingEntry['costs'], 'housing'> = {
  food: 690,
  transport: 395,
  healthcare: 460,
  childcare: 1150,
  other: 510,
};

function buildEntry(
  zip: string,
  neighborhood: string,
  housing: number,
  median_income: number
): CostOfLivingEntry {
  const costs = { housing, ...BASE };
  const monthly_total = Object.values(costs).reduce((a, b) => a + b, 0);
  const required_income = Math.round(monthly_total * 12);
  const income_gap = required_income - median_income;
  const cost_burden_ratio = parseFloat((required_income / median_income).toFixed(3));
  return { zip, neighborhood, costs, required_income, median_income, income_gap, cost_burden_ratio };
}

/** Mock TCOL data for all 26 Bronx ZIP codes */
const COST_DATA: Record<string, CostOfLivingEntry> = Object.fromEntries(
  [
    buildEntry('10451', 'Mott Haven',                    1450, 25800),
    buildEntry('10452', 'Morrisania',                    1400, 27200),
    buildEntry('10453', 'East Tremont',                  1550, 33800),
    buildEntry('10454', 'Mott Haven – Port Morris',      1420, 24500),
    buildEntry('10455', 'Melrose',                       1480, 26800),
    buildEntry('10456', 'Morrisania – Melrose',          1520, 30500),
    buildEntry('10457', 'Tremont',                       1580, 33200),
    buildEntry('10458', 'West Farms – Bronx Zoo',        1600, 35600),
    buildEntry('10459', 'Longwood – Hunts Point',        1460, 28400),
    buildEntry('10460', 'Soundview – Bruckner',          1620, 37200),
    buildEntry('10461', 'Pelham Parkway South',          1750, 43500),
    buildEntry('10462', 'Pelham Parkway North',          1780, 47800),
    buildEntry('10463', 'Fordham Heights',               1920, 51500),
    buildEntry('10464', 'City Island – Pelham Bay Park', 1980, 54600),
    buildEntry('10465', 'Throgs Neck',                   2050, 57800),
    buildEntry('10466', 'Wakefield – Woodlawn',          1950, 52200),
    buildEntry('10467', 'Norwood – Woodlawn',            1850, 48400),
    buildEntry('10468', 'University Heights',             1900, 50800),
    buildEntry('10469', 'Co-op City',                    1960, 52800),
    buildEntry('10470', 'Williamsbridge – Olinville',    1880, 49600),
    buildEntry('10471', 'Riverdale',                     2800, 84500),
    buildEntry('10472', 'Parkchester',                   1680, 42100),
    buildEntry('10473', 'Clason Point – Soundview',      1660, 40800),
    buildEntry('10474', 'Hunts Point',                   1640, 37900),
    buildEntry('10475', 'Co-op City – Baychester',       2100, 62300),
    buildEntry('10499', 'Bronx (General)',               1580, 34500),
  ].map(e => [e.zip, e])
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const geo_id = searchParams.get('geo_id');

  if (geo_id) {
    const entry = COST_DATA[geo_id];
    if (!entry) {
      return NextResponse.json(
        { success: false, error: `No cost-of-living data for ZIP ${geo_id}` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: entry });
  }

  // Return all ZIPs
  const all = Object.values(COST_DATA).sort((a, b) => a.zip.localeCompare(b.zip));
  return NextResponse.json({ success: true, data: all, count: all.length });
}
