'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface KidneyDiseasePageProps {
  onNavigate?: (page: string) => void;
}

// ── SVG donut chart helpers ───────────────────────────────────────────────────
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
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff"
            style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '300' }}>
            {label}
          </text>
          {sublabel && (
            <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)"
              style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', letterSpacing: '1px' }}>
              {sublabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

// ── Legend item ───────────────────────────────────────────────────────────────
const LegendItem: React.FC<{ color: string; label: string; pct: number }> = ({ color, label, pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0 }} />
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.7)', flex: 1 }}>
      {label}
    </span>
    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontWeight: '600', color: '#fff' }}>
      {pct}%
    </span>
  </div>
);

// ── Horizontal race bar ───────────────────────────────────────────────────────
const RaceBar: React.FC<{ label: string; pct: number; max: number; color: string; note?: string }> = ({ label, pct, max, color, note }) => (
  <div style={{ marginBottom: '28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '300', color }}>
        {pct}%
      </span>
    </div>
    <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(pct / max) * 100}%`, background: color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
    </div>
    {note && (
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>
        {note}
      </div>
    )}
  </div>
);

// ── Typography helpers ────────────────────────────────────────────────────────
const ChapterLabel: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600',
    letterSpacing: '3px', textTransform: 'uppercase',
    color: light ? 'rgba(255,255,255,0.4)' : '#c45a3b', marginBottom: '20px'
  }}>
    {children}
  </div>
);

const SourceCredit: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif', fontSize: '11px',
    color: light ? 'rgba(255,255,255,0.25)' : '#aaa',
    marginTop: '24px', letterSpacing: '0.3px'
  }}>
    {children}
  </div>
);

// ── Data constants ────────────────────────────────────────────────────────────
const ESKD_CAUSES: DonutSlice[] = [
  { label: 'Diabetes',             value: 37, color: '#c45a3b' },
  { label: 'High Blood Pressure',  value: 27, color: '#e8926a' },
  { label: 'Glomerulonephritis',   value: 14, color: '#6b8cba' },
  { label: 'Cystic Kidney Dis.',   value: 5,  color: '#a0745a' },
  { label: 'Other',                value: 10, color: '#7a7068' },
  { label: 'Unknown',              value: 7,  color: '#5a524e' },
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
          HERO — dark, full-bleed statement
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#111', color: '#fff', padding: '100px 32px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(196,90,59,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <ChapterLabel light>Understanding Kidney Disease</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 9vw, 96px)',
            fontWeight: '300', lineHeight: '0.95', letterSpacing: '-3px',
            margin: '0 0 40px', color: '#fff'
          }}>
            37 million<br />
            <span style={{ color: '#c45a3b' }}>Americans.</span>
          </h1>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#fff', lineHeight: 1 }}>87%</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>don't know they have it</div>
            </div>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#fff', lineHeight: 1 }}>14%</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>of all US adults</div>
            </div>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#fff', lineHeight: 1 }}>131K</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>new kidney failure cases, 2023</div>
            </div>
          </div>
          <SourceCredit light>Source: CDC Chronic Kidney Disease Fact Sheet, March 2026</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RACIAL DISPARITIES — dark, horizontal bar chart
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>CKD Prevalence by Race &amp; Ethnicity</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

            {/* Left: heading */}
            <div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300',
                color: '#fff', lineHeight: '1.15', margin: '0 0 24px'
              }}>
                This disease does not<br />
                <span style={{ color: '#c45a3b' }}>strike equally.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)', margin: '0 0 40px' }}>
                These are not random numbers. They reflect decades of unequal access
                to care, housing, food, and economic stability — not genetic destiny.
              </p>

              {/* 4× ESKD rate callout box */}
              <div style={{ background: 'rgba(196,90,59,0.1)', border: '1px solid rgba(196,90,59,0.3)', padding: '28px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '300', color: '#c45a3b', lineHeight: 1, marginBottom: '10px' }}>
                  4×
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#fff', fontWeight: '600', marginBottom: '6px' }}>
                  higher rate of kidney failure
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                  Non-Hispanic Black adults develop end-stage kidney disease at 4 times
                  the rate of non-Hispanic White adults.
                  Hispanic adults develop ESKD at 2 times the rate.
                </div>
              </div>
              <SourceCredit light>Source: CDC, March 2026 · USRDS Annual Data Report 2023</SourceCredit>
            </div>

            {/* Right: bar chart */}
            <div style={{ paddingTop: '8px' }}>
              <RaceBar label="Non-Hispanic Black" pct={22} max={36} color="#c45a3b" note="Highest prevalence of any racial/ethnic group" />
              <RaceBar label="Adults 65 and older" pct={34} max={36} color="#e8926a" note="Age is a major independent risk factor" />
              <RaceBar label="Non-Hispanic White" pct={13} max={36} color="rgba(255,255,255,0.5)" />
              <RaceBar label="Hispanic" pct={12} max={36} color="rgba(255,255,255,0.35)" />
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3px', lineHeight: '1.6' }}>
                  CKD prevalence among U.S. adults by race/ethnicity and age group.<br />
                  Bar length proportional to prevalence rate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ESKD — two donut charts side by side
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#111', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>End-Stage Kidney Disease · 2023</ChapterLabel>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 38px)',
            fontWeight: '300', color: '#fff', margin: '0 0 56px', lineHeight: '1.2'
          }}>
            831,000 Americans are living with<br />
            <span style={{ color: '#c45a3b' }}>kidney failure.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

            {/* Chart 1: Causes */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
                What causes kidney failure
              </div>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <DonutChart data={ESKD_CAUSES} size={200} innerR={68} label="100%" sublabel="OF CASES" />
                </div>
                <div style={{ flex: 1 }}>
                  {ESKD_CAUSES.map(d => <LegendItem key={d.label} color={d.color} label={d.label} pct={d.value} />)}
                </div>
              </div>
              <SourceCredit light>Among 131,564 new ESKD cases in 2023 · USRDS / CDC 2026</SourceCredit>
            </div>

            {/* Chart 2: Treatment split */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
                How patients are treated
              </div>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <DonutChart data={ESKD_TREATMENT} size={200} innerR={68} label="831K" sublabel="LIVING WITH ESKD" />
                </div>
                <div style={{ flex: 1 }}>
                  {ESKD_TREATMENT.map(d => (
                    <div key={d.label} style={{ marginBottom: '28px' }}>
                      <LegendItem color={d.color} label={d.label} pct={d.value} />
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px', marginLeft: '20px', lineHeight: '1.5' }}>
                        {d.label === 'Dialysis'
                          ? '≈ 557,000 people · requires sessions 3× / week'
                          : '≈ 274,000 people · kidney transplant recipients'}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '300', color: '#fff', lineHeight: 1 }}>67%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>depend on dialysis to survive</div>
                  </div>
                </div>
              </div>
              <SourceCredit light>Total prevalent ESKD population 2023 · USRDS / CDC 2026</SourceCredit>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT IS CKD — cream, medical intro
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('whatIsTitle')}</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('whatIsPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('whatIsPara2')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444' }}>{t('whatIsPara3')}</p>
            </div>
            <div>
              <div style={{ background: '#fff', padding: '0' }}>
                <div style={{ background: '#c45a3b', padding: '16px 24px' }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                    Common risk factors
                  </div>
                </div>
                {[t('whatIsItem1'), t('whatIsItem2'), t('whatIsItem3'), t('whatIsItem4')].map((item, i) => (
                  <div key={i} style={{ padding: '16px 24px', borderBottom: i < 3 ? '1px solid #f0ece7' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0, marginTop: '8px' }} />
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.6', color: '#333' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1a1a1a', padding: '20px 24px', marginTop: '2px' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                  <strong style={{ color: '#fff' }}>{t('whatIsImportant')}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FIVE STAGES — white, table with visual eGFR bars
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('stagesTitle')}</ChapterLabel>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#666', maxWidth: '600px', marginBottom: '40px' }}>
            {t('stagesPara1')}
          </p>

          {/* Visual stage progression */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px', marginBottom: '40px' }}>
            {[
              { stage: '1', egfr: '90+', pct: 100, label: 'Normal or high', color: '#4a8a4a' },
              { stage: '2', egfr: '60–89', pct: 75, label: 'Mildly decreased', color: '#8ab04a' },
              { stage: '3a', egfr: '45–59', pct: 55, label: 'Mild–moderate', color: '#d4a020' },
              { stage: '3b', egfr: '30–44', pct: 40, label: 'Moderate–severe', color: '#d97020' },
              { stage: '4', egfr: '15–29', pct: 24, label: 'Severely decreased', color: '#c45a3b' },
              { stage: '5', egfr: '<15', pct: 10, label: 'Kidney failure', color: '#8b1a1a' },
            ].map(({ stage, egfr, pct, label, color }) => (
              <div key={stage} style={{ background: '#faf7f3', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '12px' }}>
                  Stage {stage}
                </div>
                {/* eGFR bar */}
                <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: `${pct}%`, background: color, borderRadius: '2px 2px 0 0', minHeight: '8px' }} />
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '400', color: '#1a1a1a', marginBottom: '4px' }}>
                  eGFR {egfr}
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#888', lineHeight: '1.3' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#999', lineHeight: '1.7', maxWidth: '600px' }}>
            {t('stagesPara2')}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW DOCTORS FIND IT + SYMPTOMS — two-column, cream
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>

            {/* How doctors find it */}
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
              <div style={{ paddingLeft: '20px' }}>
                {[t('howFoundItem4'), t('howFoundItem5')].map((item, i) => (
                  <div key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#555', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#c45a3b', fontWeight: '700' }}>—</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <ChapterLabel>{t('symptomsTitle')}</ChapterLabel>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: '#444', marginBottom: '8px' }}>{t('symptomsPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#888', marginBottom: '24px', fontStyle: 'italic' }}>
                {t('symptomsWhy')}
              </p>
              <div style={{ background: '#fff', padding: '4px 0' }}>
                {(['symptomItem1','symptomItem2','symptomItem3','symptomItem4','symptomItem5','symptomItem6','symptomItem7'] as const).map((key, i) => (
                  <div key={key} style={{
                    display: 'flex', gap: '14px', alignItems: 'center',
                    padding: '13px 20px',
                    borderBottom: i < 6 ? '1px solid #f0ece7' : 'none'
                  }}>
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
          TREATMENT — white
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('treatmentTitle')}</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>{t('treatmentPara1')}</p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '28px' }}>{t('treatmentPara2')}</p>
              {(['treatItem1','treatItem2','treatItem3','treatItem4','treatItem5'] as const).map((key, i) => (
                <div key={key} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c45a3b', flexShrink: 0, marginTop: '10px' }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.7', color: '#444' }}>{t(key)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: '#1a1a1a', padding: '32px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '16px' }}>
                  {t('eskdTitle')}
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', lineHeight: '1.8', color: 'rgba(255,255,255,0.75)', margin: '0 0 24px' }}>
                  {t('eskdDesc')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                  <div style={{ background: 'rgba(196,90,59,0.15)', padding: '20px' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '300', color: '#c45a3b', lineHeight: 1 }}>67%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>on dialysis</div>
                  </div>
                  <div style={{ background: 'rgba(107,140,186,0.15)', padding: '20px' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '300', color: '#6b8cba', lineHeight: 1 }}>33%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>transplant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHEN TO SEE A DOCTOR — cream
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>{t('whenSeeTitle')}</ChapterLabel>
          <div style={{ maxWidth: '680px' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#444', marginBottom: '32px' }}>{t('whenSeePara1')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '32px' }}>
              {(['riskItem1','riskItem2','riskItem3','riskItem4','riskItem5'] as const).map((key, i) => (
                <div key={key} style={{ background: '#fff', padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
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
          TYPES — white, APOL1 + FSGS cards
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
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
              <div key={page} style={{ background: '#faf7f3', padding: '32px', borderTop: `3px solid ${accent}` }}>
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
            <div style={{ background: '#faf7f3', padding: '32px', borderTop: '3px solid #a0745a' }}>
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
          CLOSING — dark CTA
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '100px 32px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px' }}>
            <ChapterLabel light>{t('bottomLineTitle')}</ChapterLabel>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '300',
              color: '#fff', lineHeight: '1.15', margin: '0 0 32px'
            }}>
              {t('bottomLineDesc')}
            </h2>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic',
              color: '#c45a3b', lineHeight: '1.6', margin: '0 0 48px',
              borderLeft: '3px solid #c45a3b', paddingLeft: '24px'
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
                  background: 'none', color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)', padding: '14px 32px',
                  cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '12px',
                  fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
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
