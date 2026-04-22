'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ShareStoryPageProps {
  selectedZip: string | null;
}

const KNOWN_THEMES = [
  'Travel burden',
  'Delayed referrals',
  'Fragmented care',
  'Insurance barriers',
  'Clinician dismissal',
  'Environmental exposure',
  'Poverty',
  'Cost burden',
  'Food insecurity',
  'Housing instability',
  'Language barrier',
  'Lack of specialist access',
  'Medication access',
  'Caregiver burden',
  'Mental health',
  'Distrust of medical system',
  'Racial bias in care',
  'Workplace impact',
];

// ── Small UI primitives ─────────────────────────────────────────────────────

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{
    display: 'block',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    color: '#888',
    marginBottom: '10px'
  }}>
    {children}
  </label>
);

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontFamily: 'Georgia, serif',
  fontSize: '16px',
  color: '#1a1a1a',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

// ── Theme Pill ──────────────────────────────────────────────────────────────

const ThemePill: React.FC<{
  label: string;
  selected: boolean;
  aiDetected?: boolean;
  onClick: () => void;
}> = ({ label, selected, aiDetected = false, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 14px',
        border: selected
          ? '1px solid #c45a3b'
          : aiDetected
            ? '1px dashed #c45a3b'
            : '1px solid #e0e0e0',
        borderRadius: '20px',
        background: selected ? '#c45a3b' : aiDetected ? '#fff5f2' : hovered ? '#faf7f3' : '#fff',
        color: selected ? '#fff' : aiDetected ? '#c45a3b' : '#555',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {aiDetected && !selected && (
        <span style={{ fontSize: '10px', opacity: 0.7 }}>✦</span>
      )}
      {label}
    </button>
  );
};

// ── How Stories Become Evidence ─────────────────────────────────────────────

const EvidenceSection: React.FC = () => {
  const t = useTranslations('stories');
  const steps = [
    { step: '01', titleKey: 'evidenceStep01Title', bodyKey: 'evidenceStep01Body' },
    { step: '02', titleKey: 'evidenceStep02Title', bodyKey: 'evidenceStep02Body' },
    { step: '03', titleKey: 'evidenceStep03Title', bodyKey: 'evidenceStep03Body' },
    { step: '04', titleKey: 'evidenceStep04Title', bodyKey: 'evidenceStep04Body' },
  ] as const;

  return (
    <section style={{ background: '#1a1a1a', padding: '64px 48px', marginTop: '0' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#c45a3b',
          marginBottom: '20px'
        }}>
          {t('evidenceTitle')}
        </div>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: '300',
          color: '#fff',
          lineHeight: '1.3',
          marginBottom: '40px',
          letterSpacing: '-0.5px'
        }}>
          {t('evidenceSubtitle')}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {steps.map(({ step, titleKey, bodyKey }) => (
            <div key={step} style={{ borderTop: '2px solid #333', paddingTop: '20px' }}>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '2px',
                color: '#c45a3b',
                marginBottom: '10px'
              }}>
                {step}
              </div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '17px',
                fontWeight: '400',
                color: '#fff',
                marginBottom: '8px'
              }}>
                {t(titleKey)}
              </div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888',
                lineHeight: '1.6',
                margin: 0
              }}>
                {t(bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

export const ShareStoryPage: React.FC<ShareStoryPageProps> = ({ selectedZip }) => {
  const t = useTranslations('stories');
  const [zipInput, setZipInput] = useState(selectedZip || '');
  const [role, setRole] = useState<'patient' | 'caregiver' | 'family member' | 'community member'>('patient');
  const [condition, setCondition] = useState('APOL1-mediated kidney disease');
  const [storyText, setStoryText] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [aiThemes, setAiThemes] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedZip) setZipInput(selectedZip);
  }, [selectedZip]);

  // AI theme detection — debounced
  const detectThemes = useCallback(async (text: string) => {
    if (text.trim().length < 80) {
      setAiThemes([]);
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/stories/detect-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_text: text }),
      });
      if (res.ok) {
        const data = await res.json() as { themes: string[] };
        setAiThemes(data.themes || []);
      }
    } catch {
      // silent — AI detection is enhancement, not required
    } finally {
      setAiLoading(false);
    }
  }, []);

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setStoryText(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      detectThemes(text);
    }, 400);
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  // All themes to show: union of known + AI-detected
  const allThemes = [
    ...KNOWN_THEMES,
    ...aiThemes.filter(t => !KNOWN_THEMES.includes(t)),
  ];

  const handleSubmit = async () => {
    if (!consent) {
      setSubmitError(t('submitErrorConsent'));
      setSubmitStatus('error');
      return;
    }
    if (!zipInput.trim()) {
      setSubmitError(t('submitErrorZip'));
      setSubmitStatus('error');
      return;
    }
    if (storyText.trim().length < 20) {
      setSubmitError(t('submitErrorLength'));
      setSubmitStatus('error');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip_code: zipInput.trim(),
          role,
          condition,
          story_text: storyText.trim(),
          themes: selectedThemes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error((data as { error?: string }).error || 'Submission failed. Please try again.');
      }

      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#faf7f3' }}>
        <section style={{ padding: '120px 48px', textAlign: 'center' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f0faf4',
              border: '2px solid #a8d5b5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '28px'
            }}>
              ✓
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: '300',
              color: '#1a1a1a',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              {t('submitSuccess')}
            </h1>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.7',
              marginBottom: '40px'
            }}>
              {t('submitSuccessBody', { zip: zipInput })}
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              style={{
                padding: '14px 32px',
                background: 'none',
                border: '2px solid #1a1a1a',
                borderRadius: '4px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: '#1a1a1a'
              }}
            >
              {t('submitAnother')}
            </button>
          </div>
        </section>
        <EvidenceSection />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', background: '#faf7f3', minHeight: '100vh' }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <section style={{
        background: '#1a1a1a',
        padding: '80px 48px 72px',
        borderBottom: '3px solid #c45a3b'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#c45a3b',
            marginBottom: '20px'
          }}>
            Share Your Story
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: '300',
            color: '#fff',
            lineHeight: '1.1',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Your story is<br />
            <span style={{ color: '#c45a3b' }}>evidence.</span>
          </h1>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#888',
            lineHeight: '1.7',
            maxWidth: '580px',
            margin: 0
          }}>
            Where you live shapes your health. Help us map the connection
            between place and kidney disease — one story at a time.
          </p>
        </div>
      </section>

      {/* ── Form ────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 48px 80px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* About You */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c45a3b',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e8e4df'
            }}>
              About You
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <Label>{t('zipCode')}</Label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t('zipPlaceholder')}
                  value={zipInput}
                  onChange={e => setZipInput(e.target.value)}
                  style={inputBase}
                />
              </div>
              <div>
                <Label>{t('iAmA')}</Label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as typeof role)}
                  style={inputBase}
                >
                  <option value="patient">{t('patient')}</option>
                  <option value="caregiver">{t('caregiver')}</option>
                  <option value="family member">Family Member</option>
                  <option value="community member">Community Member</option>
                </select>
              </div>
              <div>
                <Label>{t('condition')}</Label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  style={inputBase}
                >
                  <option value="APOL1-mediated kidney disease">APOL1-mediated kidney disease</option>
                  <option value="FSGS">FSGS</option>
                  <option value="CKD">CKD</option>
                  <option value="Other / unsure">Other / unsure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Your Story */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c45a3b',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e8e4df'
            }}>
              Your Story
            </div>

            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              fontStyle: 'italic',
              color: '#888',
              lineHeight: '1.7',
              marginBottom: '20px'
            }}>
              Write as much or as little as you like. Tell us about your experience —
              getting diagnosed, finding a doctor, the barriers you faced,
              what life looks like day to day. There is no wrong way to tell it.
            </p>

            <textarea
              ref={textareaRef}
              placeholder="Start writing here. You might describe: how far you travel for care, what it took to get a diagnosis, how costs have shaped your decisions, what your doctors did or didn't understand about your life..."
              value={storyText}
              onChange={handleStoryChange}
              style={{
                ...inputBase,
                minHeight: '360px',
                resize: 'vertical',
                lineHeight: '1.8',
                fontSize: '17px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'Georgia, serif',
              }}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: '#bbb',
                margin: 0
              }}>
                Your name will never appear on the platform. Only your ZIP code is linked to your story.
              </p>
              <span style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: storyText.length > 0 ? '#aaa' : '#ddd'
              }}>
                {storyText.length} characters
              </span>
            </div>
          </div>

          {/* Themes */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c45a3b',
              marginBottom: '8px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e8e4df'
            }}>
              Themes
            </div>

            {/* AI detection status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              minHeight: '24px'
            }}>
              {aiLoading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #c45a3b',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#aaa'
                  }}>
                    Reading your story for themes…
                  </span>
                </>
              ) : aiThemes.length > 0 ? (
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#c45a3b'
                }}>
                  ✦ AI detected {aiThemes.length} theme{aiThemes.length !== 1 ? 's' : ''} — dashed pills are suggested
                </span>
              ) : storyText.length >= 80 ? (
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#bbb'
                }}>
                  Select any themes that apply to your story
                </span>
              ) : (
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#bbb'
                }}>
                  Keep writing — AI theme detection activates after ~80 characters
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allThemes.map((theme) => (
                <ThemePill
                  key={theme}
                  label={theme}
                  selected={selectedThemes.includes(theme)}
                  aiDetected={aiThemes.includes(theme)}
                  onClick={() => toggleTheme(theme)}
                />
              ))}
            </div>

            {selectedThemes.length > 0 && (
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: '#888',
                marginTop: '12px'
              }}>
                {selectedThemes.length} theme{selectedThemes.length !== 1 ? 's' : ''} selected:{' '}
                {selectedThemes.join(', ')}
              </p>
            )}
          </div>

          {/* Consent */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            marginBottom: '32px',
            padding: '24px',
            background: '#fff',
            borderRadius: '4px',
            border: '1px solid #e8e4df'
          }}>
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#c45a3b', flexShrink: 0, width: '16px', height: '16px' }}
            />
            <label htmlFor="consent" style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: '#444',
              lineHeight: '1.65',
              cursor: 'pointer'
            }}>
              {t('consent')}
            </label>
          </div>

          {/* Error */}
          {submitStatus === 'error' && (
            <div style={{
              marginBottom: '20px',
              padding: '14px 18px',
              background: '#fff5f5',
              border: '1px solid #f5c6c6',
              borderRadius: '4px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: '#c0392b'
            }}>
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '18px 32px',
              background: submitting ? '#aaa' : '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {submitting ? '…' : t('submit')}
          </button>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            color: '#bbb',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Stories are reviewed before appearing on the platform.
          </p>
        </div>
      </section>

      {/* ── How Stories Become Evidence ──────────────────────────────── */}
      <EvidenceSection />

      {/* CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
