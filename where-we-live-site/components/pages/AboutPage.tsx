'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

const serifStack = 'Iowan Old Style, Palatino Linotype, Book Antiqua, Palatino, serif';

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const t = useTranslations('aboutPage');

  const timeline = [
    { period: t('timeline0period'), title: t('timeline0title'), body: t('timeline0body') },
    { period: t('timeline1period'), title: t('timeline1title'), body: t('timeline1body') },
    { period: t('timeline2period'), title: t('timeline2title'), body: t('timeline2body') },
    { period: t('timeline3period'), title: t('timeline3title'), body: t('timeline3body') },
    { period: t('timeline4period'), title: t('timeline4title'), body: t('timeline4body') },
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f5f1ea' }}>
      <section style={{
        background: '#111',
        borderBottom: '3px solid #c45a3b',
        padding: '92px 24px 86px'
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(196,90,59,0.9)',
            margin: 0
          }}>
            {t('eyebrow')}
          </p>
          <h1 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(42px, 8vw, 86px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.6px',
            color: '#fff',
            maxWidth: '900px',
            margin: '20px auto 18px'
          }}>
            {t('h1line1')}
            <br />
            {t('h1line2')}
          </h1>
          <p style={{
            fontFamily: serifStack,
            fontSize: 'clamp(18px, 2.4vw, 24px)',
            lineHeight: 1.6,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '760px',
            margin: '0 auto 18px'
          }}>
            {t('subhead')}
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.58)',
            margin: 0
          }}>
            {t('byline')}
          </p>
        </div>
      </section>

      <article style={{ background: '#fbf8f2', padding: '74px 24px 44px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{
            fontFamily: serifStack,
            fontSize: 'clamp(21px, 2.6vw, 29px)',
            lineHeight: 1.65,
            color: '#1f1f1f',
            margin: '0 0 34px'
          }}>
            <span style={{
              float: 'left',
              fontSize: '4.2em',
              lineHeight: '0.78',
              paddingRight: '9px',
              marginTop: '-1px',
              color: '#c45a3b',
              fontFamily: serifStack
            }}>
              W
            </span>
            {t('drop')}
          </p>

          {(['article1', 'article2', 'article3'] as const).map((key) => (
            <p key={key} style={{
              fontFamily: serifStack,
              fontSize: 'clamp(19px, 2.2vw, 22px)',
              lineHeight: 1.85,
              color: '#222',
              margin: '0 0 28px'
            }}>
              {t(key)}
            </p>
          ))}

          <blockquote style={{
            margin: '42px 0',
            padding: '10px 0 10px 22px',
            borderLeft: '3px solid #c45a3b'
          }}>
            <p style={{
              fontFamily: serifStack,
              fontSize: 'clamp(26px, 3vw, 38px)',
              lineHeight: 1.4,
              fontStyle: 'italic',
              color: '#1a1a1a',
              margin: 0
            }}>
              {t('blockquote1')}
            </p>
          </blockquote>

          <h2 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(32px, 4.8vw, 52px)',
            fontWeight: 400,
            color: '#141414',
            letterSpacing: '-0.4px',
            margin: '50px 0 20px'
          }}>
            {t('bronxHeading')}
          </h2>
          <p style={{
            fontFamily: serifStack,
            fontSize: 'clamp(19px, 2.2vw, 22px)',
            lineHeight: 1.85,
            color: '#222',
            margin: '0 0 26px'
          }}>
            {t('bronxIntro')}
          </p>
        </div>

        <div style={{ maxWidth: '1080px', margin: '0 auto 44px' }}>
          <div style={{
            background: '#111',
            padding: '14px',
            border: '1px solid #2a2a2a'
          }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/H15INi4udRE"
                title="Bronx history video context"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.3px',
            lineHeight: 1.7,
            color: '#666',
            margin: '12px 4px 0'
          }}>
            {t('videoCaption')}
          </p>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(32px, 4.8vw, 52px)',
            fontWeight: 400,
            color: '#141414',
            letterSpacing: '-0.4px',
            margin: '52px 0 18px'
          }}>
            {t('timelineHeading')}
          </h2>

          <div style={{ borderLeft: '1px solid #d6cec2', paddingLeft: '22px', marginBottom: '34px' }}>
            {timeline.map((item, idx) => (
              <div key={idx} style={{ marginBottom: idx === timeline.length - 1 ? 0 : '24px' }}>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                  color: '#c45a3b',
                  margin: '0 0 6px'
                }}>
                  {item.period}
                </p>
                <h3 style={{
                  fontFamily: serifStack,
                  fontSize: '29px',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: '#1a1a1a',
                  margin: '0 0 8px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: serifStack,
                  fontSize: '19px',
                  lineHeight: 1.75,
                  color: '#3a3a3a',
                  margin: 0
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <h2 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(32px, 4.8vw, 52px)',
            fontWeight: 400,
            color: '#141414',
            letterSpacing: '-0.4px',
            margin: '52px 0 18px'
          }}>
            {t('mergeHeading')}
          </h2>

          {(['merge1', 'merge2'] as const).map((key) => (
            <p key={key} style={{
              fontFamily: serifStack,
              fontSize: 'clamp(19px, 2.2vw, 22px)',
              lineHeight: 1.85,
              color: '#222',
              margin: '0 0 28px'
            }}>
              {t(key)}
            </p>
          ))}

          <blockquote style={{
            margin: '42px 0',
            padding: '10px 0 10px 22px',
            borderLeft: '3px solid #c45a3b'
          }}>
            <p style={{
              fontFamily: serifStack,
              fontSize: 'clamp(24px, 2.8vw, 34px)',
              lineHeight: 1.45,
              fontStyle: 'italic',
              color: '#1a1a1a',
              margin: 0
            }}>
              {t('blockquote2')}
            </p>
          </blockquote>

          <h2 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(32px, 4.8vw, 52px)',
            fontWeight: 400,
            color: '#141414',
            letterSpacing: '-0.4px',
            margin: '52px 0 18px'
          }}>
            {t('innovationHeading')}
          </h2>

          {(['innovation1', 'innovation2', 'innovation3'] as const).map((key) => (
            <p key={key} style={{
              fontFamily: serifStack,
              fontSize: 'clamp(19px, 2.2vw, 22px)',
              lineHeight: 1.85,
              color: '#222',
              margin: '0 0 28px'
            }}>
              {t(key)}
            </p>
          ))}
        </div>
      </article>

      <section style={{ background: '#151515', borderTop: '3px solid #c45a3b', padding: '84px 24px 92px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: serifStack,
            fontSize: 'clamp(34px, 5vw, 58px)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.12,
            maxWidth: '820px',
            margin: '0 0 20px'
          }}>
            {t('closingHeading')}
          </h2>
          <p style={{
            fontFamily: serifStack,
            fontSize: 'clamp(20px, 2.4vw, 24px)',
            color: '#cbcbcb',
            lineHeight: 1.8,
            maxWidth: '860px',
            margin: '0 0 40px'
          }}>
            {t('closingBody')}
          </p>

          {onNavigate && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('map')}
                style={{
                  padding: '14px 26px',
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a84832'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c45a3b'; }}
              >
                {t('ctaData')}
              </button>
              <button
                onClick={() => onNavigate('stories')}
                style={{
                  padding: '14px 26px',
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #757575',
                  borderRadius: '3px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c45a3b'; e.currentTarget.style.color = '#c45a3b'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#fff'; }}
              >
                {t('ctaStories')}
              </button>
              <button
                onClick={() => onNavigate('share-story')}
                style={{
                  padding: '14px 26px',
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid #757575',
                  borderRadius: '3px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c45a3b'; e.currentTarget.style.color = '#c45a3b'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#fff'; }}
              >
                {t('ctaVoice')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
