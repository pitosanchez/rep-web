/**
 * API Route: GET /api/geo/zip-to-tracts
 *
 * Returns the complete ZIP-to-tract mapping with NTA assignments
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
    const dataPath = getGeoDataFilePath('bronx_zip_to_tracts.json');

    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading ZIP-to-tracts data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load ZIP-to-tracts data',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
