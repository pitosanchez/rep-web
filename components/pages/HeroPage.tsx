import React, { useState } from 'react';
import { diffPoints, contextFactors } from '@/lib/mockData';

interface HeroPageProps {
  onNavigate: (page: string) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onNavigate }) => {
  const [hoveredDiff, setHoveredDiff] = useState<number | null>(null);

  return (
    <div style={{ paddingTop: '80px' }}>
    {/* Hero Section */}
    <section style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #faf7f3 0%, #f5f0ea 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.7
      }} />

      {/* Accent shape */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196, 90, 59, 0.08) 0%, transparent 70%)'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px' }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#c45a3b',
            marginBottom: '24px'
          }}>
            A Public Accountability Platform
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(42px, 6vw, 64px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.1',
            marginBottom: '28px',
            letterSpacing: '-1px'
          }}>
            Where You Live Shapes<br />
            <span style={{ fontStyle: 'italic', color: '#c45a3b' }}>Kidney Disease</span>
          </h1>

          {/* Subhead */}
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '20px',
            color: '#4a4a4a',
            lineHeight: '1.6',
            marginBottom: '40px',
            maxWidth: '600px'
          }}>
            Mapping how genetics, place, and structural inequality converge in
            APOL1-mediated kidney disease and FSGS — with patient stories
            grounded in geography.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('map')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '500',
                padding: '16px 32px',
                background: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explore the Map
            </button>
            <button
              onClick={() => onNavigate('stories')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '500',
                padding: '16px 32px',
                background: 'transparent',
                color: '#1a1a1a',
                border: '2px solid #1a1a1a',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1a1a1a';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#1a1a1a';
              }}
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* What Makes REP Different */}
    <section style={{
      padding: '100px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          fontWeight: '400',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#888',
          marginBottom: '48px'
        }}>
          What Makes REP Different
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px'
        }}>
          {diffPoints.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredDiff(i)}
              onMouseLeave={() => setHoveredDiff(null)}
              style={{
                padding: '32px',
                border: '1px solid #e8e4df',
                borderRadius: '8px',
                background: hoveredDiff === i ? '#fff' : '#faf7f3',
                transition: 'all 0.2s ease',
                transform: hoveredDiff === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredDiff === i ? '0 12px 24px rgba(0,0,0,0.08)' : 'none',
                cursor: 'default'
              }}>
              <div style={{
                fontSize: '28px',
                marginBottom: '16px',
                color: '#c45a3b'
              }}>{item.icon}</div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                fontWeight: '400',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>{item.title}</h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                color: '#666',
                lineHeight: '1.6'
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pull Quote Section */}
    <section style={{
      padding: '80px 32px',
      background: '#1a1a1a',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '48px',
          color: '#c45a3b',
          marginBottom: '24px'
        }}>"</div>
        <blockquote style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: '400',
          color: '#fff',
          lineHeight: '1.5',
          fontStyle: 'italic',
          marginBottom: '24px'
        }}>
          In some ZIP codes, long travel times to nephrology care are treated as
          "noncompliance." REP shows the conditions underneath the label.
        </blockquote>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          color: '#888',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          South Bronx, NY · Aggregated from 19 submissions
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section style={{
      padding: '100px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '64px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '36px',
              fontWeight: '400',
              color: '#1a1a1a',
              lineHeight: '1.2',
              marginBottom: '24px'
            }}>
              Disease does not happen in a vacuum.
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.7',
              marginBottom: '32px'
            }}>
              APOL1-mediated kidney disease and FSGS are shaped not only by biology,
              but by environment and policy. REP brings these forces into one public
              system — pairing data with community-reported experience tied to geography
              so structural harm cannot be dismissed as anecdote.
            </p>
            <button
              onClick={() => onNavigate('about')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#c45a3b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Learn more about REP →
            </button>
          </div>

          {/* Visual diagram */}
          <div style={{
            background: '#faf7f3',
            borderRadius: '12px',
            padding: '48px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {contextFactors.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: item.color,
                    opacity: 0.9,
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '4px'
                    }}>{item.label}</div>
                    <div style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#666'
                    }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting lines */}
            <div style={{
              position: 'absolute',
              left: '72px',
              top: '96px',
              width: '2px',
              height: '120px',
              background: 'linear-gradient(to bottom, #c45a3b, #d4a574, #6b8f71)'
            }} />
          </div>
        </div>
      </div>
    </section>

    {/* Featured Story Preview */}
    <section style={{
      padding: '100px 32px',
      background: 'linear-gradient(135deg, #faf7f3 0%, #f5f0ea 100%)',
      borderTop: '1px solid #e8e4df',
      borderBottom: '1px solid #e8e4df'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '48px',
          textAlign: 'center'
        }}>
          Patient Voice as Structural Evidence
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {[
            {
              zip: '10456',
              location: 'South Bronx, NY',
              theme: 'Travel Burden',
              quote: 'I was told genetics explained everything, but nobody asked how long it takes to get to care from here.',
              condition: 'APOL1'
            },
            {
              zip: '10459',
              location: 'Longwood / Hunts Point, NY',
              theme: 'Environmental Exposure',
              quote: 'They test my blood but never ask about the air I breathe or the water I drink.',
              condition: 'APOL1'
            },
            {
              zip: '10457',
              location: 'Tremont, NY',
              theme: 'Fragmented Care',
              quote: 'Appointments get labeled \u201cmissed\u201d like it\u2019s a character flaw. It\u2019s transit and time off work.',
              condition: 'FSGS'
            }
          ].map((story, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #e8e4df',
                borderRadius: '12px',
                padding: '32px',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Quote mark */}
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '48px',
                color: 'rgba(196, 90, 59, 0.2)',
                lineHeight: 1,
                marginBottom: '12px'
              }}>"</div>

              {/* Story */}
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                color: '#1a1a1a',
                lineHeight: '1.6',
                fontStyle: 'italic',
                marginBottom: '20px'
              }}>
                {story.quote}
              </p>

              {/* Meta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#888',
                    marginBottom: '4px'
                  }}>
                    {story.location}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '11px',
                      padding: '3px 8px',
                      background: '#f5f5f5',
                      borderRadius: '3px',
                      color: '#666'
                    }}>
                      {story.condition}
                    </span>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '11px',
                      padding: '3px 8px',
                      background: '#c45a3b',
                      borderRadius: '3px',
                      color: '#fff'
                    }}>
                      {story.theme}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Call to Action Banner */}
    <section style={{
      padding: '80px 32px',
      background: '#1a1a1a',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Accent background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196, 90, 59, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: '400',
          lineHeight: '1.2',
          marginBottom: '24px'
        }}>
          Ready to explore how place shapes disease?
        </h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          color: '#aaa',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Browse neighborhood profiles, read aggregated stories, or share your own experience.
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onNavigate('map')}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: '500',
              padding: '16px 40px',
              background: '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d46a4b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(196, 90, 59, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#c45a3b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explore the Map
          </button>
          <button
            onClick={() => onNavigate('stories')}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: '500',
              padding: '16px 40px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#1a1a1a';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Share Your Experience
          </button>
        </div>
      </div>
    </section>

    {/* Trust Badges */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          color: '#888',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Built with Trust and Transparency
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          textAlign: 'center'
        }}>
          {[
            { label: 'IRB-Safe', desc: 'Privacy-first architecture' },
            { label: 'Auditable', desc: 'Every decision logged' },
            { label: 'Community-Centered', desc: 'Built with, not for' },
            { label: 'Publishable', desc: 'Meets research standards' }
          ].map((badge, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                fontWeight: '600',
                color: '#c45a3b',
                marginBottom: '8px'
              }}>
                ✓
              </div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                color: '#1a1a1a',
                marginBottom: '4px'
              }}>
                {badge.label}
              </div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888'
              }}>
                {badge.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
  );
};
