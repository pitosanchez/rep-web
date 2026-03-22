import React, { useState, useEffect } from 'react';
import { themes } from '@/lib/mockData';
import { stories } from '@/lib/stories';

interface StoriesPageProps {
  selectedZip: string | null;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({ selectedZip }) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Travel burden', 'Delayed referrals']);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Auto-scroll to expanded story
  useEffect(() => {
    if (expandedStory) {
      setTimeout(() => {
        const element = document.getElementById('expanded-story');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [expandedStory]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Example Stories Section */}
      <section style={{
        padding: '64px 32px',
        background: '#fff',
        borderBottom: '1px solid #e8e4df'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            color: '#1a1a1a',
            marginBottom: '12px'
          }}>Patient Stories</h2>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: '#666',
            marginBottom: '48px',
            maxWidth: '620px',
            lineHeight: '1.6'
          }}>
            These stories represent patterns documented across communities. Names and identifying details are composite,
            but the structural barriers they face are real.
          </p>

          {/* Stories Grid */}
          <div className="grid-stories">
            {stories.map((story) => (
              <article
                key={story.id}
                onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                style={{
                  padding: '32px',
                  border: `2px solid ${story.accentColor}`,
                  borderRadius: '8px',
                  background: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: expandedStory === story.id ? 'translateY(-4px)' : 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  height: '4px',
                  width: '32px',
                  background: story.accentColor,
                  borderRadius: '2px',
                  marginBottom: '16px'
                }} />
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: story.accentColor,
                  marginBottom: '4px'
                }}>
                  {story.name}, {story.age}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  color: '#888',
                  marginBottom: '16px'
                }}>
                  {story.neighborhood}
                </p>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: story.accentColor,
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {story.diagnosisShort}
                </p>
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#555'
                }}>
                  {story.profile.summary}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    color: story.accentColor,
                    fontWeight: '500',
                    margin: 0
                  }}>
                    Click to read full story
                  </p>
                  <span style={{
                    fontSize: '14px',
                    transition: 'transform 0.3s ease',
                    transform: expandedStory === story.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'inline-block'
                  }}>
                    ↓
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Story Modal */}
      {expandedStory && (
        <section style={{
          padding: '48px 32px',
          background: '#f9f7f4',
          borderTop: '2px solid #e8e4df',
          scrollMarginTop: '100px'
        }} id="expanded-story">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {stories.find(s => s.id === expandedStory) && (
              <article>
                <button
                  onClick={() => setExpandedStory(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c45a3b',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: '32px'
                  }}
                >
                  ← Back to stories
                </button>

                {(() => {
                  const story = stories.find(s => s.id === expandedStory);
                  if (!story) return null;

                  return (
                    <div>
                      <div style={{
                        height: '4px',
                        width: '48px',
                        background: story.accentColor,
                        borderRadius: '2px',
                        marginBottom: '24px'
                      }} />
                      <h2 style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '42px',
                        fontWeight: '700',
                        color: story.accentColor,
                        marginBottom: '8px'
                      }}>
                        {story.name}, {story.age}
                      </h2>
                      <p style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '14px',
                        color: '#888',
                        marginBottom: '32px'
                      }}>
                        {story.location} · {story.diagnosis}
                      </p>

                      {/* Profile Card */}
                      <div style={{
                        background: '#fff',
                        border: `2px solid ${story.accentColor}`,
                        borderRadius: '8px',
                        padding: '24px',
                        marginBottom: '40px'
                      }}>
                        <div className="grid-2col" style={{
                          gap: '20px',
                          marginBottom: '20px'
                        }}>
                          <div>
                            <p style={{
                              fontFamily: 'system-ui, sans-serif',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: story.accentColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '4px'
                            }}>Age</p>
                            <p style={{
                              fontFamily: 'system-ui, sans-serif',
                              fontSize: '15px',
                              color: '#1a1a1a'
                            }}>{story.profile.age}</p>
                          </div>
                          <div>
                            <p style={{
                              fontFamily: 'system-ui, sans-serif',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: story.accentColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '4px'
                            }}>Race / Ethnicity</p>
                            <p style={{
                              fontFamily: 'system-ui, sans-serif',
                              fontSize: '15px',
                              color: '#1a1a1a'
                            }}>{story.profile.ethnicity}</p>
                          </div>
                        </div>
                        <div style={{
                          borderTop: '1px solid #e8e4df',
                          paddingTop: '16px'
                        }}>
                          <p style={{
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: story.accentColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '4px'
                          }}>Summary</p>
                          <p style={{
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '15px',
                            color: '#1a1a1a',
                            lineHeight: '1.6'
                          }}>{story.profile.summary}</p>
                        </div>
                      </div>

                      {/* Story Narrative */}
                      <h3 style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: story.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '20px',
                        paddingBottom: '12px',
                        borderBottom: `1px solid #e8e4df`
                      }}>The Story</h3>
                      <div style={{ marginBottom: '40px' }}>
                        {story.narrative.map((para, i) => (
                          <p
                            key={i}
                            style={{
                              fontFamily: 'Georgia, serif',
                              fontSize: '16px',
                              lineHeight: '1.8',
                              color: '#444',
                              marginBottom: '20px',
                              fontWeight: '300'
                            }}
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Pull Quote */}
                      {story.pullQuotes[0] && (
                        <div style={{
                          background: story.accentColor + '10',
                          borderLeft: `4px solid ${story.accentColor}`,
                          padding: '20px 24px',
                          marginBottom: '40px',
                          borderRadius: '4px'
                        }}>
                          <p style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '18px',
                            fontStyle: 'italic',
                            color: story.accentColor,
                            lineHeight: '1.7',
                            margin: 0
                          }}>
                            "{story.pullQuotes[0]}"
                          </p>
                        </div>
                      )}

                      {/* Geography Context */}
                      <h3 style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: story.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '20px',
                        paddingBottom: '12px',
                        borderBottom: `1px solid #e8e4df`
                      }}>Geography + Structural Reality</h3>
                      <div style={{ marginBottom: '40px' }}>
                        {story.geographyContext.map((para, i) => (
                          <p
                            key={i}
                            style={{
                              fontFamily: 'Georgia, serif',
                              fontSize: '16px',
                              lineHeight: '1.8',
                              color: '#444',
                              marginBottom: '20px',
                              fontWeight: '300'
                            }}
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Reflection */}
                      <h3 style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: story.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '20px',
                        paddingBottom: '12px',
                        borderBottom: `1px solid #e8e4df`
                      }}>Reflection</h3>
                      <div style={{
                        background: story.accentColor + '10',
                        borderLeft: `4px solid ${story.accentColor}`,
                        padding: '20px 24px',
                        marginBottom: '24px',
                        borderRadius: '4px'
                      }}>
                        <p style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '16px',
                          fontStyle: 'italic',
                          color: story.accentColor,
                          lineHeight: '1.7',
                          margin: 0
                        }}>
                          "{story.reflection.wishes}"
                        </p>
                      </div>

                      <div style={{ marginBottom: '40px' }}>
                        <p style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          marginBottom: '8px'
                        }}>
                          What would have changed his outcome:
                        </p>
                        <p style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '15px',
                          lineHeight: '1.7',
                          color: '#555'
                        }}>
                          {story.reflection.wouldChange}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          marginBottom: '8px'
                        }}>
                          What he wishes he had known:
                        </p>
                        <p style={{
                          fontFamily: 'Georgia, serif',
                          fontSize: '15px',
                          lineHeight: '1.7',
                          color: '#555'
                        }}>
                          {story.reflection.shouldKnow}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </article>
            )}
          </div>
        </section>
      )}

      {/* Submission Section */}
      <section style={{
        padding: '48px 32px',
        background: '#faf7f3'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            fontWeight: '400',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>Share Your Experience</h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            This is for patients and caregivers living with <strong>APOL1-mediated
            kidney disease</strong> or <strong>FSGS</strong>. Your submission is
            anonymous by default and grounded in neighborhood.
          </p>
        </div>
      </section>

      <section style={{
        padding: '48px 32px 80px',
        background: '#fff'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Form */}
          <div style={{
            background: '#fff',
            border: '1px solid #e8e4df',
            borderRadius: '12px',
            padding: 'clamp(20px, 5vw, 40px)'
          }}>
            <div className="form-row-2col">
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>ZIP Code</label>
                <input
                  type="text"
                  placeholder="e.g., 10456"
                  defaultValue={selectedZip || ''}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>I am a</label>
                <select style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '15px',
                  background: '#fff'
                }}>
                  <option>Patient</option>
                  <option>Caregiver</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>Condition</label>
              <select style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                background: '#fff'
              }}>
                <option>APOL1-mediated kidney disease</option>
                <option>FSGS</option>
                <option>CKD (context)</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>Themes (select all that apply)</label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {themes.map((theme, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTheme(theme)}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      background: selectedThemes.includes(theme) ? '#1a1a1a' : '#fff',
                      color: selectedThemes.includes(theme) ? '#fff' : '#444',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>Your reflection (anonymous)</label>
              <textarea
                placeholder="How does where you live affect your kidney care? What do clinicians misunderstand about your environment?"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '15px',
                  minHeight: '140px',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888',
                marginTop: '8px'
              }}>
                {`Don't include names, exact addresses, employer details, or anything identifying.`}
                <br />
                Keep it under 240 characters.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '32px',
              padding: '16px',
              background: '#faf7f3',
              borderRadius: '8px'
            }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '4px', accentColor: '#c45a3b' }} />
              <span style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: '1.5'
              }}>
                I consent to REP using this anonymous submission in aggregated form by place and theme.
                My story may appear alongside others from my neighborhood when patterns emerge.
              </span>
            </div>

            <button style={{
              width: '100%',
              padding: '16px 32px',
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Submit Your Story
            </button>
          </div>

          {/* How it works */}
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: '#1a1a1a',
              marginBottom: '16px'
            }}>How stories become evidence</h3>
            <ol style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.8',
              paddingLeft: '20px'
            }}>
              <li>You select your neighborhood and respond to guided prompts</li>
              <li>Submissions are reviewed for safety and clarity</li>
              <li>Stories are grouped by place and theme</li>
              <li>Individual entries appear only when patterns emerge (minimum threshold)</li>
              <li>Your voice becomes structural evidence, not isolated testimony</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};
