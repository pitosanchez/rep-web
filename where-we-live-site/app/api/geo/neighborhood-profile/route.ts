/**
 * API Route: GET /api/geo/neighborhood-profile?zip=[zipcode]
 *
 * Returns neighborhood profile data for a specific ZIP code
 * Includes geographic, demographic, and health context information
 *
 * This endpoint aggregates data from the Bronx data pipeline and serves it
 * to the NeighborhoodPage for display.
 */

import { promises as fs, existsSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { zipToNeighborhood } from '@/lib/storyZipMapping';

const getGeoDataFilePath = (filename: string) => {
  // Backward compatible: if running from repo root or from `where-we-live-site/`.
  const localCandidate = path.join(process.cwd(), 'data/geo', filename);
  const monorepoCandidateFromRepoRoot = path.join(
    process.cwd(),
    'rep-data',
    'data',
    'geo',
    filename
  );
  const monorepoCandidateFromRepWeb = path.join(
    process.cwd(),
    '..',
    'rep-data',
    'data',
    'geo',
    filename
  );

  if (existsSync(localCandidate)) return localCandidate;
  if (existsSync(monorepoCandidateFromRepoRoot)) {
    return monorepoCandidateFromRepoRoot;
  }
  return monorepoCandidateFromRepWeb;
};

interface ZipToTractRow {
  zip: string;
  nta_code: string;
  nta_name: string;
  tract_geoid: string;
  weight_res: number;
  weight_tot: number;
  [key: string]: any;
}

interface NeighborhoodProfile {
  zip: string;
  nta_code: string;
  nta_name: string;
  city: string;
  state: string;
  tractCount: number;
  residentialWeight: number;
  totalWeight: number;
  tracts: string[];
  /** Where We Live Index: 0–100 composite from geo weights */
  wwli: number;
  /** Residential concentration component of WWLI (0–100) */
  residentialBurden: number;
  /** Total weight component of WWLI (0–100) */
  structuralWeight: number;
  /** WWLI tier label */
  wwliTier: 'low' | 'moderate' | 'high';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get('zip');

    if (!zip) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing zip parameter',
          message: 'Please provide a ZIP code'
        },
        { status: 400 }
      );
    }

    const dataPath = getGeoDataFilePath('bronx_zip_to_tracts.json');

    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const zipToTracts: ZipToTractRow[] = JSON.parse(fileContent);

    // Find all rows for this ZIP
    const zipRows = zipToTracts.filter(row => row.zip === zip);

    if (zipRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ZIP not found',
          message: `No data found for ZIP code ${zip}`
        },
        { status: 404 }
      );
    }

    // Aggregate data for this ZIP
    const firstRow = zipRows[0];
    const uniqueTracts = Array.from(new Set(zipRows.map(r => r.tract_geoid))).sort();

    // Calculate weighted averages
    const avgResWeight = zipRows.reduce((sum, r) => sum + r.weight_res, 0) / zipRows.length;
    const avgTotWeight = zipRows.reduce((sum, r) => sum + r.weight_tot, 0) / zipRows.length;

    // ── Where We Live Index (WWLI) ────────────────────────────────────────────
    // A composite 0–100 score derived from census tract geographic weights.
    //
    // Components:
    //   • Structural weight (weight_tot): how concentrated total tract burden is
    //     in this ZIP — higher = more population exposed to structural stressors.
    //     Weight: 60%
    //   • Residential concentration (weight_res): share of residential population
    //     relative to total ZIP activity — higher = more residents vs. daytime pop.
    //     Weight: 40%
    //
    // Both source values range 0–1; WWLI is expressed 0–100.
    // Tiers: 0–33 = lower relative burden, 34–66 = moderate, 67–100 = high.
    const residentialBurden = Math.round(avgResWeight * 100);
    const structuralWeight  = Math.round(avgTotWeight * 100);
    const wwli = Math.round(structuralWeight * 0.60 + residentialBurden * 0.40);
    const wwliTier: 'low' | 'moderate' | 'high' =
      wwli <= 33 ? 'low' : wwli <= 66 ? 'moderate' : 'high';

    // Resolve neighborhood name: prefer NTA from geo data, fall back to local mapping
    const resolvedName =
      (firstRow.nta_name && firstRow.nta_name !== 'Unassigned')
        ? firstRow.nta_name
        : (zipToNeighborhood[zip] ?? 'Bronx Neighborhood');

    const profile: NeighborhoodProfile = {
      zip,
      nta_code: firstRow.nta_code || 'BX',
      nta_name: resolvedName,
      city: 'New York',
      state: 'NY',
      tractCount: uniqueTracts.length,
      residentialWeight: avgResWeight,
      totalWeight: avgTotWeight,
      tracts: uniqueTracts,
      wwli,
      residentialBurden,
      structuralWeight,
      wwliTier,
    };

    return NextResponse.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching neighborhood profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch neighborhood profile',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
