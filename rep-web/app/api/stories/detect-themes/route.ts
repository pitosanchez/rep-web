/**
 * POST /api/stories/detect-themes
 * Body: { story_text: string }
 * Returns: { themes: string[] }
 *
 * Uses claude-haiku for fast, low-cost real-time theme detection
 * while the user is typing their story.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a social determinants of health analyst reading patient stories about kidney disease.
Your job is to identify structural and social themes present in the story text.

Return ONLY a JSON array of theme strings — no explanation, no markdown, no wrapper object.
Example output: ["Travel burden","Insurance barriers","Clinician dismissal"]

Use these known themes when they apply (use exact phrasing):
- Travel burden
- Delayed referrals
- Fragmented care
- Insurance barriers
- Clinician dismissal
- Environmental exposure
- Poverty
- Cost burden
- Food insecurity
- Housing instability
- Language barrier
- Lack of specialist access
- Medication access
- Caregiver burden
- Mental health
- Distrust of medical system
- Racial bias in care
- Workplace impact

You may also add themes not on this list if clearly present in the story. Keep all themes concise (2–4 words).
Return an empty array [] if the text is too short or no themes are detectable.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { story_text: string };
    const { story_text } = body;

    if (!story_text || story_text.trim().length < 50) {
      return NextResponse.json({ themes: [] });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Identify themes in this story:\n\n${story_text.slice(0, 2000)}`
        }
      ]
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]';

    // Parse safely
    let themes: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        themes = parsed.filter((t): t is string => typeof t === 'string');
      }
    } catch {
      themes = [];
    }

    return NextResponse.json({ themes });
  } catch (err) {
    console.error('[detect-themes]', err);
    return NextResponse.json({ themes: [] }, { status: 500 });
  }
}
