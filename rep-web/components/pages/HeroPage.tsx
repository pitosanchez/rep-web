'use client';

import React, { useState } from 'react';

interface HeroPageProps {
  onNavigate: (page: string) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section with Full-Bleed Background Image */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
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
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
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

        {/* Content - positioned at bottom left */}
        <div style={{
          maxWidth: '1200px',
          padding: '70px 32px 10px calc(32px + 100px)',
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}>
          <div style={{ maxWidth: '700px' }}>
            {/* Site name - bigger and bolder */}
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '700',
              letterSpacing: '-1px',
              color: '#fff',
              marginBottom: '20px',
              opacity: 1
            }}>
              Where We Live
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: '400',
              color: '#fff',
              lineHeight: '1.2',
              marginBottom: '20px',
              letterSpacing: '-0.5px'
            }}>
              Where You Live Shapes
              <br />
              <span style={{ fontStyle: 'italic' }}>Kidney Disease</span>
            </h1>

            {/* Subheading - more visible with subtle background */}
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#fff',
              lineHeight: '1.7',
              marginBottom: '32px',
              maxWidth: '650px',
              fontWeight: '400',
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '20px 24px',
              borderRadius: '6px',
              backdropFilter: 'blur(6px)',
              opacity: 1
            }}>
              Mapping how genetics, place, and structural inequality converge in APOL1-mediated kidney disease and FSGS — with patient stories grounded in geography.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <button
                onClick={() => onNavigate('map')}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '18px 40px',
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(196, 90, 59, 0.3)'
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
                Explore the Map
              </button>

              <button
                onClick={() => onNavigate('stories')}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '18px 40px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                Read Stories
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section style={{
        padding: '80px 32px',
        background: '#faf7f3',
        borderTop: '1px solid #e8e4df'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(24px, 4vw, 42px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.5',
            marginBottom: '32px'
          }}>
            A public accountability platform that connects data with human experience.
          </div>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            color: '#666',
            lineHeight: '1.8',
            marginBottom: '24px'
          }}>
            Numbers can tell us what is happening. Stories explain why. By pairing datasets with real stories from patients and families living in the Bronx, we see something different. The rates become human. The percentages become people.
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            color: '#666',
            lineHeight: '1.8'
          }}>
            This is how we build accountability. This is how we change systems.
          </p>
        </div>
      </section>

      {/* Three Pillar Section */}
      <section style={{
        padding: '80px 32px',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: '400',
            color: '#1a1a1a',
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            How REP Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px'
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
                padding: '40px',
                background: '#faf7f3',
                borderRadius: '12px',
                borderLeft: '4px solid #c45a3b'
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'rgba(196, 90, 59, 0.2)',
                  marginBottom: '16px'
                }}>
                  {item.number}
                </div>
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '22px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '15px',
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
        padding: '80px 32px',
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
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: '400',
            marginBottom: '24px'
          }}>
            Ready to explore?
          </h2>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            color: '#ccc',
            marginBottom: '40px',
            lineHeight: '1.7'
          }}>
            Start with the map to see how place shapes disease burden. Then read stories to understand why it matters.
          </p>

          <button
            onClick={() => onNavigate('map')}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              padding: '18px 48px',
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
