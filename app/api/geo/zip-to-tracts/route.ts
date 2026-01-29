/**
 * API Route: GET /api/geo/zip-to-tracts
 *
 * Returns the complete ZIP-to-tract mapping with NTA assignments
 * from the Bronx data pipeline output.
 */

import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(
      process.cwd(),
      'data/geo/bronx_zip_to_tracts.json'
    );

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
