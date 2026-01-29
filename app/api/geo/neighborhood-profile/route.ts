/**
 * API Route: GET /api/geo/neighborhood-profile?zip=[zipcode]
 *
 * Returns neighborhood profile data for a specific ZIP code
 * Includes geographic, demographic, and health context information
 *
 * This endpoint aggregates data from the Bronx data pipeline and serves it
 * to the NeighborhoodPage for display.
 */

import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

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
  burdenIndex: number;
  avgTravel: number;
  exposureIndex: number;
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

    const dataPath = path.join(
      process.cwd(),
      'data/geo/bronx_zip_to_tracts.json'
    );

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

    // For now, derive burden index from total weight as a proxy
    // (burden increases with total weight; scale to 0-100)
    const burdenIndex = Math.round(avgTotWeight * 100);
    const avgTravel = 60 + Math.random() * 20; // Placeholder until we have real transit data
    const exposureIndex = 70 + Math.random() * 15; // Placeholder until we have real exposure data

    const profile: NeighborhoodProfile = {
      zip,
      nta_code: firstRow.nta_code || 'UNASSIGNED',
      nta_name: firstRow.nta_name || 'Unassigned Neighborhood',
      city: 'New York',
      state: 'NY',
      tractCount: uniqueTracts.length,
      residentialWeight: avgResWeight,
      totalWeight: avgTotWeight,
      tracts: uniqueTracts,
      burdenIndex,
      avgTravel: Math.round(avgTravel),
      exposureIndex
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
