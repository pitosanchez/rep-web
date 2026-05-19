'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface KidneyDiseasePageProps {
  onNavigate?: (page: string) => void;
}

// ── SVG donut chart ───────────────────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface DonutSlice { label: string; value: number; color: string; }

const DonutChart: React.FC<{
  data: DonutSlice[];
  size?: number;
  innerR?: number;
  label?: string;
  sublabel?: string;
}> = ({ data, size = 220, innerR = 72, label, sublabel }) => {
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 6;
  const total = data.reduce((s, d) => s + d.value, 0);
  const GAP = 2.5;
  let current = -90;

  const segments = data.map(d => {
    const sweep = (d.value / total) * 360 - GAP;
    const start = current + GAP / 2;
    const end = start + sweep;
    current += (d.value / total) * 360;
    const large = sweep > 180 ? 1 : 0;
    const s1 = polar(cx, cy, outerR, start);
    const e1 = polar(cx, cy, outerR, end);
    const s2 = polar(cx, cy, innerR, end);
    const e2 = polar(cx, cy, innerR, start);
    const pathD = [
      `M ${s1.x.toFixed(1)} ${s1.y.toFixed(1)}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x.toFixed(1)} ${e1.y.toFixed(1)}`,
      `L ${s2.x.toFixed(1)} ${s2.y.toFixed(1)}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x.toFixed(1)} ${e2.y.toFixed(1)}`,
      'Z'
    ].join(' ');
    return { ...d, pathD };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map(seg => (
        <path key={seg.label} d={seg.pathD} fill={seg.color} />
      ))}
      {label && (
        <>
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#1a1a1a"
            style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '300' }}>
            {label}
          </text>
          {sublabel && (
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#999"
              style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', letterSpacing: '1px' }}>
              {sublabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

// ── Legend item (light background) ───────────────────────────────────────────
const LegendItem: React.FC<{ color: string; label: string; pct: number }> = ({ color, label, pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0 }} />
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#555', flex: 1 }}>
      {label}
    </span>
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>
      {pct}%
    </span>
  </div>
);

// ── Horizontal race bar (light background) ────────────────────────────────────
const RaceBar: React.FC<{ label: string; pct: number; max: number; color: string; note?: string }> = ({ label, pct, max, color, note }) => (
  <div style={{ marginBottom: '28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#666' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '300', color }}>
        {pct}%
      </span>
    </div>
    <div style={{ height: '8px', background: 'rgba(0,0,0,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(pct / max) * 100}%`, background: color, borderRadius: '4px' }} />
    </div>
    {note && (
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#aaa', marginTop: '5px' }}>
        {note}
      </div>
    )}
  </div>
);

// ── Typography helpers ────────────────────────────────────────────────────────
const ChapterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600',
    letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '20px'
  }}>
    {children}
  </div>
);

const SourceCredit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#bbb',
    marginTop: '24px', letterSpacing: '0.3px'
  }}>
    {children}
  </div>
);

// ── Data constants ────────────────────────────────────────────────────────────
const ESKD_CAUSES: DonutSlice[] = [
  { label: 'Diabetes',            value: 37, color: '#c45a3b' },
  { label: 'High Blood Pressure', value: 27, color: '#e8926a' },
  { label: 'Glomerulonephritis',  value: 14, color: '#6b8cba' },
  { label: 'Cystic Kidney Dis.',  value: 5,  color: '#a0745a' },
  { label: 'Other',               value: 10, color: '#b0a89e' },
  { label: 'Unknown',             value: 7,  color: '#d0c8c0' },
];

const ESKD_TREATMENT: DonutSlice[] = [
  { label: 'Dialysis',   value: 67, color: '#c45a3b' },
  { label: 'Transplant', value: 33, color: '#6b8cba' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export const KidneyDiseasePage: React.FC<KidneyDiseasePageProps> = ({ onNavigate }) => {
  const t = useTranslations('kidney');

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — warm cream, bold statement
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '100px 32px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Understanding Kidney Disease</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 9vw, 96px)',
            fontWeight: '300', lineHeight: '0.95', letterSpacing: '-3px',
            margin: '0 0 40px', color: '#1a1a1a'
          }}>
            37 million<br />
            <span style={{ color: '#c45a3b' }}>Americans.</span>
          </h1>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {[
              { stat: '87%', label: "don't know they have it" },
              { stat: '14%', label: 'of all US adults' },
              { stat: '131K', label: 'new kidney failure cases, 2023' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#1a1a1a', lineHeight: 1 }}>{stat}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', marginTop: '6px' }}>{label}</div>
              </div>
            ))}
          </div>
          <SourceCredit>Source: CDC Chronic Kidney Disease Fact Sheet, March 2026</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RACIAL DISPARITIES — white, horizontal bar chart
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>CKD Prevalence by Race &amp; Ethnicity</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

            {/* Left: heading + 4× callout */}
            <div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300',
                color: '#1a1a1a', lineHeight: '1.15', margin: '0 0 24px'
              }}>
                This disease does not<br />
                <span style={{ color: '#c45a3b' }}>strike equally.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#666', margin: '0 0 40px' }}>
                These are not random numbers. They reflect decades of unequal access
                to care, housing, food, and economic stability — not genetic destiny.
              </p>

              {/* 4× ESKD rate callout */}
              <div style={{ background: 'rgba(196,90,59,0.06)', border: '2px solid #c45a3b', padding: '28px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '300', color: '#c45a3b', lineHeight: 1, marginBottom: '10px' }}>
                  4×
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#1a1a1a', fontWeight: '600', marginBottom: '8px' }}>
                  higher rate of kidney failure
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
                  Non-Hispanic Black adults develop end-stage kidney disease at 4× the rate
                  of non-Hispanic White adults. Hispanic adults develop ESKD at 2× the rate.
                </div>
              </div>
              <SourceCredit>Source: CDC, March 2026 · USRDS Annual Data Report 2023</SourceCredit>
            </div>

            {/* Right: bar chart */}
            <div style={{ paddingTop: '8px' }}>
              <RaceBar label="Non-Hispanic Black" pct={22} max={36} color="#c45a3b" note="Highest prevalence of any racial/ethnic group" />
              <RaceBar label="Adults 65 and older"  pct={34} max={36} color="#e8926a" note="Age is a major independent risk factor" />
              <RaceBar label="Non-Hispanic White"   pct={13} max={36} color="#8a8a8a" />
              <RaceBar label="Hispanic"             pct={12} max={36} color="#b8b0a8" />
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#bbb', letterSpacing: '0.3px', lineHeight: '1.6' }}>
                  CKD prevalence among U.S. adults by race/ethnicity and age group.<br />
                  Bar length proportional to prevalence rate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ESKD — two donut charts on cream
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>End-Stage Kidney Disease · 2023</ChapterLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 38px)',
            fontWeight: '300', color: '#1a1a1a', margin: '0 0 48px', lineHeight: '1.2'
          }}>
            831,000 Americans are living with{' '}
            <span style={{ color: '#c45a3b' }}>kidney failure.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

            {/* Chart 1: Causes */}
            <div style={{ background: '#fff', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '28px' }}>
                What causes kidney failure
              </div>
              <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <DonutChart data={ESKD_CAUSES} size={200} innerR={68} label="100%" sublabel="OF CASES" />
                </div>
                <div style={{ flex: 1 }}>
                  {ESKD_CAUSES.map(d => <LegendItem key={d.label} color={d.color} label={d.label} pct={d.value} />)}
                </div>
              </div>
              <SourceCredit>Among 131,564 new ESKD cases in 2023 · USRDS / CDC 2026</SourceCredit>
            </div>

            {/* Chart 2: Treatment split */}
            <div style={{ background: '#fff', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '28px' }}>
                How patients are treated
              </div>
              <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <DonutChart data={ESKD_TREATMENT} size={200} innerR={68} label="831K" sublabel="LIVING WITH ESKD" />
                </div>
                <div style={{ flex: 1 }}>
                  {ESKD_TREATMENT.map(d => (
                    <div key={d.label} style={{ marginBottom: '24px' }}>
                      <LegendItem color={d.color} label={d.label} pct={d.value} />
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#aaa', marginTop: '2px', marginLeft: '20px', lineHeight: '1.5' }}>
                        {d.label === 'Dialysis'
                          ? '≈ 557,000 people · sessions 3× / week'
                          : '≈ 274,000 people · transplant recipients'}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0ece7' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '300', color: '#c45a3b', lineHeight: 1 }}>67%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', marginTop: '4px' }}>depend on dialysis to survive</div>
                  </div>
                </div>
              </div>
              <SourceCredit>Total prevalent ESKD population 2023 · USRDS / CDC 2026</SourceCredit>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT IS CKD — white
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('whatIsTitle')}</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('whatIsPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('whatIsPara2')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444' }}>{t('whatIsPara3')}</p>
            </div>
            <div>
              <div style={{ background: '#c45a3b', padding: '16px 24px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                  Common risk factors
                </div>
              </div>
              {[t('whatIsItem1'), t('whatIsItem2'), t('whatIsItem3'), t('whatIsItem4')].map((item, i) => (
                <div key={i} style={{ padding: '16px 24px', borderBottom: i < 3 ? '1px solid #f0ece7' : 'none', background: '#faf7f3', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0, marginTop: '8px' }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.6', color: '#333' }}>{item}</span>
                </div>
              ))}
              <div style={{ background: 'rgba(196,90,59,0.06)', border: '1px solid rgba(196,90,59,0.2)', padding: '20px 24px', marginTop: '2px' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#333', margin: 0 }}>
                  <strong style={{ color: '#1a1a1a' }}>{t('whatIsImportant')}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FIVE STAGES — cream, visual bar chart
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('stagesTitle')}</ChapterLabel>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#666', maxWidth: '600px', marginBottom: '40px' }}>
            {t('stagesPara1')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', marginBottom: '32px' }}>
            {[
              { stage: '1',  egfr: '90+',   pct: 100, label: 'Normal or high',     color: '#4a8a4a' },
              { stage: '2',  egfr: '60–89',  pct: 75,  label: 'Mildly decreased',   color: '#8ab04a' },
              { stage: '3a', egfr: '45–59',  pct: 55,  label: 'Mild–moderate',      color: '#d4a020' },
              { stage: '3b', egfr: '30–44',  pct: 40,  label: 'Moderate–severe',    color: '#d97020' },
              { stage: '4',  egfr: '15–29',  pct: 24,  label: 'Severely decreased', color: '#c45a3b' },
              { stage: '5',  egfr: '<15',    pct: 10,  label: 'Kidney failure',      color: '#8b1a1a' },
            ].map(({ stage, egfr, pct, label, color }) => (
              <div key={stage} style={{ background: '#fff', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>
                  Stage {stage}
                </div>
                <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: `${pct}%`, background: color, borderRadius: '2px 2px 0 0', minHeight: '8px' }} />
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' }}>
                  eGFR {egfr}
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#888', lineHeight: '1.3' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#aaa', lineHeight: '1.7', maxWidth: '600px' }}>
            {t('stagesPara2')}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW DOCTORS FIND IT + SYMPTOMS — white, two-column
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>

            <div>
              <ChapterLabel>{t('howFoundTitle')}</ChapterLabel>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#444', marginBottom: '24px' }}>{t('howFoundPara1')}</p>
              {[t('howFoundItem1'), t('howFoundItem2'), t('howFoundItem3')].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#c45a3b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#333', paddingTop: '4px' }}>{item}</span>
                </div>
              ))}
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginTop: '20px', marginBottom: '12px' }}>{t('howFoundPara2')}</p>
              {[t('howFoundItem4'), t('howFoundItem5')].map((item, i) => (
                <div key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#555', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#c45a3b', fontWeight: '700' }}>—</span>
                  {item}
                </div>
              ))}
            </div>

            <div>
              <ChapterLabel>{t('symptomsTitle')}</ChapterLabel>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#444', marginBottom: '8px' }}>{t('symptomsPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#aaa', marginBottom: '24px', fontStyle: 'italic' }}>
                {t('symptomsWhy')}
              </p>
              <div style={{ background: '#faf7f3', padding: '4px 0' }}>
                {(['symptomItem1','symptomItem2','symptomItem3','symptomItem4','symptomItem5','symptomItem6','symptomItem7'] as const).map((key, i) => (
                  <div key={key} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '13px 20px', borderBottom: i < 6 ? '1px solid #ece8e3' : 'none' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TREATMENT — cream
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('treatmentTitle')}</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('treatmentPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '28px' }}>{t('treatmentPara2')}</p>
              {(['treatItem1','treatItem2','treatItem3','treatItem4','treatItem5'] as const).map((key) => (
                <div key={key} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0, marginTop: '10px' }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#444' }}>{t(key)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: '#fff', padding: '32px', borderTop: '3px solid #c45a3b' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '16px' }}>
                  {t('eskdTitle')}
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', margin: '0 0 28px' }}>
                  {t('eskdDesc')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                  <div style={{ background: 'rgba(196,90,59,0.08)', padding: '20px', borderTop: '2px solid #c45a3b' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '300', color: '#c45a3b', lineHeight: 1 }}>67%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', marginTop: '6px' }}>on dialysis</div>
                  </div>
                  <div style={{ background: 'rgba(107,140,186,0.08)', padding: '20px', borderTop: '2px solid #6b8cba' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '300', color: '#6b8cba', lineHeight: 1 }}>33%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', marginTop: '6px' }}>transplant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHEN TO SEE A DOCTOR — white
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('whenSeeTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '32px' }}>{t('whenSeePara1')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '32px' }}>
              {(['riskItem1','riskItem2','riskItem3','riskItem4','riskItem5'] as const).map((key) => (
                <div key={key} style={{ background: '#faf7f3', padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0, marginTop: '8px' }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.6', color: '#333' }}>{t(key)}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#444' }}>{t('whenSeePara2')}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TYPES — cream, APOL1 + FSGS cards
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('typesTitle')}</ChapterLabel>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#555', maxWidth: '600px', marginBottom: '40px' }}>
            {t('typesPara1')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px' }}>
            {[
              { titleKey: 'apol1TypeTitle' as const, descKey: 'apol1TypeDesc' as const, ctaKey: 'learnApol1' as const, page: 'apol1', accent: '#c45a3b' },
              { titleKey: 'fsgsTypeTitle' as const, descKey: 'fsgsTypeDesc' as const, ctaKey: 'learnFsgs' as const, page: 'fsgs', accent: '#6b8cba' },
            ].map(({ titleKey, descKey, ctaKey, page, accent }) => (
              <div key={page} style={{ background: '#fff', padding: '32px', borderTop: `3px solid ${accent}` }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '19px', fontWeight: '400', color: '#1a1a1a', marginBottom: '12px', lineHeight: '1.3' }}>
                  {t(titleKey)}
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#666', margin: '0 0 24px' }}>
                  {t(descKey)}
                </p>
                <button
                  onClick={() => onNavigate && onNavigate(page)}
                  style={{
                    background: 'none', color: accent, border: `1px solid ${accent}`,
                    padding: '10px 18px', cursor: 'pointer',
                    fontFamily: 'system-ui, sans-serif', fontSize: '11px',
                    fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = accent; }}
                >
                  {t(ctaKey)} →
                </button>
              </div>
            ))}
            <div style={{ background: '#fff', padding: '32px', borderTop: '3px solid #a0745a' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '19px', fontWeight: '400', color: '#1a1a1a', marginBottom: '12px', lineHeight: '1.3' }}>
                {t('otherTypesTitle')}
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#666', margin: 0 }}>
                {t('otherTypesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING — white with terracotta accent border
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '48px 32px', borderTop: '4px solid #c45a3b' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ maxWidth: '520px' }}>
            <ChapterLabel>{t('bottomLineTitle')}</ChapterLabel>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '300',
              color: '#1a1a1a', lineHeight: '1.25', margin: '0 0 20px'
            }}>
              {t('bottomLineDesc')}
            </h2>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '14px', fontStyle: 'italic',
              color: '#c45a3b', lineHeight: '1.6', margin: '0 0 28px',
              borderLeft: '2px solid #c45a3b', paddingLeft: '16px'
            }}>
              In the Bronx, where kidney disease rates are among the highest in the country,
              knowing your numbers is not just health advice. It is survival.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate && onNavigate('map')}
                style={{
                  background: '#c45a3b', color: '#fff', border: 'none', padding: '14px 32px',
                  cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '12px',
                  fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
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
                  background: 'none', color: '#555',
                  border: '1px solid rgba(0,0,0,0.2)', padding: '14px 32px',
                  cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '12px',
                  fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.color = '#555'; }}
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
