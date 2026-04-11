'use client';

import React from 'react';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

/**
 * About page — being rebuilt.
 * Will cover: why we built this, the purpose of the platform,
 * why the Bronx, how to use the site, and what this means
 * for redefining how research is implemented.
 */
export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#faf7f3' }}>

      {/* Header */}
      <section style={{
        background: '#1a1a1a',
        padding: '100px 48px 80px',
        borderBottom: '3px solid #c45a3b'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#c45a3b',
            marginBottom: '24px'
          }}>
            About This Platform
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: '300',
            color: '#fff',
            lineHeight: '1.1',
            letterSpacing: '-1px',
            marginBottom: '32px'
          }}>
            Why we built this.<br />
            <span style={{ color: '#c45a3b' }}>And what it can become.</span>
          </h1>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: '1.7',
            maxWidth: '560px',
            margin: 0
          }}>
            This section is being written. It will explain the purpose of Where We Live,
            why the Bronx, how to navigate the platform, and what it means to redefine
            how research is built and shared.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <section style={{ padding: '100px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{
            width: '1px',
            height: '80px',
            background: '#c45a3b',
            margin: '0 auto 48px',
            opacity: 0.4
          }} />
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontStyle: 'italic',
            color: '#888',
            lineHeight: '1.7',
            marginBottom: '48px'
          }}>
            In the meantime, explore the platform — the map, the data, the stories.
            The work speaks for itself.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('map')}
                  style={{
                    padding: '14px 32px',
                    background: '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#c45a3b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; }}
                >
                  Explore the Map
                </button>
                <button
                  onClick={() => onNavigate('stories')}
                  style={{
                    padding: '14px 32px',
                    background: 'none',
                    color: '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    borderRadius: '4px',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c45a3b'; e.currentTarget.style.color = '#c45a3b'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a'; }}
                >
                  Read the Stories
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
