'use client';

import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { HeroPage } from './pages/HeroPage';
import { MapPage } from './pages/MapPage';
import { NeighborhoodPage } from './pages/NeighborhoodPage';
import { StoriesPage } from './pages/StoriesPage';
import { AboutPage } from './pages/AboutPage';
import { MethodsPage } from './pages/MethodsPage';

/**
 * REP - Rare Renal Equity Project
 * High-Fidelity Interactive Wireframe
 *
 * This is the main app component that orchestrates page navigation
 * and state management for the entire platform.
 */
export const REPWireframe: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedZip, setSelectedZip] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  const handleSelectZip = (zip: string) => {
    setSelectedZip(zip);
  };

  const handleReturn = () => {
    setCurrentPage('map');
  };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      color: '#1a1a1a',
      background: '#fff',
      minHeight: '100vh'
    }}>
      {/* Navigation appears on all pages */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Render current page */}
      {currentPage === 'home' && <HeroPage onNavigate={handleNavigate} />}
      {currentPage === 'map' && (
        <MapPage
          selectedZip={selectedZip}
          onSelectZip={handleSelectZip}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'neighborhood' && (
        <NeighborhoodPage
          selectedZip={selectedZip}
          onNavigate={handleNavigate}
          onReturn={handleReturn}
        />
      )}
      {currentPage === 'stories' && <StoriesPage selectedZip={selectedZip} />}
      {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === 'methods' && <MethodsPage />}

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '48px 32px',
        marginTop: '80px',
        borderTop: '1px solid #333'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>REP</div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888',
                lineHeight: '1.6'
              }}>
                Rare Renal Equity Project<br />
                Mapping structural inequity in kidney disease.
              </p>
            </div>

            <div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '12px'
              }}>Navigation</div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {['home', 'map', 'stories', 'about', 'methods'].map(page => (
                  <button
                    key={page}
                    onClick={() => handleNavigate(page)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#aaa',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#aaa';
                    }}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '12px'
              }}>Resources</div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <a href="#" style={{
                  color: '#aaa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  textDecoration: 'none'
                }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}>Census API</a>
                <a href="#" style={{
                  color: '#aaa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  textDecoration: 'none'
                }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}>OpenStreetMap</a>
                <a href="#" style={{
                  color: '#aaa',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  textDecoration: 'none'
                }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}>MapLibre GL</a>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '32px',
            borderTop: '1px solid #333',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            color: '#666'
          }}>
            <p>
              Built with care for health equity and community benefit.<br />
              Not genetics. Geography and justice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default REPWireframe;
