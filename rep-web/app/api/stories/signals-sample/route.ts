/**
 * GET  /api/stories/signals-sample?bucket=below_threshold&limit=20
 *   Returns unreviewed story_signals for manual review.
 *   bucket: "below_threshold" | "above_threshold" | "no_confidence" | "all" (default: below_threshold)
 *   Requires Authorization: Bearer <MODERATION_SECRET>
 *
 * POST /api/stories/signals-sample
 *   Override the confidence score or approve/reject a signal.
 *   Body: { signal_id, action: "approve"|"reject"|"adjust_confidence", new_confidence?, note? }
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const MODERATION_SECRET = process.env.MODERATION_SECRET ?? '';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? '';
  return Boolean(MODERATION_SECRET) && auth === `Bearer ${MODERATION_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const bucket = searchParams.get('bucket') ?? 'below_threshold';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100);

  const bucketFilter =
    bucket === 'all'
      ? ''
      : `AND confidence_bucket = '${bucket.replace(/[^a-z_]/g, '')}'`;

  const result = await pool.query(
    `SELECT * FROM signal_review_queue ${bucketFilter} LIMIT $1`,
    [limit]
  );

  return NextResponse.json({
    success: true,
    bucket,
    count: result.rows.length,
    signals: result.rows,
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as {
    signal_id: string;
    action: 'approve' | 'reject' | 'adjust_confidence';
    new_confidence?: number;
    reviewer: string;
    note?: string;
  };

  const { signal_id, action, new_confidence, reviewer, note } = body;

  if (!signal_id || !action || !reviewer) {
    return NextResponse.json({ error: 'signal_id, action, and reviewer are required.' }, { status: 400 });
  }

  // Fetch current confidence for audit log
  const current = await pool.query<{ overall_confidence: number | null }>(
    `SELECT overall_confidence FROM story_signals WHERE id = $1`,
    [signal_id]
  );
  if (current.rows.length === 0) {
    return NextResponse.json({ error: 'Signal not found.' }, { status: 404 });
  }
  const old_confidence = current.rows[0].overall_confidence;

  // Compute effective new_confidence
  const effectiveConfidence =
    action === 'approve' ? Math.max(old_confidence ?? 0, 0.6) :
    action === 'reject'  ? 0 :
    new_confidence ?? old_confidence;

  // Update story_signals
  await pool.query(
    `UPDATE story_signals
     SET confidence_override = $1,
         reviewed_at         = NOW(),
         reviewed_by         = $2,
         override_note       = $3
     WHERE id = $4`,
    [effectiveConfidence, reviewer, note ?? null, signal_id]
  );

  // Write audit record
  await pool.query(
    `INSERT INTO signal_overrides
       (story_signal_id, reviewer, action, old_confidence, new_confidence, note)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [signal_id, reviewer, action, old_confidence, effectiveConfidence, note ?? null]
  );

  return NextResponse.json({ success: true, signal_id, action, effective_confidence: effectiveConfidence });
}
