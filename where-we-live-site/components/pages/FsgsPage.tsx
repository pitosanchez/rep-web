'use client';

import React from 'react';

interface FsgsPageProps {
  onNavigate?: (page: string) => void;
}

// ── Shared chart primitives ───────────────────────────────────────────────────
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
}> = ({ data, size = 200, innerR = 68, label, sublabel }) => {
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
      'Z',
    ].join(' ');
    return { ...d, pathD };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map(seg => <path key={seg.label} d={seg.pathD} fill={seg.color} />)}
      {label && (
        <>
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#1a1a1a"
            style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300' }}>
            {label}
          </text>
          {sublabel && (
            <text x={cx} y={cy + 13} textAnchor="middle" fill="#999"
              style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', letterSpacing: '1px' }}>
              {sublabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

const ChapterLabel: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div style={{
    fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600',
    letterSpacing: '3px', textTransform: 'uppercase',
    color: light ? 'rgba(196,90,59,0.8)' : '#c45a3b', marginBottom: '20px',
  }}>
    {children}
  </div>
);

const SourceCredit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#bbb', marginTop: '20px', letterSpacing: '0.3px', lineHeight: '1.6' }}>
    {children}
  </div>
);

// ── FSGS-specific: horizontal bar ─────────────────────────────────────────────
const StatBar: React.FC<{ label: string; pct: number; max: number; color: string; note?: string }> = ({ label, pct, max, color, note }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#666' }}>{label}</span>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '300', color }}>{pct}%</span>
    </div>
    <div style={{ height: '8px', background: 'rgba(0,0,0,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(pct / max) * 100}%`, background: color, borderRadius: '4px' }} />
    </div>
    {note && <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{note}</div>}
  </div>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const FSGS_TYPES: DonutSlice[] = [
  { label: 'Primary (idiopathic)', value: 40, color: '#c45a3b' },
  { label: 'Secondary',            value: 35, color: '#e8926a' },
  { label: 'Genetic / Familial',   value: 15, color: '#6b8cba' },
  { label: 'Unknown',              value: 10, color: '#b0a89e' },
];

const FSGS_OUTCOMES_10YR: DonutSlice[] = [
  { label: 'Reached ESKD by 10 years',     value: 50, color: '#c45a3b' },
  { label: 'Partial/complete remission',   value: 30, color: '#6b8cba' },
  { label: 'Stable CKD without remission', value: 20, color: '#d0c8c0' },
];

const FSGS_DISPARITY: DonutSlice[] = [
  { label: 'Black patients',  value: 40, color: '#c45a3b' },
  { label: 'All other groups', value: 60, color: '#d0c8c0' },
];

const TYPE_DETAILS = [
  {
    type: 'Primary FSGS',
    pct: '~40%',
    color: '#c45a3b',
    bg: '#fff5f2',
    label: 'Idiopathic',
    body: 'No identifiable cause. The immune system appears to attack the kidney\'s filtering units for reasons that remain unclear. Usually responds to immunosuppressive therapy — but relapse is common.',
    keyFact: 'Most common type in clinical practice',
  },
  {
    type: 'Secondary FSGS',
    pct: '~35%',
    color: '#e8926a',
    bg: '#fff9f5',
    label: 'Caused by another condition',
    body: 'Driven by a known underlying factor: diabetes, obesity, HIV infection, sickle cell disease, or medication toxicity. Treating the root cause is the primary strategy — not immunosuppression.',
    keyFact: 'Treatment targets the cause, not just the kidney',
  },
  {
    type: 'Genetic FSGS',
    pct: '~15%',
    color: '#6b8cba',
    bg: '#f5f8fd',
    label: 'Familial / Inherited',
    body: 'Gene mutations — including APOL1 — damage the kidney\'s podocytes directly. Can appear in multiple family members. Often resistant to steroids. Genetic testing can confirm.',
    keyFact: 'APOL1 is the most common genetic driver in Black patients',
  },
  {
    type: 'Unknown FSGS',
    pct: '~10%',
    color: '#8a8a8a',
    bg: '#f8f8f8',
    label: 'Undetermined',
    body: 'Extensive testing cannot identify the cause. Treatment is empirical — often trials of immunosuppression, with close monitoring of kidney function and protein levels.',
    keyFact: 'Diagnosis requires kidney biopsy to confirm',
  },
];

const SYMPTOMS = [
  { icon: '◎', label: 'Foamy urine', note: 'Protein spilling into urine (proteinuria) — often the first noticeable sign', color: '#c45a3b' },
  { icon: '▽', label: 'Swelling (edema)', note: 'Especially in legs, ankles, around the eyes — from low protein in blood', color: '#e8926a' },
  { icon: '⊕', label: 'Weight gain from fluid', note: 'Rapid unexplained gain from retained water', color: '#a0745a' },
  { icon: '◑', label: 'Fatigue and weakness', note: 'Toxin buildup as kidney function declines', color: '#8a8a8a' },
  { icon: '▲', label: 'High blood pressure', note: 'Both a symptom and an accelerator of damage', color: '#6b8cba' },
  { icon: '—', label: 'Loss of appetite', note: 'Uremia (waste buildup) suppresses appetite', color: '#b0a89e' },
  { icon: '~', label: 'Muscle cramps', note: 'Electrolyte imbalances from impaired filtration', color: '#d0c8c0' },
];

const MEDS = [
  { name: 'ACE Inhibitors / ARBs', role: 'First line', body: 'Reduce blood pressure and protein leakage. Slow progression in all FSGS types.', color: '#c45a3b' },
  { name: 'Corticosteroids', role: 'Primary FSGS', body: 'Reduce immune attack on glomeruli. Can induce remission but require monitoring for side effects.', color: '#e8926a' },
  { name: 'Immunosuppressants', role: 'Steroid-resistant', body: 'Tacrolimus, cyclosporine, mycophenolate — used when steroids fail or when tapering.', color: '#6b8cba' },
  { name: 'Diuretics', role: 'Symptom management', body: 'Reduce fluid retention and edema. Do not slow disease but improve quality of life.', color: '#8a8a8a' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export const FsgsPage: React.FC<FsgsPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — cream, bold number lead
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '100px 32px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Understanding FSGS</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 9vw, 96px)',
            fontWeight: '300', lineHeight: '0.95', letterSpacing: '-3px',
            margin: '0 0 40px', color: '#1a1a1a',
          }}>
            50% reach<br />
            <span style={{ color: '#c45a3b' }}>kidney failure.</span>
          </h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300', color: '#555', lineHeight: '1.6', maxWidth: '600px', marginBottom: '48px' }}>
            Within 10 years of FSGS diagnosis — without adequate treatment. It is the leading cause of nephrotic syndrome in adults and one of the most common reasons Black patients reach end-stage kidney disease.
          </p>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { stat: '~5,400', label: 'new FSGS diagnoses per year in the US' },
              { stat: '3–4×', label: 'higher rate in Black vs. white adults' },
              { stat: '50K+', label: 'Americans living with FSGS today' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#1a1a1a', lineHeight: 1 }}>{stat}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', marginTop: '6px', maxWidth: '160px', lineHeight: '1.4' }}>{label}</div>
              </div>
            ))}
          </div>
          <SourceCredit>Sources: USRDS 2023 · NephCure FSGS Report · JASN 2021 Epidemiology Review</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT IS FSGS — white, plain-language anatomy
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>What Is Happening in Your Kidney</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '300', color: '#1a1a1a', lineHeight: '1.2', margin: '0 0 24px' }}>
                Scarring where<br />
                <span style={{ color: '#c45a3b' }}>blood is filtered.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                Each kidney contains about one million tiny filters called <strong>glomeruli</strong>. Their job: clean waste and excess fluid from your blood, hour by hour, for your entire life. In FSGS — Focal Segmental Glomerulosclerosis — scar tissue forms directly on some of those filters.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                <strong>Focal</strong> means only some glomeruli are affected. <strong>Segmental</strong> means only part of each affected glomerulus scars. But as scarring spreads, kidney function steadily declines.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
                The key cell being damaged is the <strong>podocyte</strong> — a specialized cell that wraps around the glomerular capillaries and acts as the final filter barrier. When podocytes are lost, they cannot regenerate. The resulting leak allows protein — which should stay in the blood — to spill into the urine.
              </p>
            </div>

            {/* Anatomy diagram — minimal SVG schematic */}
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '20px' }}>
                The Filtration Process
              </div>
              <svg viewBox="0 0 320 280" width="100%" style={{ display: 'block', marginBottom: '20px' }}>
                {/* Blood vessel in */}
                <path d="M 40 80 Q 80 80 100 120" stroke="#6b8cba" strokeWidth="8" fill="none" strokeLinecap="round" />
                <text x="20" y="72" style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#6b8cba', fontWeight: '700' }}>BLOOD IN</text>

                {/* Glomerulus circle — healthy */}
                <circle cx="140" cy="140" r="50" fill="#f0f8ff" stroke="#6b8cba" strokeWidth="2" />
                <text x="140" y="136" textAnchor="middle" style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fill: '#1a1a1a' }}>Glomerulus</text>
                <text x="140" y="152" textAnchor="middle" style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#888' }}>Normal filter</text>

                {/* Scarred glomerulus */}
                <circle cx="140" cy="140" r="50" fill="none" stroke="#c45a3b" strokeWidth="2" strokeDasharray="6 3" opacity="0" />

                {/* Blood vessel out */}
                <path d="M 180 120 Q 200 80 240 80" stroke="#6b8cba" strokeWidth="8" fill="none" strokeLinecap="round" />
                <text x="220" y="72" style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#6b8cba', fontWeight: '700' }}>BLOOD OUT</text>

                {/* Urine — normal (small) */}
                <path d="M 130 190 Q 130 230 110 250" stroke="#d0e8f0" strokeWidth="5" fill="none" strokeLinecap="round" />
                <text x="70" y="265" style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#8ab8d0' }}>Urine (no protein)</text>

                {/* FSGS version — scarred */}
                <circle cx="140" cy="140" r="30" fill="rgba(196,90,59,0.08)" stroke="none" />
                {[0,1,2,3].map(i => (
                  <ellipse key={i}
                    cx={120 + i * 8} cy={145 + (i % 2 === 0 ? -4 : 4)}
                    rx="6" ry="4"
                    fill={`rgba(196,90,59,${0.15 + i * 0.08})`}
                    stroke="rgba(196,90,59,0.3)" strokeWidth="1"
                    transform={`rotate(${i * 25} 140 140)`}
                  />
                ))}
                <text x="140" y="194" textAnchor="middle" style={{ fontFamily: 'system-ui', fontSize: '9px', fill: '#c45a3b', fontWeight: '700', letterSpacing: '1px' }}>SCAR TISSUE</text>

                {/* Protein leak arrow */}
                <path d="M 160 192 Q 180 220 200 240" stroke="#c45a3b" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 3" />
                <text x="198" y="256" style={{ fontFamily: 'system-ui', fontSize: '9px', fill: '#c45a3b', fontWeight: '700' }}>PROTEIN LEAK</text>
                <text x="198" y="268" style={{ fontFamily: 'system-ui', fontSize: '9px', fill: '#c45a3b' }}>(foamy urine)</text>

                {/* Label */}
                <text x="8" y="18" style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#bbb', letterSpacing: '1px' }}>FSGS: Scar tissue → protein leaks into urine</text>
              </svg>

              <div style={{ background: 'rgba(196,90,59,0.05)', border: '1px solid rgba(196,90,59,0.2)', borderRadius: '6px', padding: '16px' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  <strong style={{ color: '#c45a3b' }}>Foamy urine</strong> is often the first sign — protein in urine creates bubbles. If you notice persistent foaminess, ask your doctor for a urine protein test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TYPES — dark, 4 cards with donut
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>The Four Types of FSGS</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            {/* Donut */}
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#fff', lineHeight: '1.2', margin: '0 0 24px' }}>
                Same disease.<br />
                <span style={{ color: '#c45a3b' }}>Very different causes.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', marginBottom: '32px' }}>
                FSGS is not one disease — it is a pattern of kidney injury with multiple causes. The type determines treatment. Getting the type wrong means treating the wrong target.
              </p>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <DonutChart data={FSGS_TYPES} size={180} innerR={60} label="FSGS" sublabel="TYPES" />
                <div>
                  {FSGS_TYPES.map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888' }}>{d.label}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontWeight: '600', color: '#ccc', marginLeft: 'auto' }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <SourceCredit>Approximate distribution · NephCure FSGS State of Disease Report 2021</SourceCredit>
            </div>

            {/* Type cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {TYPE_DETAILS.map(item => (
                <div key={item.type} style={{
                  background: '#2a2a2a',
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: '0 6px 6px 0',
                  padding: '20px 22px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: item.color, marginBottom: '4px' }}>{item.label} · {item.pct}</div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#eee' }}>{item.type}</div>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', lineHeight: '1.6', margin: '0 0 10px' }}>{item.body}</p>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', color: item.color, letterSpacing: '0.5px' }}>
                    {item.keyFact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DISPARITY — cream, racial disparity context
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Who Is Most Affected</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: '300', color: '#1a1a1a', lineHeight: '1.2', margin: '0 0 24px' }}>
                This is not<br />
                <span style={{ color: '#c45a3b' }}>distributed equally.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                Black adults are 3–4 times more likely to develop FSGS than white adults. Among Black FSGS patients, approximately 25% carry the high-risk APOL1 genotype — which drives faster progression and greater dialysis risk.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '32px' }}>
                But genetics alone does not explain this disparity. Research consistently shows that later diagnosis, less access to nephrology care, higher rates of uninsured status, and neighborhood-level structural factors all contribute to worse outcomes.
              </p>

              <StatBar label="Black adults with FSGS" pct={40} max={50} color="#c45a3b" note="~40% of primary FSGS cases in large US registries" />
              <StatBar label="Reach ESKD within 10 yrs (without remission)" pct={50} max={50} color="#e8926a" note="Highlights urgency of early, accurate diagnosis" />
              <StatBar label="Black FSGS patients with APOL1 high-risk genotype" pct={25} max={50} color="#a0745a" note="Genetic + structural factors compound each other" />

              <SourceCredit>FSGS Clinical Trial Registry · Kopp et al. JASN 2011 · USRDS 2023</SourceCredit>
            </div>

            {/* Risk factors */}
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '20px' }}>
                Key Risk Factors
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'African American descent', level: 'Highest risk', color: '#c45a3b', body: 'Structural, historical, and genetic factors converge. Not reducible to any single cause.' },
                  { label: 'APOL1 high-risk genotype', level: 'Genetic driver', color: '#e8926a', body: 'Two APOL1 risk copies substantially raise FSGS risk and accelerate progression.' },
                  { label: 'HIV infection', level: 'Secondary FSGS trigger', color: '#a0745a', body: 'HIV-associated nephropathy (HIVAN) is a form of secondary FSGS. Antiretroviral therapy is protective.' },
                  { label: 'Obesity', level: 'Mechanical stress', color: '#8a8a8a', body: 'Excess weight puts chronic mechanical strain on glomeruli, accelerating adaptive FSGS.' },
                  { label: 'Male sex', level: 'Moderate risk factor', color: '#b0a89e', body: 'Males develop FSGS at slightly higher rates than females, particularly primary FSGS.' },
                  { label: 'Prior kidney disease', level: 'Compounding risk', color: '#d0c8c0', body: 'Existing CKD or congenital anomalies raise adaptive FSGS risk.' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: '#fff',
                    border: `1px solid ${item.color}22`,
                    borderLeft: `3px solid ${item.color}`,
                    borderRadius: '0 6px 6px 0',
                    padding: '16px 18px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{item.label}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: item.color }}>{item.level}</span>
                    </div>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', lineHeight: '1.5', margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SYMPTOMS — white, visual symptom grid
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Recognizing FSGS</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 12px', lineHeight: '1.2' }}>
            Many people have{' '}
            <span style={{ color: '#c45a3b' }}>no symptoms at all</span>
            <br />until damage is significant.
          </h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            This is what makes FSGS dangerous: the kidneys lose function silently. By the time edema or fatigue appears, substantial scarring may have already occurred. Routine protein-in-urine tests are the earliest and most reliable warning sign.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '16px', marginBottom: '32px' }}>
            {SYMPTOMS.map(sym => (
              <div key={sym.label} style={{
                background: '#faf7f3',
                border: '1px solid #e8e4df',
                borderTop: `3px solid ${sym.color}`,
                borderRadius: '0 0 8px 8px',
                padding: '20px',
              }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: sym.color, marginBottom: '10px' }}>{sym.icon}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{sym.label}</div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', lineHeight: '1.6', margin: 0 }}>{sym.note}</p>
              </div>
            ))}
          </div>

          {/* Urgent callout */}
          <div style={{ background: 'rgba(196,90,59,0.06)', border: '2px solid #c45a3b', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '10px' }}>
              When to See a Doctor
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#333', lineHeight: '1.7', margin: 0 }}>
              If you notice <strong>persistent foamy urine</strong>, unexplained <strong>leg or ankle swelling</strong>, or <strong>rapid weight gain without a change in eating</strong> — ask for a urine protein test. A simple dipstick test in a doctor's office can detect proteinuria in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DIAGNOSIS — cream, step flow
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>The Path to Diagnosis</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 40px', lineHeight: '1.2' }}>
            Only a <span style={{ color: '#c45a3b' }}>kidney biopsy</span> can confirm FSGS.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '40px' }}>
            {[
              {
                step: '01',
                title: 'Urine protein test',
                body: 'Routine dipstick or quantitative urine test detects protein — the earliest marker. Persistent proteinuria above 3.5g/day suggests nephrotic syndrome.',
                color: '#c45a3b',
              },
              {
                step: '02',
                title: 'Blood tests (eGFR, creatinine, albumin)',
                body: 'Kidney function tests reveal how much filtering capacity remains. Low serum albumin alongside high proteinuria points toward nephrotic-range disease.',
                color: '#e8926a',
              },
              {
                step: '03',
                title: 'Imaging (ultrasound)',
                body: 'Rules out structural kidney problems, cysts, or obstruction. Cannot diagnose FSGS — but confirms kidney size and rules out other causes.',
                color: '#a0745a',
              },
              {
                step: '04',
                title: 'Kidney biopsy',
                body: 'A small needle extracts kidney tissue. Pathologists examine it under microscope for the distinctive "focal, segmental" scarring pattern. This is the definitive test — and determines the FSGS type.',
                color: '#6b8cba',
                highlight: true,
              },
              {
                step: '05',
                title: 'APOL1 genetic testing (for eligible patients)',
                body: 'Blood or saliva sample. Recommended for Black patients with FSGS of unclear cause — identifies the genetic FSGS subtype and informs treatment decisions.',
                color: '#8a8a8a',
              },
            ].map(item => (
              <div key={item.step} style={{
                background: item.highlight ? 'rgba(107,140,186,0.06)' : '#fff',
                border: item.highlight ? '1px solid rgba(107,140,186,0.3)' : '1px solid #f0ece7',
                display: 'flex', gap: '20px', padding: '24px 28px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif', fontSize: '13px',
                  color: item.color, fontWeight: '600',
                  flexShrink: 0, width: '24px', marginTop: '2px',
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>
                    {item.title}
                    {item.highlight && <span style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: item.color, marginLeft: '12px' }}>Required for diagnosis</span>}
                  </div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TREATMENT — dark, medications + outcomes
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>Treatment</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            {/* Left: medications */}
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#fff', lineHeight: '1.2', margin: '0 0 24px' }}>
                Treatment depends on<br />
                <span style={{ color: '#c45a3b' }}>which type you have.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', marginBottom: '32px' }}>
                The same medications that help primary FSGS can be harmful in genetic FSGS. This is why biopsy type matters before any treatment begins.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MEDS.map(med => (
                  <div key={med.name} style={{
                    background: '#2a2a2a', borderLeft: `3px solid ${med.color}`,
                    borderRadius: '0 6px 6px 0', padding: '18px 20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '600', color: '#eee' }}>{med.name}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: med.color, marginLeft: '12px', whiteSpace: 'nowrap' }}>{med.role}</span>
                    </div>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#777', lineHeight: '1.6', margin: 0 }}>{med.body}</p>
                  </div>
                ))}
              </div>

              {/* Lifestyle */}
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(196,90,59,0.7)', marginBottom: '16px' }}>
                  Lifestyle Modifications
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Low sodium diet', 'Low protein intake', 'Regular exercise', 'No smoking', 'Healthy weight', 'Avoid NSAIDs', 'Vitamin D'].map(item => (
                    <div key={item} style={{
                      fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600',
                      color: '#aaa', background: '#252525', padding: '6px 12px',
                      borderRadius: '3px', border: '1px solid #333',
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: outcomes donut */}
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(196,90,59,0.7)', marginBottom: '24px' }}>
                10-Year Outcomes After Diagnosis
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                <DonutChart data={FSGS_OUTCOMES_10YR} size={180} innerR={60} label="10yr" sublabel="OUTCOMES" />
                <div>
                  {FSGS_OUTCOMES_10YR.map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: d.color, flexShrink: 0, marginTop: '3px' }} />
                      <div>
                        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#aaa', marginBottom: '2px' }}>{d.label}</div>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300', color: d.color }}>{d.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment goals */}
              <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(196,90,59,0.7)', marginBottom: '16px' }}>
                  Goals of Treatment
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '700', color: '#c45a3b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Short-term</div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#777', lineHeight: '1.6', margin: 0 }}>Reduce protein in urine · control blood pressure · manage swelling</p>
                </div>
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '700', color: '#6b8cba', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Long-term</div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#777', lineHeight: '1.6', margin: 0 }}>Preserve remaining kidney function · delay or prevent dialysis · maintain quality of life</p>
                </div>
              </div>
              <SourceCredit>Outcomes data · Braun et al. CJASN 2021 · NephCure Foundation</SourceCredit>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DISPARITY DONUT + CONTEXT — cream
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>FSGS and Where You Live</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

            <div style={{ background: '#fff', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '20px' }}>
                Black Patients as Share of FSGS Cases
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <DonutChart data={FSGS_DISPARITY} size={180} innerR={60} label="~40%" sublabel="Black patients" />
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', lineHeight: '1.6', margin: 0 }}>
                Despite representing ~13% of the US population, Black adults account for ~40% of primary FSGS cases in large registry studies.
              </p>
              <SourceCredit>FSGS Clinical Trial Registry 2021</SourceCredit>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '300', color: '#1a1a1a', lineHeight: '1.25', margin: '0 0 20px' }}>
                Genetics explains part of this.<br />
                <span style={{ color: '#c45a3b' }}>Place explains the rest.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                APOL1 variants increase biological risk. But the gap in outcomes between Black and white FSGS patients cannot be attributed to genetics alone. Studies show that insurance coverage, proximity to a nephrologist, neighborhood food access, and systemic barriers to early care all predict who progresses to dialysis — and who doesn't.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
                This is why mapping where patients live matters. The zip code someone receives care in shapes their FSGS outcome as much as the variant they carry.
              </p>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('map')}
                  style={{
                    marginTop: '24px', padding: '12px 28px',
                    background: '#c45a3b', color: '#fff', border: 'none',
                    borderRadius: '4px', fontFamily: 'system-ui', fontSize: '13px',
                    fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Explore the Map →
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING — white, takeaways + CTA
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Your FSGS Journey</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 12px', lineHeight: '1.2' }}>
            No two cases are the same.
          </h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            FSGS is a condition that requires close, ongoing partnership with your care team. Close monitoring changes outcomes. These questions can help you start that conversation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              { q: 'Ask your doctor:', a: '"Which type of FSGS do I have? Does the type change which treatment is right for me?"' },
              { q: 'Ask about testing:', a: '"Should I be tested for APOL1 variants? How would that change my treatment plan?"' },
              { q: 'Ask about monitoring:', a: '"How often should I check my urine protein and eGFR? What trend should I watch for?"' },
              { q: 'Ask about remission:', a: '"What does remission look like for my type of FSGS? What is my probability of achieving it?"' },
              { q: 'Ask about clinical trials:', a: '"Am I eligible for any FSGS clinical trials? What is being studied right now?"' },
              { q: 'Ask about structure:', a: '"How does where I live affect my access to nephrology care? Are there telehealth options?"' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#faf7f3', border: '1px solid #e8e4df',
                borderTop: '3px solid #c45a3b', padding: '20px',
              }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '8px' }}>{item.q}</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'italic', color: '#444', lineHeight: '1.6', margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {onNavigate && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('apol1')}
                style={{
                  padding: '14px 32px', background: '#c45a3b', color: '#fff',
                  border: 'none', borderRadius: '4px', fontFamily: 'system-ui',
                  fontSize: '13px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                ← Learn About APOL1
              </button>
              <button
                onClick={() => onNavigate('stories')}
                style={{
                  padding: '14px 32px', background: '#fff', color: '#c45a3b',
                  border: '2px solid #c45a3b', borderRadius: '4px', fontFamily: 'system-ui',
                  fontSize: '13px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Read Patient Stories
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
