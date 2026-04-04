/**
 * API Route: GET /api/stories/by-zip?zip=10456
 *
 * Returns user-submitted stories for a given ZIP code from the database.
 * (Curated patient stories are loaded directly from lib/stories.ts on the frontend.)
 */

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getNeighborhoodForZip } from '@/lib/storyZipMapping';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip) {
    return NextResponse.json({ success: false, error: 'ZIP code is required' }, { status: 400 });
  }

  try {
    const result = await pool.query<{
      id: string;
      zip_code: string;
      role: string;
      condition: string | null;
      story_text: string;
      themes: string[];
      created_at: string;
    }>(
      `SELECT id, zip_code, role, condition, story_text, themes, created_at
       FROM stories
       WHERE zip_code = $1
       ORDER BY created_at DESC`,
      [zip]
    );

    return NextResponse.json({
      success: true,
      zip,
      neighborhood: getNeighborhoodForZip(zip),
      count: result.rows.length,
      stories: result.rows,
    });
  } catch (err) {
    console.error('Error fetching submitted stories from DB:', err);
    // Return empty rather than erroring — frontend shows curated stories either way
    return NextResponse.json({
      success: true,
      zip,
      neighborhood: getNeighborhoodForZip(zip),
      count: 0,
      stories: [],
    });
  }
}
