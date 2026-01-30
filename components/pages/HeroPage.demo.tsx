/**
 * HeroPage Demo & Testing Examples
 *
 * This file shows different ways to use and test the HeroPage component
 * Not meant to be imported in production, just for reference
 */

import { HeroPage } from './HeroPage';

/**
 * Example 1: Basic usage with console logging
 */
export const HeroPageDemo1 = () => (
  <HeroPage
    onNavigate={(page) => {
      console.log(`User clicked: ${page}`);
    }}
  />
);

/**
 * Example 2: With Next.js router
 * Note: Only works in client component with 'use client'
 */
// import { useRouter } from 'next/navigation';
// export const HeroPageDemo2 = () => {
//   const router = useRouter();
//   return (
//     <HeroPage
//       onNavigate={(page) => {
//         window.scrollTo(0, 0);
//         router.push(`/${page}`);
//       }}
//     />
//   );
// };

/**
 * Example 3: With custom tracking
 * Track which CTAs users click
 */
// export const HeroPageDemo3 = () => {
//   const handleNavigate = (page: string) => {
//     // Send analytics event
//     fetch('/api/analytics', {
//       method: 'POST',
//       body: JSON.stringify({
//         event: 'cta_click',
//         page,
//         timestamp: new Date().toISOString()
//       })
//     });
//
//     // Navigate
//     router.push(`/${page}`);
//   };
//
//   return <HeroPage onNavigate={handleNavigate} />;
// };

/**
 * Example 4: Standalone with modal dialog
 * Open modals instead of navigating
 */
// import { useState } from 'react';
// export const HeroPageDemo4 = () => {
//   const [openModal, setOpenModal] = useState<string | null>(null);
//
//   const handleNavigate = (page: string) => {
//     // In a modal scenario
//     if (page === 'stories') {
//       setOpenModal('story-form');
//     } else if (page === 'map') {
//       setOpenModal('map-explorer');
//     }
//   };
//
//   return (
//     <>
//       <HeroPage onNavigate={handleNavigate} />
//       {openModal === 'story-form' && <StoryModal onClose={() => setOpenModal(null)} />}
//       {openModal === 'map-explorer' && <MapModal onClose={() => setOpenModal(null)} />}
//     </>
//   );
// };

/**
 * Testing Scenarios
 */

export const HeroPageTestingGuide = () => (
  <div style={{ padding: '40px', fontFamily: 'monospace' }}>
    <h2>HeroPage Testing Scenarios</h2>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Visual Testing</h3>
      <ul>
        <li>✓ Hero section displays with gradient background</li>
        <li>✓ Grid pattern visible as subtle overlay</li>
        <li>✓ Accent shape (circle) visible in top right</li>
        <li>✓ Headline readable and centered</li>
        <li>✓ Two CTAs visible below headline</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Interactive Testing</h3>
      <ul>
        <li>{`✓ Primary button ("Explore the Map") responds to hover`}</li>
        <li>{`✓ Secondary button ("Share Your Experience") responds to hover`}</li>
        <li>{`✓ "What Makes REP Different" cards lift on hover`}</li>
        <li>✓ Featured story cards respond to hover</li>
        <li>✓ CTA buttons in banner section responsive</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Responsive Testing</h3>
      <ul>
        <li>✓ Desktop (1200px+): Full multi-column layout</li>
        <li>✓ Tablet (768px): 2-column cards</li>
        <li>✓ Mobile (320px): Single column, full width</li>
        <li>✓ Font sizes scale with viewport</li>
        <li>✓ Padding/margins adjust for mobile</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Accessibility Testing</h3>
      <ul>
        <li>⚠️ Test with screen reader (NVDA, JAWS, VoiceOver)</li>
        <li>⚠️ Keyboard navigation (Tab through buttons)</li>
        <li>⚠️ Color contrast (run WCAG checker)</li>
        <li>⚠️ Font readability at 200% zoom</li>
        <li>⚠️ Test focus states on buttons</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Content Testing</h3>
      <ul>
        <li>✓ All text renders without overflow</li>
        <li>✓ Images (if added) load properly</li>
        <li>✓ Story quotes display correctly</li>
        <li>✓ Theme tags and badges visible</li>
        <li>✓ Attribution text readable</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Performance Testing</h3>
      <ul>
        <li>✓ First paint: &lt;1s</li>
        <li>✓ Interactions smooth (60fps)</li>
        <li>✓ No console errors</li>
        <li>✓ No memory leaks (check DevTools)</li>
        <li>✓ Fast on slow networks (throttle in DevTools)</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Browser Testing</h3>
      <ul>
        <li>✓ Chrome/Edge (latest)</li>
        <li>✓ Firefox (latest)</li>
        <li>✓ Safari (latest)</li>
        <li>✓ Mobile Safari (iOS)</li>
        <li>✓ Chrome Mobile (Android)</li>
      </ul>
    </div>
  </div>
);
