import React, { useState } from 'react';
import { themes } from '@/lib/mockData';

interface StoriesPageProps {
  selectedZip: string | null;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({ selectedZip }) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Travel burden', 'Delayed referrals']);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  return (
    <div style={{ paddingTop: '80px' }}>
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
            padding: '40px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '24px'
            }}>
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
                Don't include names, exact addresses, employer details, or anything identifying.
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
