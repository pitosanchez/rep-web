'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { stories as patientStories, PatientStory } from '@/lib/stories';

interface StoriesPageProps {
  selectedZip: string | null;
  onNavigate?: (page: string) => void;
}

// ── Shared primitives ───────────────────────────────────────────────────────

const ChapterLabel: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: light ? 'rgba(196,90,59,0.85)' : '#c45a3b',
    marginBottom: '20px'
  }}>
    {children}
  </div>
);

const Rule: React.FC = () => (
  <div style={{ width: '48px', height: '2px', background: '#c45a3b', margin: '0 0 32px 0' }} />
);

// ── Story Reading View ──────────────────────────────────────────────────────

const StoryReadingView: React.FC<{
  story: PatientStory;
  onBack: () => void;
}> = ({ story, onBack }) => {
  const t = useTranslations('stories');
  const tFooter = useTranslations('footer');

  return (
    <div style={{ paddingTop: '80px', background: '#fff', minHeight: '100vh' }}>

      {/* Back navigation */}
      <div style={{
        background: '#1a1a1a',
        padding: '20px 48px',
        borderBottom: `3px solid ${story.accentColor}`
      }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            color: '#888',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 0,
            letterSpacing: '0.5px'
          }}
        >
          {t('backToAllStories')}
        </button>
      </div>

      {/* Story header */}
      <section style={{ background: '#1a1a1a', padding: '60px 48px 80px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: story.accentColor,
            marginBottom: '20px'
          }}>
            {story.neighborhood} · {story.zip}
          </div>

          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: '300',
            color: '#fff',
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            {story.name}
          </h1>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '48px'
          }}>
            {[story.profile.age + ' years old', story.profile.ethnicity, story.diagnosisShort].map((tag, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#444' }}>·</span>}
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888' }}>{tag}</span>
              </React.Fragment>
            ))}
          </div>

          {story.pullQuotes[0] && (
            <blockquote style={{ borderLeft: `4px solid ${story.accentColor}`, paddingLeft: '28px', margin: 0 }}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontStyle: 'italic',
                color: '#ccc',
                lineHeight: '1.65',
                margin: 0
              }}>
                &ldquo;{story.pullQuotes[0]}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </section>

      {/* Narrative */}
      <section style={{ padding: '80px 48px', background: '#fff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: story.accentColor,
            marginBottom: '32px'
          }}>
            {t('theStory')}
          </div>

          {story.narrative.map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: '28px'
            }}>
              {para}
            </p>
          ))}

          {story.pullQuotes[1] && (
            <div style={{
              margin: '48px 0',
              padding: '36px 40px',
              background: '#faf7f3',
              borderLeft: `4px solid ${story.accentColor}`,
              borderRadius: '0 4px 4px 0'
            }}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '21px',
                fontStyle: 'italic',
                lineHeight: '1.65',
                color: '#1a1a1a',
                margin: 0
              }}>
                &ldquo;{story.pullQuotes[1]}&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Geography */}
      <section style={{ padding: '64px 48px', background: '#faf7f3' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: story.accentColor,
            marginBottom: '32px'
          }}>
            {t('geographyContext')}
          </div>

          {story.geographyContext.map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#444',
              marginBottom: '24px'
            }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Reflection */}
      <section style={{ padding: '64px 48px 80px', background: '#1a1a1a' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: story.accentColor,
            marginBottom: '48px'
          }}>
            {t('reflection')}
          </div>

          {[
            { label: t('wouldChange'), text: story.reflection.wouldChange },
            { label: t('shouldKnow'), text: story.reflection.shouldKnow },
            { label: t('wishesLabel', { name: story.name }), text: story.reflection.wishes }
          ].map(({ label, text }, i) => (
            <div key={i} style={{
              marginBottom: i < 2 ? '40px' : '0',
              paddingBottom: i < 2 ? '40px' : '0',
              borderBottom: i < 2 ? '1px solid #2a2a2a' : 'none'
            }}>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#666',
                marginBottom: '12px'
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                lineHeight: '1.75',
                color: '#bbb',
                margin: 0
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer nav */}
      <section style={{
        padding: '48px',
        background: '#fff',
        borderTop: '1px solid #e8e4df',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: '#c45a3b',
            background: 'none',
            border: '1px solid #c45a3b',
            borderRadius: '3px',
            padding: '12px 24px',
            cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#c45a3b'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#c45a3b'; }}
        >
          {t('allStories')}
        </button>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#888'
        }}>
          {tFooter('motto')}
        </div>
      </section>
    </div>
  );
};

// ── Story Card ──────────────────────────────────────────────────────────────

const StoryCard: React.FC<{
  story: PatientStory;
  onClick: () => void;
  featured?: boolean;
}> = ({ story, onClick, featured = false }) => {
  const [hovered, setHovered] = useState(false);
  const t = useTranslations('stories');

  if (featured) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          background: '#fff',
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '24px',
          boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-3px)' : 'none',
          transition: 'all 0.25s ease',
          border: '1px solid #e8e4df'
        }}
      >
        <div style={{
          background: story.accentColor,
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '24px'
            }}>
              {story.neighborhood}
            </div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: '300',
              color: '#fff',
              lineHeight: '1.1',
              marginBottom: '8px'
            }}>
              {story.name}
            </div>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              {story.profile.age} · {story.diagnosisShort}
            </div>
          </div>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '40px'
          }}>
            {t('featuredStory')}
          </div>
        </div>

        <div style={{
          padding: '48px 48px 48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              color: story.accentColor,
              opacity: 0.15,
              lineHeight: 1,
              marginBottom: '-16px'
            }}>
              &ldquo;
            </div>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(17px, 2vw, 22px)',
              fontStyle: 'italic',
              lineHeight: '1.65',
              color: '#1a1a1a',
              marginBottom: '32px'
            }}>
              {story.pullQuotes[0]}
            </p>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#666'
            }}>
              {story.profile.summary}
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '40px',
            color: story.accentColor,
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            {t('readStoryName', { name: story.name })}
            <span style={{
              transform: hovered ? 'translateX(4px)' : 'none',
              transition: 'transform 0.2s ease',
              display: 'inline-block'
            }}>→</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.25s ease',
        border: '1px solid #e8e4df'
      }}
    >
      <div style={{ height: '5px', background: story.accentColor, flexShrink: 0 }} />
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#aaa',
          marginBottom: '16px'
        }}>
          {story.neighborhood}
        </div>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '6px',
          lineHeight: 1.2
        }}>
          {story.name}
        </div>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          color: '#888',
          marginBottom: '24px'
        }}>
          {story.profile.age} · {story.diagnosisShort}
        </div>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '32px',
          color: story.accentColor,
          opacity: 0.15,
          lineHeight: 1,
          marginBottom: '-8px'
        }}>
          &ldquo;
        </div>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          fontStyle: 'italic',
          lineHeight: '1.65',
          color: '#333',
          marginBottom: '0',
          flexGrow: 1
        }}>
          {story.pullQuotes[0].length > 160
            ? story.pullQuotes[0].substring(0, 160).trimEnd() + '…'
            : story.pullQuotes[0]}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f0f0f0',
          color: story.accentColor,
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          {t('readTheirStory')}
          <span style={{
            transform: hovered ? 'translateX(4px)' : 'none',
            transition: 'transform 0.2s ease',
            display: 'inline-block'
          }}>→</span>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────

const STORIES_PER_PAGE = 6;

export const StoriesPage: React.FC<StoriesPageProps> = ({ selectedZip: _selectedZip, onNavigate }) => {
  const t = useTranslations('about');
  const tStories = useTranslations('stories');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(STORIES_PER_PAGE);

  useEffect(() => {
    if (expandedStory) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [expandedStory]);

  if (expandedStory) {
    const story = patientStories.find(s => s.id === expandedStory);
    if (story) {
      return <StoryReadingView story={story} onBack={() => setExpandedStory(null)} />;
    }
  }

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── Hero (from About) ─────────────────────────────────────── */}
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
          <ChapterLabel light>{tStories('chapterEssayLabel')}</ChapterLabel>
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
          <div style={{ width: '64px', height: '2px', background: '#c45a3b', marginBottom: '28px' }} />
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.6',
            maxWidth: '520px'
          }}>
            {t('openingHeading')}
          </p>
        </div>
      </section>

      {/* ── On Stories ───────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>{tStories('chapterOnStories')}</ChapterLabel>
          <Rule />

          {[t('universalPara'), t('para1'), t('para2')].map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: '28px'
            }}>
              {para}
            </p>
          ))}

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

          {[t('para3'), t('para4')].map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: i === 0 ? '28px' : '0'
            }}>
              {para}
            </p>
          ))}
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
          {[t('quote1a'), t('quote1b')].map((q, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: '400',
              color: '#1a1a1a',
              lineHeight: '1.5',
              marginBottom: i === 0 ? '16px' : '32px',
              fontStyle: 'italic'
            }}>
              &ldquo;{q}&rdquo;
            </p>
          ))}
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

      {/* ── The Act of Sharing ───────────────────────────────────── */}
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
          {[t('sharingBody1'), t('sharingBody2'), t('sharingBody3'), t('sharingBody4')].map((para, i, arr) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: i < arr.length - 1 ? '28px' : '0'
            }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── Workshop Interlude (dark) ─────────────────────────────── */}
      <section style={{
        background: '#1a1a1a',
        padding: '80px 32px',
        borderTop: '3px solid #c45a3b'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel light>{t('workshopChapterLabel')}</ChapterLabel>
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

      {/* ── The People: Story Collection ─────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '80px 48px 96px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Section intro */}
          <div style={{ maxWidth: '680px', marginBottom: '64px' }}>
            <ChapterLabel>{tStories('chapterVoices')}</ChapterLabel>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '300',
              color: '#1a1a1a',
              lineHeight: '1.1',
              letterSpacing: '-0.5px',
              marginBottom: '24px'
            }}>
              {tStories('notCaseStudies')}<br />
              <span style={{ color: '#c45a3b' }}>{tStories('thesePeople')}</span>
            </h2>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#777',
              lineHeight: '1.7',
              maxWidth: '540px'
            }}>
              {tStories('voicesDesc')}
            </p>
          </div>

          {/* Featured story */}
          <StoryCard
            story={patientStories[0]}
            onClick={() => setExpandedStory(patientStories[0].id)}
            featured
          />

          {/* Story grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {patientStories.slice(1, visibleCount).map(story => (
              <StoryCard
                key={story.id}
                story={story}
                onClick={() => setExpandedStory(story.id)}
              />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < patientStories.length && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setVisibleCount(n => n + STORIES_PER_PAGE)}
                style={{
                  padding: '14px 40px',
                  background: '#fff',
                  color: '#c45a3b',
                  border: '2px solid #c45a3b',
                  borderRadius: '4px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#c45a3b'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#c45a3b'; }}
              >
                {tStories('loadMore', { count: patientStories.length - visibleCount })}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stories in Healthcare ─────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '100px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>{tStories('chapterStoriesInHealthcare')}</ChapterLabel>
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

          {[t('storiesHealthcareBody'), t('culturalBody'), t('storiesHealthcareBody2')].map((para, i, arr) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: i < arr.length - 1 ? '28px' : '64px'
            }}>
              {para}
            </p>
          ))}

          {/* Questions */}
          <div style={{ borderTop: '1px solid #d8d1c8' }}>
            {[t('question1'), t('question2'), t('question3')].map((q, i) => (
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
          <ChapterLabel light>{tStories('chapterMission')}</ChapterLabel>
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

          {[t('missionBody1'), t('missionBody2')].map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#bbb',
              marginBottom: i === 0 ? '28px' : '48px'
            }}>
              {para}
            </p>
          ))}

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
          <ChapterLabel>{tStories('chapterScience')}</ChapterLabel>
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

          {[t('scienceBody1'), t('scienceBody2'), t('scienceBody3'), t('scienceDiscoveryBody')].map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: '19px',
              lineHeight: '1.85',
              color: '#333',
              marginBottom: i < 3 ? '28px' : '48px'
            }}>
              {para}
            </p>
          ))}

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

      {/* ── Integration ───────────────────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '100px 32px 0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ChapterLabel>{tStories('chapterIntegration')}</ChapterLabel>
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
          {[t('closingLine1'), t('closingLine2'), t('closingLine3')].map((line, i) => (
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
          <ChapterLabel>{tStories('chapterAddVoice')}</ChapterLabel>
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
              onClick={() => onNavigate('share-story')}
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
              {tStories('shareStoryButton')}
            </button>
          )}
        </div>
      </section>

    </div>
  );
};
