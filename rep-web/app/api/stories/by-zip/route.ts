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
  const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const offset = page * limit;

  if (!zip) {
    return NextResponse.json({ success: false, error: 'ZIP code is required' }, { status: 400 });
  }

  try {
    const [result, countResult] = await Promise.all([
      pool.query<{
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
           AND (status = 'approved' OR status IS NULL)
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [zip, limit, offset]
      ),
      pool.query<{ total: string }>(
        `SELECT COUNT(*) AS total FROM stories WHERE zip_code = $1 AND (status = 'approved' OR status IS NULL)`,
        [zip]
      ),
    ]);

    const total = parseInt(countResult.rows[0]?.total ?? '0', 10);

    return NextResponse.json({
      success: true,
      zip,
      neighborhood: getNeighborhoodForZip(zip),
      count: result.rows.length,
      total,
      page,
      limit,
      has_more: offset + result.rows.length < total,
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
