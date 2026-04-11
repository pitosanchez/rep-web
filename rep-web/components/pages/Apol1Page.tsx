'use client';

import React from 'react';

interface Apol1PageProps {
  onNavigate?: (page: string) => void;
}

// ── Shared chart primitives (same as KidneyDiseasePage) ───────────────────────
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

const LegendItem: React.FC<{ color: string; label: string; sub?: string; value?: string }> = ({ color, label, sub, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0, marginTop: '3px' }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {value && <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{value}</span>}
      </div>
      {sub && <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#aaa', marginTop: '2px', lineHeight: '1.4' }}>{sub}</div>}
    </div>
  </div>
);

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

// ── APOL1-specific: horizontal population bar ─────────────────────────────────
const PopBar: React.FC<{ label: string; pct: number; max: number; color: string; note?: string }> = ({ label, pct, max, color, note }) => (
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

// ── Inheritance cell ──────────────────────────────────────────────────────────
const GeneCell: React.FC<{ copies: 0 | 1 | 2; label: string; risk: string; color: string; bg: string }> = ({ copies, label, risk, color, bg }) => (
  <div style={{ background: bg, border: `2px solid ${color}`, borderRadius: '8px', padding: '20px 16px', textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
      {[0, 1].map(i => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: '50%',
          background: i < copies ? color : 'rgba(0,0,0,0.08)',
          border: `2px solid ${i < copies ? color : 'rgba(0,0,0,0.12)'}`,
        }} />
      ))}
    </div>
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '400', color: '#1a1a1a', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color }}>{risk}</div>
  </div>
);

// ── Timeline bar (years) ──────────────────────────────────────────────────────
const TimelineBar: React.FC<{ label: string; years: number; max: number; color: string; note: string }> = ({ label, years, max, color, note }) => (
  <div style={{ marginBottom: '28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#999' }}>{label}</span>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '300', color }}>~{years} yrs</span>
    </div>
    <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(years / max) * 100}%`, background: color, borderRadius: '5px' }} />
    </div>
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#777', marginTop: '5px' }}>{note}</div>
  </div>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const CARRIER_STATUS: DonutSlice[] = [
  { label: 'No risk copies (0)',      value: 60, color: '#d0c8c0' },
  { label: 'One risk copy (carrier)', value: 28, color: '#e8926a' },
  { label: 'Two risk copies (high)',  value: 12, color: '#c45a3b' },
];

const PROTECTION_TRADEOFF: DonutSlice[] = [
  { label: 'Protected from sleeping sickness', value: 70, color: '#6b8cba' },
  { label: 'Elevated kidney risk',             value: 30, color: '#c45a3b' },
];

const ACTION_ITEMS = [
  { priority: '01', title: 'Control blood pressure', body: 'The single most impactful thing. Target levels your doctor sets — not just "normal." APOL1 makes hypertension more damaging to kidney tissue.', color: '#c45a3b' },
  { priority: '02', title: 'Get a kidney health baseline', body: 'eGFR and urine protein tests once a year if you have two risk copies. Problems caught early can be slowed. Caught late, options narrow fast.', color: '#e8926a' },
  { priority: '03', title: 'Avoid NSAIDs', body: 'Ibuprofen, naproxen, and similar painkillers are harder on kidneys under stress. Ask your doctor about alternatives — especially if you use them regularly.', color: '#a0745a' },
  { priority: '04', title: 'Manage diabetes and HIV', body: 'Both conditions interact with APOL1 variants to accelerate kidney damage. Tight control of blood sugar or viral load is protective.', color: '#8a8a8a' },
  { priority: '05', title: 'Ask about inaxaplin', body: 'A new drug specifically targeting APOL1-mediated kidney disease is in clinical trials. Ask your nephrologist whether you qualify.', color: '#6b8cba' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export const Apol1Page: React.FC<Apol1PageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — cream, bold number lead
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '100px 32px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Understanding APOL1</ChapterLabel>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 9vw, 96px)',
            fontWeight: '300', lineHeight: '0.95', letterSpacing: '-3px',
            margin: '0 0 40px', color: '#1a1a1a',
          }}>
            1 in 10<br />
            <span style={{ color: '#c45a3b' }}>Black Americans.</span>
          </h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '300', color: '#555', lineHeight: '1.6', maxWidth: '600px', marginBottom: '48px' }}>
            Carry two copies of APOL1 gene variants that significantly raise their lifetime risk of kidney disease — years before any symptoms appear.
          </p>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { stat: '3–4×', label: 'higher lifetime risk of ESKD with 2 copies' },
              { stat: '5–10', label: 'years earlier onset than average' },
              { stat: '25%', label: 'of Black FSGS patients carry 2 copies' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '24px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '300', color: '#1a1a1a', lineHeight: 1 }}>{stat}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', marginTop: '6px', maxWidth: '160px', lineHeight: '1.4' }}>{label}</div>
              </div>
            ))}
          </div>
          <SourceCredit>Sources: NEJM 2010 · Lancet 2017 · NIH APOL1 Long-term Kidney Transplantation Outcomes Network (APOLLO)</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT IS APOL1 — white, plain-language explanation
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>What Is the APOL1 Gene?</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '300', color: '#1a1a1a', lineHeight: '1.2', margin: '0 0 24px' }}>
                A gene that once<br />
                <span style={{ color: '#c45a3b' }}>saved lives.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                APOL1 is a protein your body makes to fight infections. Thousands of years ago in West Africa, two variations of this gene — called <strong>G1</strong> and <strong>G2</strong> — offered powerful protection against sleeping sickness, a deadly parasitic disease. People who carried them were more likely to survive. More likely to have children. The variants spread.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
                The same variants that protected those ancestors now carry a tradeoff: when someone inherits <em>two</em> copies — one from each parent — the elevated APOL1 activity that fights parasites becomes harmful to kidney tissue over time.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
                This is not a flaw. It is evolution — the same mechanism found in sickle cell trait, where the variant that protects against malaria with one copy can cause disease with two.
              </p>
            </div>

            {/* Gene inheritance visual */}
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '20px' }}>
                How Many Copies You Inherit
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <GeneCell copies={0} label="Zero copies" risk="Typical risk" color="#aaa" bg="#fafafa" />
                <GeneCell copies={1} label="One copy" risk="Low added risk" color="#e8926a" bg="#fffaf7" />
                <GeneCell copies={2} label="Two copies" risk="High risk" color="#c45a3b" bg="#fff5f2" />
              </div>
              <div style={{ background: 'rgba(196,90,59,0.05)', border: '1px solid rgba(196,90,59,0.2)', borderRadius: '6px', padding: '16px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#666', lineHeight: '1.7' }}>
                  <strong style={{ color: '#1a1a1a' }}>The key:</strong> One copy from one parent is almost always harmless. You need to inherit a risk variant from <em>both</em> parents for kidney risk to rise significantly.
                </div>
              </div>
              <SourceCredit>APOL1 risk variant inheritance — autosomal recessive pattern</SourceCredit>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PREVALENCE — cream, donut + population bars
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Who Carries APOL1 Risk Variants</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 48px', lineHeight: '1.2' }}>
            Most people with risk variants{' '}
            <span style={{ color: '#c45a3b' }}>will never get kidney disease.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>

            {/* Left: carrier breakdown donut */}
            <div style={{ background: '#fff', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '24px' }}>
                APOL1 Copy Distribution · African Americans
              </div>
              <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <DonutChart data={CARRIER_STATUS} size={200} innerR={68} label="100%" sublabel="OF POPULATION" />
                </div>
                <div style={{ flex: 1 }}>
                  {CARRIER_STATUS.map(d => (
                    <LegendItem key={d.label} color={d.color} label={d.label} value={`${d.value}%`} />
                  ))}
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0ece7' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '300', color: '#c45a3b', lineHeight: 1 }}>~12%</div>
                    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#888', marginTop: '4px', lineHeight: '1.5' }}>carry two copies — the genotype associated with significantly elevated risk</div>
                  </div>
                </div>
              </div>
              <SourceCredit>Prevalence estimates based on population genetics studies · APOL1 JASN 2016</SourceCredit>
            </div>

            {/* Right: variant prevalence bars */}
            <div style={{ background: '#fff', padding: '40px 36px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '24px' }}>
                Individual Variant Carrier Rate · African Americans
              </div>
              <PopBar label="G1 variant (one or two copies)" pct={22} max={35} color="#c45a3b" note="Most common risk variant" />
              <PopBar label="G2 variant (one or two copies)" pct={14} max={35} color="#e8926a" note="Second risk variant" />
              <PopBar label="Two high-risk copies total" pct={12} max={35} color="#a0745a" note="G1+G1, G1+G2, or G2+G2 — the high-risk genotype" />
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f0ece7' }}>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  G1 and G2 variants are rare in populations without recent African ancestry — making this a condition that disproportionately shapes kidney outcomes in Black communities.
                </p>
              </div>
              <SourceCredit>Genovese et al., Science 2010 · Kopp et al., NEJM 2011</SourceCredit>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE TRADEOFF — dark, evolution story
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>Evolutionary Context</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: '300', color: '#fff', lineHeight: '1.2', margin: '0 0 28px' }}>
                Sleeping sickness<br />
                <span style={{ color: '#c45a3b' }}>then. Kidney disease</span><br />
                now.
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', marginBottom: '20px' }}>
                African trypanosomiasis — sleeping sickness — was lethal across sub-Saharan Africa for millennia. The G1 and G2 APOL1 variants gave their carriers immunity. Communities that carried them survived the disease. Those that didn't were wiped out.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', marginBottom: '20px' }}>
                Those variants arrived in the Americas through the forced migration of enslaved Africans. They remain common today — a biological legacy of both evolution and history.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#666' }}>
                Understanding this context is not a footnote. It is the reason APOL1 kidney disease is concentrated in Black communities — and why structural inequity, not just genetics, shapes who gets diagnosed, who gets treated, and who gets care.
              </p>
            </div>

            {/* Protection tradeoff visual */}
            <div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(196,90,59,0.7)', marginBottom: '24px' }}>
                The Same Gene — Two Outcomes
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                <DonutChart data={PROTECTION_TRADEOFF} size={180} innerR={60} />
                <div>
                  {PROTECTION_TRADEOFF.map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: d.color, flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two illustrative callouts */}
              {[
                { era: 'West Africa · Centuries ago', outcome: 'APOL1 variants → survived sleeping sickness', color: '#6b8cba' },
                { era: 'United States · Today', outcome: '2 copies → 3–4× higher kidney disease risk', color: '#c45a3b' },
              ].map(item => (
                <div key={item.era} style={{
                  borderLeft: `3px solid ${item.color}`,
                  paddingLeft: '16px', marginBottom: '16px',
                }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: item.color, marginBottom: '4px' }}>{item.era}</div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{item.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DISEASE SPECTRUM — white, condition cards
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>What APOL1 Can Cause</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 12px', lineHeight: '1.2' }}>
            Two copies raise risk across{' '}
            <span style={{ color: '#c45a3b' }}>multiple conditions.</span>
          </h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '640px' }}>
            The same high-risk genotype interacts differently depending on what else is happening in your body. Each condition below carries a distinct elevated risk.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              {
                condition: 'FSGS',
                riskLabel: '5–10× elevated',
                color: '#c45a3b',
                bg: '#fff5f2',
                body: 'Focal Segmental Glomerulosclerosis — scarring of the kidney\'s filtering units. APOL1 is the strongest genetic driver of FSGS in Black patients.',
              },
              {
                condition: 'HIVAN',
                riskLabel: 'Very high with HIV',
                color: '#a0745a',
                bg: '#fdf8f5',
                body: 'HIV-Associated Nephropathy. Black patients with HIV and 2 APOL1 copies have dramatically elevated risk of rapid kidney failure.',
              },
              {
                condition: 'CKD / Hypertension',
                riskLabel: '2–3× elevated',
                color: '#e8926a',
                bg: '#fff9f5',
                body: 'APOL1 variants make high blood pressure more damaging to kidney tissue — accelerating CKD progression significantly.',
              },
              {
                condition: 'Lupus Nephritis',
                riskLabel: 'Worse outcomes',
                color: '#8a8a8a',
                bg: '#f8f8f8',
                body: 'Black patients with lupus who carry 2 APOL1 copies are more likely to develop severe kidney complications.',
              },
              {
                condition: 'Sickle Cell Nephropathy',
                riskLabel: 'Compounding risk',
                color: '#6b8cba',
                bg: '#f5f8fd',
                body: 'Sickle cell disease combined with APOL1 high-risk genotype compounds kidney damage faster than either condition alone.',
              },
              {
                condition: 'Transplant Outcomes',
                riskLabel: 'Donor risk factor',
                color: '#7a9a8a',
                bg: '#f5faf7',
                body: 'Living kidney donors with 2 APOL1 copies face higher post-donation CKD risk. Testing is recommended before Black donors donate.',
              },
            ].map(item => (
              <div key={item.condition} style={{
                background: item.bg,
                border: `1px solid ${item.color}33`,
                borderTop: `3px solid ${item.color}`,
                borderRadius: '0 0 8px 8px',
                padding: '22px',
              }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: item.color, marginBottom: '6px' }}>
                  {item.riskLabel}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '400', color: '#1a1a1a', marginBottom: '10px' }}>
                  {item.condition}
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#555', lineHeight: '1.65', margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <SourceCredit>Risk estimates from Kopp et al. NEJM 2011 · Parsa et al. NEJM 2013 · Friedman et al. JASN 2017</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROGRESSION — dark, timeline bars
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1a1a1a', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel light>How Fast It Progresses</ChapterLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: '300', color: '#fff', lineHeight: '1.2', margin: '0 0 24px' }}>
                Years earlier.<br />
                <span style={{ color: '#c45a3b' }}>Not decades.</span>
              </h2>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888', marginBottom: '20px' }}>
                APOL1 kidney disease doesn't change whether you might eventually develop kidney failure — it changes <em>when</em>. On average, 5 to 10 years earlier than peers without high-risk genotype.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#888' }}>
                That gap is the entire window for prevention. Early blood pressure control, regular monitoring, and avoiding kidney-damaging medications can delay — sometimes indefinitely — the progression to dialysis or transplant.
              </p>

              {/* Callout */}
              <div style={{ background: 'rgba(196,90,59,0.12)', border: '1px solid rgba(196,90,59,0.25)', borderRadius: '6px', padding: '24px', marginTop: '32px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '300', color: '#c45a3b', lineHeight: 1, marginBottom: '8px' }}>5–10</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontWeight: '600', color: '#ddd', marginBottom: '6px' }}>years earlier onset of ESKD</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>Compared to matched patients without high-risk APOL1 genotype, even after adjusting for blood pressure, diabetes, and other factors.</div>
              </div>
            </div>

            {/* Timeline bars */}
            <div style={{ paddingTop: '8px' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(196,90,59,0.7)', marginBottom: '28px' }}>
                Median Time to Dialysis Need (CKD Stage 1 Start)
              </div>
              <TimelineBar label="No risk variants" years={28} max={35} color="#6b8cba" note="Average 28 years from CKD Stage 1 to dialysis" />
              <TimelineBar label="One risk copy" years={24} max={35} color="#e8926a" note="Modest acceleration vs. no-variant baseline" />
              <TimelineBar label="Two risk copies" years={18} max={35} color="#c45a3b" note="Fastest progression — monitoring every 6–12 months recommended" />
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: '#555', lineHeight: '1.6', letterSpacing: '0.3px' }}>
                  Illustrative ranges based on cohort studies. Individual progression varies substantially with comorbidities, blood pressure control, and access to care.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHAT YOU CAN DO — cream, ranked action items
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#faf7f3', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>If You Have Two Copies</ChapterLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '300', color: '#1a1a1a', margin: '0 0 12px', lineHeight: '1.2' }}>
            You have more agency<br />
            <span style={{ color: '#c45a3b' }}>than the diagnosis suggests.</span>
          </h2>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#888', lineHeight: '1.7', marginBottom: '40px', maxWidth: '600px' }}>
            Carrying two APOL1 risk copies is not a sentence. The majority of people with the genotype never develop kidney failure. These actions make a measurable difference.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {ACTION_ITEMS.map((item) => (
              <div key={item.priority} style={{
                background: '#fff',
                display: 'flex', gap: '24px', padding: '28px 32px',
                alignItems: 'flex-start',
                borderLeft: `4px solid ${item.color}`,
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif', fontSize: '13px', color: item.color,
                  fontWeight: '600', flexShrink: 0, width: '24px', marginTop: '2px',
                }}>
                  {item.priority}
                </div>
                <div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{item.title}</div>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testing box */}
          <div style={{ background: 'rgba(196,90,59,0.06)', border: '2px solid #c45a3b', padding: '28px 32px', marginTop: '32px' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: '12px' }}>
              Should You Get Tested?
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#333', lineHeight: '1.7', margin: '0 0 12px' }}>
              Routine APOL1 screening is not yet standard of care — but it is recommended if you: have African ancestry and kidney disease with unclear cause; are considering living kidney donation; have HIV and African ancestry; or have a family history of kidney failure.
            </p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#333', lineHeight: '1.7', margin: 0 }}>
              Testing is a simple blood or saliva sample. Ask your nephrologist or primary care doctor.
            </p>
          </div>
          <SourceCredit>NephCure Kidney International · ASN APOL1 Position Statement · NIH APOLLO Study 2023</SourceCredit>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING — white, key takeaways + CTA
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChapterLabel>Key Things to Remember</ChapterLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '20px', marginBottom: '56px' }}>
            {[
              { num: '1', text: 'You need TWO high-risk copies — one from each parent — for risk to rise significantly. One copy alone is usually harmless.' },
              { num: '2', text: 'Having two copies does not mean you will get kidney disease. Lifestyle and access to care matter enormously.' },
              { num: '3', text: 'Blood pressure control is your most powerful protection. This single factor has strong evidence behind it.' },
              { num: '4', text: 'These variants are the result of an evolutionary advantage, not a biological deficiency. Context matters.' },
              { num: '5', text: 'Inaxaplin and other targeted therapies are in late-stage trials. The treatment landscape is actively changing.' },
              { num: '6', text: 'If you have African ancestry and unexplained kidney disease, ask your doctor about APOL1 testing.' },
            ].map(item => (
              <div key={item.num} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: '#c45a3b',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'system-ui', fontSize: '12px', fontWeight: '700', flexShrink: 0,
                }}>
                  {item.num}
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>

          {onNavigate && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('fsgs')}
                style={{
                  padding: '14px 32px', background: '#c45a3b', color: '#fff',
                  border: 'none', borderRadius: '4px', fontFamily: 'system-ui',
                  fontSize: '13px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Learn About FSGS →
              </button>
              <button
                onClick={() => onNavigate('map')}
                style={{
                  padding: '14px 32px', background: '#fff', color: '#c45a3b',
                  border: '2px solid #c45a3b', borderRadius: '4px', fontFamily: 'system-ui',
                  fontSize: '13px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Explore the Map
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
