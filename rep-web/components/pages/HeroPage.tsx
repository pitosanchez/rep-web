'use client';

import React, { useState, useEffect } from 'react';

interface HeroPageProps {
  onNavigate: (page: string) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onNavigate }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section with Full-Bleed Background Image */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        background: '#1a1a1a'
      }}>
        {/* Background image with overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/my-playground.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          opacity: 1,
          zIndex: 0
        }} />

        {/* Lighter overlay - only on bottom left for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top right, rgba(26, 26, 26, 0.5) 0%, rgba(26, 26, 26, 0.2) 40%, transparent 80%)',
          zIndex: 1
        }} />

        {/* Content - positioned at center, offset 50px right */}
        <div style={{
          maxWidth: isMobile ? '100%' : '550px',
          padding: isMobile
            ? '24px 16px 60px 16px'
            : '50px 64px 50px 32px',
          position: 'absolute',
          left: 'calc(50% + 150px)',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: isMobile ? '100%' : 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}>
            {/* Site name - bigger and bolder FOCAL TITLE */}
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(48px, 8vw, 64px)',
              fontWeight: '700',
              letterSpacing: '-2px',
              color: '#fff',
              marginBottom: '4px',
              opacity: 1,
              lineHeight: '1',
              whiteSpace: 'nowrap'
            }}>
              Where We Live
            </div>

            {/* Subtitle - "Your Story Starts With Where You Live" */}
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: isMobile ? 'clamp(16px, 4vw, 24px)' : 'clamp(18px, 3vw, 26px)',
              fontWeight: '400',
              color: '#fff',
              lineHeight: '1.2',
              marginBottom: isMobile ? '20px' : '16px',
              letterSpacing: '-0.5px',
              fontStyle: 'italic'
            }}>
              Your Story Starts<br />
              With Where You Live
            </h2>

            {/* Subheading - Minimal Glass Morphism */}
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: isMobile ? 'clamp(12px, 3vw, 14px)' : 'clamp(13px, 1.8vw, 15px)',
              color: '#fff',
              lineHeight: '1.6',
              marginBottom: isMobile ? '40px' : '28px',
              maxWidth: isMobile ? '100%' : '550px',
              fontWeight: '400',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: isMobile ? '16px 14px' : '20px 24px',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              opacity: 1,
              boxShadow: 'none'
            }}>
              Mapping how genetics, place, and structural inequality converge in APOL1-mediated kidney disease and FSGS — with patient stories grounded in geography.
            </p>

            {/* CTAs - positioned below text content */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '12px' : '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: isMobile ? '20px' : '32px',
              zIndex: 10,
              maxWidth: isMobile ? 'calc(100% - 32px)' : 'auto'
            }}>
              <button
                onClick={() => onNavigate('map')}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '600',
                  padding: isMobile ? '14px 24px' : '18px 40px',
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(196, 90, 59, 0.3)',
                  flex: isMobile ? '1' : 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#a84830';
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(196, 90, 59, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#c45a3b';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(196, 90, 59, 0.3)';
                }}
              >
                {isMobile ? 'Map' : 'Explore the Map'}
              </button>

              <button
                onClick={() => onNavigate('stories')}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '600',
                  padding: isMobile ? '14px 24px' : '18px 40px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  flex: isMobile ? '1' : 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                {isMobile ? 'Stories' : 'Read Stories'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section style={{
        padding: isMobile ? '48px 16px' : '80px 32px',
        background: '#faf7f3',
        borderTop: '1px solid #e8e4df'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: isMobile ? 'clamp(20px, 5vw, 36px)' : 'clamp(24px, 4vw, 42px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.5',
            marginBottom: '24px'
          }}>
            A public accountability platform that connects data with human experience.
          </div>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            color: '#666',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}>
            Numbers can tell us what is happening. Stories explain why. By pairing datasets with real stories from patients and families living in the Bronx, we see something different. The rates become human. The percentages become people.
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            color: '#666',
            lineHeight: '1.8'
          }}>
            This is how we build accountability. This is how we change systems.
          </p>
        </div>
      </section>

      {/* Three Pillar Section */}
      <section style={{
        padding: isMobile ? '48px 16px' : '80px 32px',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: isMobile ? 'clamp(24px, 5vw, 36px)' : 'clamp(28px, 5vw, 48px)',
            fontWeight: '400',
            color: '#1a1a1a',
            marginBottom: isMobile ? '32px' : '60px',
            textAlign: 'center'
          }}>
            How REP Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? '24px' : '48px'
          }}>
            {[
              {
                number: '01',
                title: 'Map the Data',
                description: 'Geographic data reveals patterns of disease burden, care access, environmental exposure, and structural inequality across neighborhoods.'
              },
              {
                number: '02',
                title: 'Share Stories',
                description: 'Patient and caregiver stories grounded in place show what the data cannot: lived experience, context, and human reality.'
              },
              {
                number: '03',
                title: 'Build Accountability',
                description: 'When data and stories converge, systems change. Researchers, clinicians, and policymakers can see clearly and respond accordingly.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: isMobile ? '24px' : '40px',
                background: '#faf7f3',
                borderRadius: '12px',
                borderLeft: '4px solid #c45a3b'
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: isMobile ? '32px' : '48px',
                  fontWeight: '700',
                  color: 'rgba(196, 90, 59, 0.2)',
                  marginBottom: '12px'
                }}>
                  {item.number}
                </div>
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: isMobile ? '18px' : '22px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isMobile ? '14px' : '15px',
                  color: '#666',
                  lineHeight: '1.7'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '48px 16px' : '80px 32px',
        background: '#1a1a1a',
        color: '#fff'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: isMobile ? 'clamp(24px, 5vw, 36px)' : 'clamp(28px, 5vw, 44px)',
            fontWeight: '400',
            marginBottom: '20px'
          }}>
            Ready to explore?
          </h2>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '18px',
            color: '#ccc',
            marginBottom: '32px',
            lineHeight: '1.7'
          }}>
            Start with the map to see how place shapes disease burden. Then read stories to understand why it matters.
          </p>

          <button
            onClick={() => onNavigate('map')}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '600',
              padding: isMobile ? '14px 32px' : '18px 48px',
              background: '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a84830';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#c45a3b';
            }}
          >
            Open Map Explorer
          </button>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
