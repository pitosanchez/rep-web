/**
 * Standalone Hero Page
 * For testing and isolating the hero/landing page
 * Route: /hero
 */

import React from 'react';
import { HeroPage } from '@/components/pages/HeroPage';

export const metadata = {
  title: 'REP — Where You Live Shapes Kidney Disease',
  description: 'A public accountability platform mapping how genetics, place, and structural inequality converge in kidney disease.',
};

export default function HeroRoute() {
  const handleNavigate = (page: string) => {
    // For standalone hero page, just log navigation
    console.log(`Navigation to: ${page}`);
  };

  return (
    <div style={{ background: '#fff' }}>
      <HeroPage onNavigate={handleNavigate} />
    </div>
  );
}
