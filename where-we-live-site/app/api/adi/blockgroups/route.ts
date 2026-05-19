/**
 * API Route: GET /api/adi/blockgroups
 *
 * Returns Bronx block-group GeoJSON with Area Deprivation Index (ADI) attributes.
 * Source: rep-data/adi/processed/adi_blockgroups.geojson
 */

import { promises as fs, existsSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const getAdiBlockgroupsPath = () => {
  const filename = 'adi_blockgroups.geojson';
  const localCandidate = path.join(
    process.cwd(),
    'rep-data',
    'adi',
    'processed',
    filename
  );
  const fromRepWeb = path.join(
    process.cwd(),
    '..',
    'rep-data',
    'adi',
    'processed',
    filename
  );
  const legacyMono = path.join(
    process.cwd(),
    'adi',
    'processed',
    filename
  );

  if (existsSync(localCandidate)) return localCandidate;
  if (existsSync(fromRepWeb)) return fromRepWeb;
  if (existsSync(legacyMono)) return legacyMono;
  return fromRepWeb;
};

export async function GET() {
  try {
    const dataPath = getAdiBlockgroupsPath();
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data,
      count: Array.isArray(data.features) ? data.features.length : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error reading ADI block group GeoJSON:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load ADI block group data',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
