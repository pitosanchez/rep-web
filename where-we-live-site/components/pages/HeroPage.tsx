'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface HeroPageProps {
  onNavigate: (page: string) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onNavigate }) => {
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations('hero');

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
          backgroundPosition: isMobile ? '38% center' : 'center center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          opacity: 1,
          zIndex: 0
        }} />

        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? 'radial-gradient(ellipse at center, rgba(26,26,26,0.45) 0%, rgba(26,26,26,0.65) 100%)'
            : 'linear-gradient(to top right, rgba(26, 26, 26, 0.5) 0%, rgba(26, 26, 26, 0.2) 40%, transparent 80%)',
          zIndex: 1
        }} />

        {/* MOBILE: Title + tagline above her head */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            textAlign: 'center',
            width: 'calc(100% - 32px)'
          }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(30px, 8vw, 44px)',
              fontWeight: '700',
              letterSpacing: '-2px',
              color: '#fff',
              marginBottom: '6px',
              lineHeight: '1',
              whiteSpace: 'nowrap',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)'
            }}>
              Where We Live
            </div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(14px, 4vw, 19px)',
              fontWeight: '400',
              color: '#fff',
              lineHeight: '1.3',
              margin: 0,
              letterSpacing: '-0.5px',
              fontStyle: 'italic',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)'
            }}>
              {t('tagline1')}<br />
              {t('tagline2')}
            </h2>
          </div>
        )}

        {/* MOBILE: Description + CTAs centered over her body */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            top: '62%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            width: 'calc(100% - 32px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#fff',
              lineHeight: '1.6',
              margin: 0,
              fontWeight: '400',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '14px 16px',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {t('description')}
            </p>
            <button
              onClick={() => onNavigate('map')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                padding: '14px 0',
                width: '100%',
                background: '#c45a3b',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(196, 90, 59, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#a84830';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#c45a3b';
              }}
            >
              {t('exploreMap')}
            </button>
            <button
              onClick={() => onNavigate('stories')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                padding: '14px 0',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              {t('readStories')}
            </button>
          </div>
        )}

        {/* DESKTOP: All content in one block, offset right */}
        {!isMobile && (
          <div style={{
            maxWidth: '550px',
            padding: '50px 64px 50px 32px',
            position: 'absolute',
            left: 'calc(50% + 150px)',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(48px, 8vw, 64px)',
              fontWeight: '700',
              letterSpacing: '-2px',
              color: '#fff',
              marginBottom: '4px',
              lineHeight: '1',
              whiteSpace: 'nowrap'
            }}>
              Where We Live
            </div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontWeight: '400',
              color: '#fff',
              lineHeight: '1.2',
              marginBottom: '16px',
              letterSpacing: '-0.5px',
              fontStyle: 'italic'
            }}>
              {t('tagline1')}<br />
              {t('tagline2')}
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              color: '#fff',
              lineHeight: '1.6',
              marginBottom: '28px',
              maxWidth: '550px',
              fontWeight: '400',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px 24px',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
              {t('description')}
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginTop: '32px', zIndex: 10 }}>
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
                  boxShadow: '0 4px 20px rgba(196, 90, 59, 0.3)',
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
                {t('exploreMap')}
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
                  backdropFilter: 'blur(10px)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                {t('readStories')}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── APOL1 / FSGS one-line explainer + Bronx-first + Who it's for ── */}
      <section style={{ padding: isMobile ? '40px 16px' : '56px 48px', background: '#fff', borderTop: '3px solid #c45a3b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Quick science explainer */}
          <div style={{
            padding: '16px 24px',
            background: '#faf7f3',
            borderLeft: '4px solid #c45a3b',
            borderRadius: '0 8px 8px 0',
            marginBottom: 48,
          }}>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#1a1a1a' }}>APOL1</strong> is a gene variant linked to higher kidney disease risk in people with West African ancestry.
              <strong style={{ color: '#1a1a1a' }}> FSGS</strong> (focal segmental glomerulosclerosis) is a serious kidney condition affecting the organ's filtering system.
              Most people with these variants never develop disease —
              <strong style={{ color: '#c45a3b' }}> structural factors like poverty, pollution, and limited care access are what tip the balance.</strong>
              {' '}<span style={{ color: '#888', fontSize: 12 }}>Starting in the Bronx. Building a model for other communities.</span>
            </p>
          </div>

          {/* Who this is for */}
          <div style={{ marginBottom: 8 }}>
            <div style={{
              fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
              letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 24,
            }}>
              Who This Is For
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: 16,
            }}>
              {[
                { icon: '❤', label: 'Patients & Families', desc: 'Understand what\'s shaping your health — and find resources near you.' },
                { icon: '⚕', label: 'Clinicians', desc: 'Screen for structural barriers. See what your patients are actually dealing with.' },
                { icon: '◎', label: 'Researchers', desc: 'Explore place-based signals alongside clinical data.' },
                { icon: '◆', label: 'Policymakers', desc: 'Identify where investment would reduce structural barriers most.' },
              ].map((card, i) => (
                <div key={i} style={{
                  padding: '20px', background: '#faf7f3', borderRadius: 8,
                  border: '1px solid #e8e4df',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                    {card.label}
                  </div>
                  <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#666', lineHeight: 1.6, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
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
            {t('missionStatement')}
          </div>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            color: '#666',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}>
            {t('missionBody1')}
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '17px',
            color: '#666',
            lineHeight: '1.8'
          }}>
            {t('missionBody2')}
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
            {t('howItWorks')}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? '24px' : '48px'
          }}>
            {[
              { number: '01', titleKey: 'pillar1Title', descKey: 'pillar1Desc' },
              { number: '02', titleKey: 'pillar2Title', descKey: 'pillar2Desc' },
              { number: '03', titleKey: 'pillar3Title', descKey: 'pillar3Desc' }
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
                  {t(item.titleKey)}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isMobile ? '14px' : '15px',
                  color: '#666',
                  lineHeight: '1.7'
                }}>
                  {t(item.descKey)}
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
            {t('ctaTitle')}
          </h2>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '15px' : '18px',
            color: '#ccc',
            marginBottom: '32px',
            lineHeight: '1.7'
          }}>
            {t('ctaDesc')}
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
            {t('openMap')}
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
