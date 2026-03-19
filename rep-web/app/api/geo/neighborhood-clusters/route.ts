/**
 * API Route: GET /api/geo/neighborhood-clusters
 *
 * Returns neighborhood clusters with constituent tracts and ZIP codes
 * from the Bronx data pipeline output.
 */

import { promises as fs, existsSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const getGeoDataFilePath = (filename: string) => {
  // Backward compatible: if running from repo root or from `rep-web/`.
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

export async function GET() {
  try {
    const dataPath = getGeoDataFilePath('bronx_neighborhood_clusters.json');

    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading neighborhood clusters data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load neighborhood clusters data',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
