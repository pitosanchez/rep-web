/**
 * Story Moderation API
 *
 * GET  /api/stories/moderate          — list pending + flagged stories (admin)
 * POST /api/stories/moderate          — approve, reject, or flag a story
 *
 * Protected by MODERATION_SECRET env var.
 * Pass as header: Authorization: Bearer <MODERATION_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const VALID_STATUSES = new Set(['pending', 'approved', 'rejected', 'flagged']);

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.MODERATION_SECRET;
  if (!secret) {
    console.error('MODERATION_SECRET is not set — moderation endpoints are disabled.');
    return false;
  }
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawStatus = searchParams.get('status') ?? 'pending';
  if (!VALID_STATUSES.has(rawStatus)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${[...VALID_STATUSES].join(', ')}.` },
      { status: 422 }
    );
  }
  const statusFilter = rawStatus;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  try {
    const result = await pool.query(
      `SELECT id, zip_code, role, condition, story_text, status,
              moderation_note, moderated_at, created_at,
              LEFT(story_text, 200) AS preview
       FROM stories
       WHERE status = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [statusFilter, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM stories WHERE status = $1`,
      [statusFilter]
    );

    return NextResponse.json({
      success: true,
      stories: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (err) {
    console.error('Moderation queue fetch failed:', err);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { story_id: string; action: 'approve' | 'reject' | 'flag'; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { story_id, action, note } = body;
  if (!story_id || !['approve', 'reject', 'flag'].includes(action)) {
    return NextResponse.json({ error: 'story_id and valid action required' }, { status: 422 });
  }

  const statusMap = { approve: 'approved', reject: 'rejected', flag: 'flagged' } as const;
  const newStatus = statusMap[action];

  try {
    await pool.query(
      `UPDATE stories
       SET status = $1, moderation_note = $2, moderated_at = NOW()
       WHERE id = $3`,
      [newStatus, note ?? null, story_id]
    );

    return NextResponse.json({ success: true, story_id, status: newStatus });
  } catch (err) {
    console.error('Moderation action failed:', err);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}
