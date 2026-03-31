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

        {/* Content */}
        <div style={{
          maxWidth: isMobile ? '320px' : '550px',
          padding: isMobile ? '28px 20px' : '50px 64px 50px 32px',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {/* Site name */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: isMobile ? 'clamp(30px, 8vw, 44px)' : 'clamp(48px, 8vw, 64px)',
            fontWeight: '700',
            letterSpacing: '-2px',
            color: '#fff',
            marginBottom: '6px',
            lineHeight: '1',
            whiteSpace: 'nowrap'
          }}>
            Where We Live
          </div>

          {/* Subtitle */}
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(18px, 3vw, 26px)',
            fontWeight: '400',
            color: '#fff',
            lineHeight: '1.3',
            marginBottom: isMobile ? '16px' : '16px',
            letterSpacing: '-0.5px',
            fontStyle: 'italic'
          }}>
            {t('tagline1')}<br />
            {t('tagline2')}
          </h2>

          {/* Description */}
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: isMobile ? '13px' : 'clamp(13px, 1.8vw, 15px)',
            color: '#fff',
            lineHeight: '1.6',
            marginBottom: isMobile ? '24px' : '28px',
            maxWidth: isMobile ? '100%' : '550px',
            fontWeight: '400',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: isMobile ? '14px 16px' : '20px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
            {t('description')}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : '20px',
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
            zIndex: 10,
          }}>
            <button
              onClick={() => onNavigate('map')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                padding: isMobile ? '14px 0' : '18px 40px',
                width: isMobile ? '100%' : 'auto',
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
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                padding: isMobile ? '14px 0' : '18px 40px',
                width: isMobile ? '100%' : 'auto',
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
