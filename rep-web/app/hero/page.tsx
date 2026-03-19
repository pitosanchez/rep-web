'use client';

/**
 * Standalone Hero Page
 * For testing and isolating the hero/landing page
 * Route: /hero
 */

import React from 'react';
import { HeroPage } from '@/components/pages/HeroPage';

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
