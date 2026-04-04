'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface KidneyDiseasePageProps {
  onNavigate?: (page: string) => void;
}

// ── Shared typography helpers ─────────────────────────────────────────────────
const ChapterLabel: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: light ? 'rgba(255,255,255,0.5)' : '#c45a3b',
    marginBottom: '20px'
  }}>
    {children}
  </div>
);

const Rule: React.FC<{ light?: boolean }> = ({ light }) => (
  <div style={{
    width: '48px',
    height: '1px',
    background: light ? 'rgba(255,255,255,0.25)' : '#c45a3b',
    margin: '24px 0'
  }} />
);

// ── ESKD cause bar component ──────────────────────────────────────────────────
const CauseBar: React.FC<{ label: string; pct: number; accent?: boolean }> = ({ label, pct, accent }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: accent ? '#fff' : 'rgba(255,255,255,0.7)',
      marginBottom: '8px',
      fontWeight: accent ? '600' : '400'
    }}>
      <span>{label}</span>
      <span style={{ color: accent ? '#c45a3b' : 'rgba(255,255,255,0.5)' }}>{pct}%</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: accent ? '#c45a3b' : 'rgba(196,90,59,0.45)',
        borderRadius: '3px',
        transition: 'width 0.6s ease'
      }} />
    </div>
  </div>
);

export const KidneyDiseasePage: React.FC<KidneyDiseasePageProps> = ({ onNavigate }) => {
  const t = useTranslations('kidney');

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '100px 32px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background texture accent */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '40%',
          height: '100%',
          background: 'linear-gradient(135deg, transparent 60%, rgba(196,90,59,0.06) 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          <ChapterLabel light>Understanding Kidney Disease</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: '300',
            lineHeight: '1.05',
            letterSpacing: '-2px',
            margin: '0 0 32px',
            color: '#fff'
          }}>
            37 million<br />
            <span style={{ color: '#c45a3b' }}>people.</span>
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '560px',
            margin: 0
          }}>
            That is how many Americans are living with chronic kidney disease right now.
            Most do not know it. Many will not find out until it is too late to change course.
          </p>
        </div>
      </section>

      {/* ── BY THE NUMBERS ───────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>By the Numbers · CDC, 2026</ChapterLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '300',
            color: '#1a1a1a',
            margin: '0 0 48px',
            lineHeight: '1.2'
          }}>
            The scale of the crisis.
          </h2>

          {/* Stat grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2px',
            marginBottom: '60px'
          }}>
            {[
              { stat: '37M', label: 'Americans living with CKD', source: '14% of all US adults' },
              { stat: '87%', label: 'don\'t know they have it', source: 'CKD is largely symptom-free until late stages' },
              { stat: '131K', label: 'new ESKD cases in 2023', source: '131,564 people started treatment that year' },
              { stat: '831K', label: 'living with kidney failure', source: '67% on dialysis · 33% transplant' },
            ].map(({ stat, label, source }) => (
              <div key={stat} style={{
                background: '#faf7f3',
                padding: '32px 28px',
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(36px, 5vw, 52px)',
                  fontWeight: '300',
                  color: '#c45a3b',
                  lineHeight: 1,
                  marginBottom: '10px'
                }}>
                  {stat}
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '6px',
                  lineHeight: '1.3'
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#888',
                  lineHeight: '1.4'
                }}>
                  {source}
                </div>
              </div>
            ))}
          </div>

          <Rule />
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#555',
            maxWidth: '680px'
          }}>
            Chronic Kidney Disease is a condition in which the kidneys lose their ability to filter
            waste and excess fluid from the blood. It progresses through five stages, defined by how
            much filtering capacity remains. By the time most people notice symptoms, significant
            damage has already occurred.
          </p>
        </div>
      </section>

      {/* ── RACIAL DISPARITY ─────────────────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel light>Who Bears the Burden</ChapterLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '300',
            color: '#fff',
            margin: '0 0 16px',
            lineHeight: '1.2'
          }}>
            This disease does not strike equally.
          </h2>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '600px',
            marginBottom: '56px'
          }}>
            Geography, race, and income shape who gets sick, who gets tested, and who survives.
            The numbers below are not biology — they are the result of structural inequity.
          </p>

          {/* CKD Prevalence by race */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2px',
            marginBottom: '56px'
          }}>
            {[
              { group: 'Non-Hispanic Black', pct: '22%', note: 'CKD prevalence', highlight: true },
              { group: 'Non-Hispanic White', pct: '13%', note: 'CKD prevalence', highlight: false },
              { group: 'Hispanic', pct: '12%', note: 'CKD prevalence', highlight: false },
              { group: 'Adults 65+', pct: '34%', note: 'CKD prevalence', highlight: false },
            ].map(({ group, pct, note, highlight }) => (
              <div key={group} style={{
                background: highlight ? 'rgba(196,90,59,0.12)' : 'rgba(255,255,255,0.04)',
                borderTop: highlight ? '2px solid #c45a3b' : '2px solid rgba(255,255,255,0.08)',
                padding: '28px 24px'
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '40px',
                  fontWeight: '300',
                  color: highlight ? '#c45a3b' : 'rgba(255,255,255,0.8)',
                  lineHeight: 1,
                  marginBottom: '10px'
                }}>
                  {pct}
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '4px'
                }}>
                  {group}
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)'
                }}>
                  {note}
                </div>
              </div>
            ))}
          </div>

          {/* ESKD disparity callout */}
          <div style={{
            borderLeft: '3px solid #c45a3b',
            paddingLeft: '32px',
            maxWidth: '640px'
          }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: '300',
              color: '#fff',
              lineHeight: '1.5',
              margin: '0 0 16px'
            }}>
              Non-Hispanic Black adults develop kidney failure at <strong style={{ color: '#c45a3b', fontWeight: '400' }}>4 times the rate</strong> of
              non-Hispanic White adults.
            </p>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              margin: 0
            }}>
              Hispanic adults develop ESKD at twice the rate of non-Hispanic White adults. · Source: CDC, March 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── ESKD CAUSES ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#111', padding: '80px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel light>What Drives Kidney Failure</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            <div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: '300',
                color: '#fff',
                margin: '0 0 16px',
                lineHeight: '1.25'
              }}>
                End-stage kidney disease<br />
                <span style={{ color: '#c45a3b' }}>by cause.</span>
              </h2>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                lineHeight: '1.7',
                color: 'rgba(255,255,255,0.45)',
                margin: '0 0 8px'
              }}>
                Among the 131,564 people who began ESKD treatment in 2023,
                the leading causes were conditions deeply tied to social determinants of health.
              </p>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)'
              }}>
                Source: USRDS via CDC, 2026
              </p>
            </div>
            <div style={{ paddingTop: '4px' }}>
              <CauseBar label="Diabetes" pct={37} accent />
              <CauseBar label="High Blood Pressure" pct={27} accent />
              <CauseBar label="Glomerulonephritis" pct={14} />
              <CauseBar label="Cystic Kidney Disease" pct={5} />
              <CauseBar label="Other / Unknown" pct={17} />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CKD ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('whatIsTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
              <p style={{ marginBottom: '20px' }}>{t('whatIsPara1')}</p>
              <p style={{ marginBottom: '24px' }}>{t('whatIsPara2')}</p>
              <ul style={{ marginLeft: '20px', marginBottom: '24px', color: '#555' }}>
                <li style={{ marginBottom: '12px' }}>{t('whatIsItem1')}</li>
                <li style={{ marginBottom: '12px' }}>{t('whatIsItem2')}</li>
                <li style={{ marginBottom: '12px' }}>{t('whatIsItem3')}</li>
                <li>{t('whatIsItem4')}</li>
              </ul>
              <p style={{ marginBottom: '20px' }}>{t('whatIsPara3')}</p>
            </div>
            <div style={{ background: '#faf7f3', padding: '24px 28px', borderLeft: '4px solid #c45a3b' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.7', color: '#1a1a1a', margin: 0 }}>
                <strong>{t('whatIsImportant')}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW DOCTORS FIND IT ──────────────────────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('howFoundTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
              <p style={{ marginBottom: '20px' }}>{t('howFoundPara1')}</p>
              <ul style={{ marginLeft: '20px', marginBottom: '24px', color: '#555' }}>
                <li style={{ marginBottom: '12px' }}>{t('howFoundItem1')}</li>
                <li style={{ marginBottom: '12px' }}>{t('howFoundItem2')}</li>
                <li>{t('howFoundItem3')}</li>
              </ul>
              <p style={{ marginBottom: '20px' }}>{t('howFoundPara2')}</p>
              <ul style={{ marginLeft: '20px', color: '#555' }}>
                <li style={{ marginBottom: '12px' }}>{t('howFoundItem4')}</li>
                <li>{t('howFoundItem5')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE FIVE STAGES ──────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('stagesTitle')}</ChapterLabel>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#555',
            maxWidth: '680px',
            marginBottom: '40px'
          }}>
            {t('stagesPara1')}
          </p>
          <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fff',
                    background: '#1a1a1a',
                    borderRight: '1px solid #333'
                  }}>{t('stageCol1')}</th>
                  <th style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fff',
                    background: '#1a1a1a',
                    borderRight: '1px solid #333'
                  }}>{t('stageCol2')}</th>
                  <th style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fff',
                    background: '#1a1a1a'
                  }}>{t('stageCol3')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['stage1', 'stage1Egfr', 'stage1Func'],
                  ['stage2', 'stage2Egfr', 'stage2Func'],
                  ['stage3a', 'stage3aEgfr', 'stage3aFunc'],
                  ['stage3b', 'stage3bEgfr', 'stage3bFunc'],
                  ['stage4', 'stage4Egfr', 'stage4Func'],
                  ['stage5', 'stage5Egfr', 'stage5Func'],
                ].map(([stageKey, egfrKey, funcKey], i) => (
                  <tr key={stageKey} style={{
                    background: i % 2 === 0 ? '#fff' : '#faf7f3',
                    borderBottom: '1px solid #e8e4df'
                  }}>
                    <td style={{
                      padding: '16px 20px',
                      borderRight: '1px solid #e8e4df',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      {t(stageKey as Parameters<typeof t>[0])}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      borderRight: '1px solid #e8e4df',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#c45a3b',
                      fontWeight: '500'
                    }}>
                      {t(egfrKey as Parameters<typeof t>[0])}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#555'
                    }}>
                      {t(funcKey as Parameters<typeof t>[0])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', maxWidth: '680px' }}>
            {t('stagesPara2')}
          </p>
        </div>
      </section>

      {/* ── SYMPTOMS ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('symptomsTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
              <p style={{ marginBottom: '20px' }}>{t('symptomsPara1')}</p>
              <p style={{ marginBottom: '20px', color: '#555' }}><strong style={{ color: '#1a1a1a' }}>{t('symptomsWhy')}</strong></p>
              <p style={{ marginBottom: '20px', color: '#555' }}><strong style={{ color: '#1a1a1a' }}>{t('symptomsWhen')}</strong></p>
              <p style={{ marginBottom: '20px', color: '#555' }}><strong style={{ color: '#1a1a1a' }}>{t('symptomsAdvanced')}</strong></p>
              <ul style={{ marginLeft: '20px', color: '#555' }}>
                {(['symptomItem1','symptomItem2','symptomItem3','symptomItem4','symptomItem5','symptomItem6','symptomItem7'] as const).map((key, i, arr) => (
                  <li key={key} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>{t(key)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TREATMENT ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('treatmentTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
              <p style={{ marginBottom: '20px' }}>{t('treatmentPara1')}</p>
              <p style={{ marginBottom: '24px' }}>{t('treatmentPara2')}</p>
              <ul style={{ marginLeft: '20px', marginBottom: '32px', color: '#555' }}>
                {(['treatItem1','treatItem2','treatItem3','treatItem4','treatItem5'] as const).map((key, i, arr) => (
                  <li key={key} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>{t(key)}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#faf7f3', padding: '28px 32px', borderLeft: '4px solid #1a1a1a' }}>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '12px'
              }}>
                {t('eskdTitle')}
              </div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#1a1a1a',
                margin: 0
              }}>
                {t('eskdDesc')}
              </p>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888',
                marginTop: '12px',
                marginBottom: 0
              }}>
                As of 2023, 831,000 Americans are living with ESKD — 67% on dialysis, 33% with a transplant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHEN TO SEE A DOCTOR ─────────────────────────────────────────────── */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('whenSeeTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
              <p style={{ marginBottom: '20px' }}>{t('whenSeePara1')}</p>
              <ul style={{ marginLeft: '20px', marginBottom: '24px', color: '#555' }}>
                {(['riskItem1','riskItem2','riskItem3','riskItem4','riskItem5'] as const).map((key, i, arr) => (
                  <li key={key} style={{ marginBottom: i < arr.length - 1 ? '12px' : 0 }}>{t(key)}</li>
                ))}
              </ul>
              <p style={{ marginBottom: '20px' }}><strong style={{ color: '#1a1a1a' }}>{t('monitoringNote')}</strong></p>
              <ul style={{ marginLeft: '20px', marginBottom: '24px', color: '#555' }}>
                <li style={{ marginBottom: '12px' }}>{t('monitorItem1')}</li>
                <li>{t('monitorItem2')}</li>
              </ul>
              <p>{t('whenSeePara2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPES ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ChapterLabel>{t('typesTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#555', marginBottom: '40px' }}>
              {t('typesPara1')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { titleKey: 'apol1TypeTitle' as const, descKey: 'apol1TypeDesc' as const, ctaKey: 'learnApol1' as const, page: 'apol1' },
                { titleKey: 'fsgsTypeTitle' as const, descKey: 'fsgsTypeDesc' as const, ctaKey: 'learnFsgs' as const, page: 'fsgs' },
              ].map(({ titleKey, descKey, ctaKey, page }) => (
                <div key={page} style={{
                  background: '#faf7f3',
                  padding: '32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '32px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '20px',
                      fontWeight: '400',
                      color: '#1a1a1a',
                      marginBottom: '10px'
                    }}>
                      {t(titleKey)}
                    </div>
                    <p style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#555',
                      margin: 0
                    }}>
                      {t(descKey)}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate(page)}
                    style={{
                      background: 'none',
                      color: '#c45a3b',
                      border: '1px solid #c45a3b',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#c45a3b';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#c45a3b';
                    }}
                  >
                    {t(ctaKey)} →
                  </button>
                </div>
              ))}
              <div style={{ background: '#faf7f3', padding: '32px' }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '20px',
                  fontWeight: '400',
                  color: '#1a1a1a',
                  marginBottom: '10px'
                }}>
                  {t('otherTypesTitle')}
                </div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#555',
                  margin: 0
                }}>
                  {t('otherTypesDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: '100px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px' }}>
            <ChapterLabel light>The Bottom Line</ChapterLabel>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: '300',
              color: '#fff',
              lineHeight: '1.2',
              margin: '0 0 32px'
            }}>
              {t('bottomLineTitle')}
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '17px',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '40px'
            }}>
              {t('bottomLineDesc')}
            </p>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#c45a3b',
              lineHeight: '1.6',
              marginBottom: '48px',
              borderLeft: '3px solid #c45a3b',
              paddingLeft: '24px'
            }}>
              In the Bronx, where kidney disease rates are among the highest in the country,
              knowing your numbers is not just health advice. It is survival.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate && onNavigate('map')}
                style={{
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 32px',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a84830'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c45a3b'; }}
              >
                Explore the Map →
              </button>
              <button
                onClick={() => onNavigate && onNavigate('stories')}
                style={{
                  background: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '14px 32px',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                Read Community Stories
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
