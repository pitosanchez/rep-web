'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { stories as patientStories, PatientStory } from '@/lib/stories';

interface StoriesPageProps {
  selectedZip: string | null;
}

// ── Story Reading View ──────────────────────────────────────────────────────

const StoryReadingView: React.FC<{
  story: PatientStory;
  onBack: () => void;
}> = ({ story, onBack }) => {
  const t = useTranslations('stories');

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
          ← Back to all stories
        </button>
      </div>

      {/* Story header */}
      <section style={{
        background: '#1a1a1a',
        padding: '60px 48px 80px'
      }}>
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
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#888'
            }}>
              {story.profile.age} years old
            </span>
            <span style={{ color: '#444' }}>·</span>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#888'
            }}>
              {story.profile.ethnicity}
            </span>
            <span style={{ color: '#444' }}>·</span>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#888'
            }}>
              {story.diagnosisShort}
            </span>
          </div>

          {/* Opening pull quote */}
          {story.pullQuotes[0] && (
            <blockquote style={{
              borderLeft: `4px solid ${story.accentColor}`,
              paddingLeft: '28px',
              margin: 0
            }}>
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

          {/* Second pull quote if exists */}
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
            { label: "What " + story.name + " wishes:", text: story.reflection.wishes }
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

      {/* Navigation: back + read next */}
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
          ← All stories
        </button>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#888'
        }}>
          Not genetics. Geography and justice.
        </div>
      </section>
    </div>
  );
};

// ── Story Card (grid) ───────────────────────────────────────────────────────

const StoryCard: React.FC<{
  story: PatientStory;
  onClick: () => void;
  featured?: boolean;
}> = ({ story, onClick, featured = false }) => {
  const [hovered, setHovered] = useState(false);

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
        {/* Left: identity */}
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
            Featured story
          </div>
        </div>

        {/* Right: quote + read CTA */}
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
            Read {story.name}&rsquo;s story
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
      {/* Color accent top bar */}
      <div style={{
        height: '5px',
        background: story.accentColor,
        flexShrink: 0
      }} />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Neighborhood */}
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

        {/* Name + age */}
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

        {/* Pull quote */}
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

        {/* Read CTA */}
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
          Read their story
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

export const StoriesPage: React.FC<StoriesPageProps> = ({ selectedZip: _selectedZip }) => {
  const t = useTranslations('stories');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(STORIES_PER_PAGE);

  // Scroll to top when entering reading view
  useEffect(() => {
    if (expandedStory) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [expandedStory]);

  // ── Reading View ──────────────────────────────────────────────────────────
  if (expandedStory) {
    const story = patientStories.find(s => s.id === expandedStory);
    if (story) {
      return <StoryReadingView story={story} onBack={() => setExpandedStory(null)} />;
    }
  }

  // ── Main Stories Page ─────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section style={{
        background: '#1a1a1a',
        padding: '80px 48px',
        borderBottom: '3px solid #c45a3b'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#c45a3b',
            marginBottom: '20px'
          }}>
            {t('title')}
          </div>

          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '300',
            color: '#fff',
            lineHeight: '1.1',
            marginBottom: '28px',
            letterSpacing: '-1px'
          }}>
            These are not case studies.
            <br />
            <span style={{ color: '#c45a3b' }}>These are people.</span>
          </h1>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            fontStyle: 'italic',
            color: '#888',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: 0
          }}>
            {t('description')}
          </p>
        </div>
      </section>

      {/* ── Story Grid ───────────────────────────────────────────── */}
      <section style={{
        background: '#faf7f3',
        padding: '64px 48px 80px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Featured: first story full-width horizontal */}
          <StoryCard
            story={patientStories[0]}
            onClick={() => setExpandedStory(patientStories[0].id)}
            featured
          />

          {/* Remaining stories in a responsive grid */}
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
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                onClick={() => setVisibleCount(n => n + STORIES_PER_PAGE)}
                style={{
                  padding: '12px 32px', background: '#fff', color: '#c45a3b',
                  border: '2px solid #c45a3b', borderRadius: 4, fontFamily: 'system-ui',
                  fontSize: 13, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Load More Stories ({patientStories.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
