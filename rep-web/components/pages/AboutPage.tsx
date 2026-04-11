'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

const ChapterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#c45a3b',
    marginBottom: '20px'
  }}>
    {children}
  </div>
);

const Rule: React.FC = () => (
  <div style={{
    width: '48px',
    height: '2px',
    background: '#c45a3b',
    margin: '0 0 32px 0'
  }} />
);

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const t = useTranslations('about');

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        backgroundImage: 'url(/womaninthewindo.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundAttachment: 'fixed',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* gradient: dark at bottom-left, transparent top-right */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.55) 40%, rgba(26,26,26,0.1) 100%)'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '80px 64px',
          maxWidth: '780px'
        }}>
          <ChapterLabel>The Essay</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(40px, 7vw, 76px)',
            fontWeight: '300',
            lineHeight: '1.1',
            color: '#fff',
            letterSpacing: '-1px',
            marginBottom: '28px'
          }}>
            {t('heroTitle')}
          </h1>
          <div style={{
            width: '64px',
            height: '2px',
            background: '#c45a3b',
            marginBottom: '28px'
          }} />
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.6',
            maxWidth: '520px'
          }}>
            S{t('openingHeading')}
          </p>
        </div>
      </section>

      {/* ── Opening ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>On Stories</ChapterLabel>
          <Rule />

          {/* Universal frame — new */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('universalPara')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('para1')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('para2')}
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            color: '#1a1a1a',
            marginBottom: '48px'
          }}>
            {t('learn')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('para3')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '0'
          }}>
            {t('para4')}
          </p>
        </div>

        {/* Pull Quote */}
        <div style={{
          maxWidth: '820px',
          margin: '80px auto 0',
          padding: '64px 32px',
          textAlign: 'center',
          borderTop: '1px solid #e8e4df',
          borderBottom: '1px solid #e8e4df'
        }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.5',
            marginBottom: '16px',
            fontStyle: 'italic'
          }}>
            &ldquo;{t('quote1a')}&rdquo;
          </p>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.5',
            marginBottom: '32px',
            fontStyle: 'italic'
          }}>
            &ldquo;{t('quote1b')}&rdquo;
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#c45a3b'
          }}>
            {t('belief')}
          </p>
        </div>
      </section>

      {/* ── The Act of Sharing (new) ──────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>{t('sharingChapterLabel')}</ChapterLabel>
          <Rule />

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.25',
            marginBottom: '40px'
          }}>
            {t('sharingTitle')}
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('sharingBody1')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('sharingBody2')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('sharingBody3')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '0'
          }}>
            {t('sharingBody4')}
          </p>
        </div>
      </section>

      {/* ── Workshop Interlude (new, dark) ────────────────────────── */}
      <section style={{
        background: '#1a1a1a',
        padding: '80px 32px',
        borderTop: '3px solid #c45a3b'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>{t('workshopChapterLabel')}</ChapterLabel>

          {/* Large italic quote */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(20px, 2.8vw, 28px)',
            fontWeight: '300',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.88)',
            lineHeight: '1.65',
            marginBottom: '40px',
            paddingLeft: '28px',
            borderLeft: '2px solid #c45a3b'
          }}>
            &ldquo;{t('workshopQuote')}&rdquo;
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '17px',
            lineHeight: '1.85',
            color: '#999',
            marginBottom: '0'
          }}>
            {t('workshopContinuation')}
          </p>
        </div>
      </section>

      {/* ── Stories in Healthcare ─────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>Stories in Healthcare</ChapterLabel>
          <Rule />

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.25',
            marginBottom: '40px'
          }}>
            {t('storiesHealthcareTitle')}
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('storiesHealthcareBody')}
          </p>

          {/* Cultural preservation — new */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('culturalBody')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '64px'
          }}>
            {t('storiesHealthcareBody2')}
          </p>

          {/* Questions as typographic provocations */}
          <div style={{ borderTop: '1px solid #d8d1c8' }}>
            {[
              t('question1'),
              t('question2'),
              t('question3')
            ].map((q, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                padding: '28px 0',
                borderBottom: '1px solid #d8d1c8'
              }}>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '13px',
                  color: '#c45a3b',
                  fontWeight: '600',
                  marginTop: '4px',
                  flexShrink: 0,
                  width: '20px'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '19px',
                  lineHeight: '1.7',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  {q}
                </p>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '17px',
            fontStyle: 'italic',
            color: '#888',
            marginTop: '28px'
          }}>
            {t('questionsNote')}
          </p>
        </div>
      </section>

      {/* ── Our Mission ───────────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>Our Mission</ChapterLabel>
          <div style={{ width: '48px', height: '2px', background: '#c45a3b', marginBottom: '32px' }} />

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            color: '#fff',
            lineHeight: '1.25',
            marginBottom: '40px'
          }}>
            {t('missionTitle')}
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#bbb',
            marginBottom: '28px'
          }}>
            {t('missionBody1')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#bbb',
            marginBottom: '48px'
          }}>
            {t('missionBody2')}
          </p>

          {/* Emphasis statement */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            fontWeight: '400',
            color: '#fff',
            lineHeight: '1.35',
            marginBottom: '48px',
            paddingLeft: '24px',
            borderLeft: '3px solid #c45a3b'
          }}>
            {t('missionEmphasis')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#bbb',
            marginBottom: '28px'
          }}>
            {t('missionBody3')}
          </p>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            color: '#c45a3b',
            letterSpacing: '0.5px'
          }}>
            {t('missionGoal')}
          </p>
        </div>
      </section>

      {/* ── The Science of Stories ────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>The Science</ChapterLabel>
          <Rule />

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.25',
            marginBottom: '40px'
          }}>
            {t('scienceTitle')}
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('scienceBody1')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('scienceBody2')}
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('scienceBody3')}
          </p>

          {/* Exploration / discovery — new */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '48px'
          }}>
            {t('scienceDiscoveryBody')}
          </p>

          {/* Science quote */}
          <div style={{
            padding: '36px 40px',
            background: '#faf7f3',
            borderRadius: '4px',
            borderLeft: '3px solid #c45a3b'
          }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '20px',
              lineHeight: '1.75',
              fontStyle: 'italic',
              color: '#444',
              margin: 0
            }}>
              &ldquo;{t('scienceQuote')}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── Integrating Stories ───────────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '100px 32px 0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>Integration</ChapterLabel>
          <Rule />

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.25',
            marginBottom: '40px'
          }}>
            {t('integratingTitle')}
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '28px'
          }}>
            {t('integratingBody')}
          </p>

          {/* Voice and confidence — new */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            lineHeight: '1.85',
            color: '#333',
            marginBottom: '0'
          }}>
            {t('integratingVoiceBody')}
          </p>
        </div>

        {/* Closing tricolon */}
        <div style={{
          maxWidth: '900px',
          margin: '80px auto 0',
          padding: '80px 32px',
          background: '#1a1a1a',
          textAlign: 'center'
        }}>
          {[
            t('closingLine1'),
            t('closingLine2'),
            t('closingLine3')
          ].map((line, i) => (
            <React.Fragment key={i}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: '300',
                color: i === 2 ? '#c45a3b' : '#fff',
                lineHeight: '1.4',
                margin: 0,
                letterSpacing: '0.5px'
              }}>
                {line}
              </p>
              {i < 2 && (
                <div style={{
                  width: '1px',
                  height: '32px',
                  background: '#444',
                  margin: '24px auto'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 32px',
        background: '#faf7f3',
        borderTop: '1px solid #e8e4df'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <ChapterLabel>Join Us</ChapterLabel>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '400',
            color: '#1a1a1a',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            {t('ctaTitle')}
          </h2>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            color: '#666',
            lineHeight: '1.7',
            marginBottom: '48px',
            maxWidth: '520px',
            margin: '0 auto 48px'
          }}>
            {t('ctaDesc')}
          </p>

          {onNavigate && (
            <button
              onClick={() => onNavigate('stories')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '18px 52px',
                background: '#c45a3b',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#a84830'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c45a3b'; }}
            >
              {t('ctaButton')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
