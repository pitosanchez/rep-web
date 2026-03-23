/**
 * API Route: GET /api/stories/by-zip?zip=10456
 *
 * Returns patient stories for a given ZIP code based on neighborhood mapping.
 */

import { NextResponse } from 'next/server';
import { stories } from '@/lib/stories';
import { getNeighborhoodForZip } from '@/lib/storyZipMapping';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get('zip');

    if (!zip) {
      return NextResponse.json({
        success: false,
        error: 'ZIP code is required'
      }, { status: 400 });
    }

    // Get neighborhood for this ZIP
    const neighborhood = getNeighborhoodForZip(zip);

    // Find stories for this neighborhood
    const storiesForZip = stories.filter(story =>
      story.neighborhood.toLowerCase() === neighborhood.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      zip,
      neighborhood,
      count: storiesForZip.length,
      stories: storiesForZip,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
