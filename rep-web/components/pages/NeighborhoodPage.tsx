'use client';

import React, { useState, useEffect } from 'react';
import { stories as patientStories, PatientStory } from '@/lib/stories';
import { getNeighborhoodForZip } from '@/lib/storyZipMapping';

// ── Cost of living comparison benchmarks ─────────────────────────────────────
// Source: MIT Living Wage Calculator 2024 (1 adult + 1 child) + ACS 2022 5-yr
const NYC_BENCH = { label: 'NYC Average', monthly_cost: 6583, median_income: 70745 };
const US_BENCH  = { label: 'U.S. Average', monthly_cost: 5167, median_income: 74580 };

interface CostEntry {
  zip: string;
  neighborhood: string;
  costs: { housing:number; food:number; transport:number; healthcare:number; childcare:number; other:number };
  required_income: number;
  median_income: number;
  income_gap: number;
  cost_burden_ratio: number;
}

// ── What It Costs — plain-language cost section ───────────────────────────────

const COST_COLORS = {
  housing: '#dc2626', food: '#d97706', transport: '#2563eb',
  healthcare: '#16a34a', childcare: '#7c3aed', other: '#6b7280',
} as const;

const COST_LABELS = {
  housing: 'Rent', food: 'Food', transport: 'Getting Around',
  healthcare: 'Healthcare', childcare: 'Childcare', other: 'Other Basics',
} as const;

type CostKey = keyof typeof COST_COLORS;
const COST_ORDER: CostKey[] = ['housing','childcare','food','healthcare','transport','other'];

function fmt$(n: number) {
  return '$' + n.toLocaleString();
}

const CompareCard: React.FC<{
  label: string;
  sublabel?: string;
  monthly_cost: number;
  median_income: number;
  isThis?: boolean;
}> = ({ label, sublabel, monthly_cost, median_income, isThis }) => {
  const monthly_income = Math.round(median_income / 12);
  const monthly_gap = monthly_income - monthly_cost;
  const income_pct = Math.min(100, Math.round((monthly_income / monthly_cost) * 100));
  const hasGap = monthly_gap < 0;
  const gapColor = hasGap
    ? (Math.abs(monthly_gap) > 2000 ? '#dc2626' : '#d97706')
    : '#16a34a';

  return (
    <div style={{
      background: isThis ? '#faf7f3' : '#fff',
      border: isThis ? `2px solid #c45a3b` : '1px solid #e8e4df',
      borderRadius: 8,
      padding: '24px',
      flex: 1,
      minWidth: 0,
    }}>
      {isThis && (
        <div style={{
          fontFamily: 'system-ui', fontSize: 10, fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase',
          color: '#c45a3b', marginBottom: 6,
        }}>
          This Neighborhood
        </div>
      )}
      <div style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', marginBottom: 16 }}>
          {sublabel}
        </div>
      )}
      {!sublabel && <div style={{ marginBottom: 16 }} />}

      {/* Monthly cost — big number */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Monthly basics cost
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: '#1a1a1a', lineHeight: 1 }}>
          {fmt$(monthly_cost)}
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#aaa' }}>per month</div>
      </div>

      {/* Income bar — how far it stretches */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Typical monthly income
          </span>
          <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>
            {fmt$(monthly_income)}
          </span>
        </div>
        {/* Full bar = what's needed; colored portion = what families have */}
        <div style={{ height: 12, background: '#f0ece6', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${income_pct}%`,
            background: hasGap
              ? (income_pct < 60 ? '#dc2626' : '#d97706')
              : '#16a34a',
            borderRadius: 6,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 10, color: '#bbb', marginTop: 3 }}>
          Income covers {income_pct}% of monthly costs
        </div>
      </div>

      {/* Gap callout */}
      <div style={{
        padding: '10px 12px',
        background: hasGap ? (income_pct < 60 ? '#fef2f2' : '#fffbeb') : '#f0fdf4',
        borderRadius: 6,
        borderLeft: `3px solid ${gapColor}`,
      }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 13, fontWeight: 700, color: gapColor }}>
          {hasGap
            ? `${fmt$(Math.abs(monthly_gap))} short every month`
            : `${fmt$(monthly_gap)} left over each month`}
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#666', marginTop: 2 }}>
          {hasGap
            ? `${fmt$(Math.abs(monthly_gap * 12))} shortfall per year`
            : 'Costs are covered'}
        </div>
      </div>
    </div>
  );
};

const WhatItCosts: React.FC<{ cost: CostEntry; neighborhoodName: string }> = ({ cost, neighborhoodName }) => {
  const monthly_total = Object.values(cost.costs).reduce((a, b) => a + b, 0);
  const monthly_income = Math.round(cost.median_income / 12);

  return (
    <section style={{ background: '#fff', padding: '64px 48px', borderBottom: '1px solid #e8e4df' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 12,
          }}>
            Cost of Living
          </div>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,36px)',
            fontWeight: 300, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 16,
          }}>
            What it actually costs to live in {neighborhoodName}
          </h2>
          <p style={{
            fontFamily: 'system-ui', fontSize: 16, color: '#555',
            lineHeight: 1.7, maxWidth: 680, margin: 0,
          }}>
            To cover the basics — rent, food, getting to the doctor, childcare — a family here
            needs <strong style={{ color: '#1a1a1a' }}>{fmt$(monthly_total)} every month</strong>.
            The typical household in this neighborhood earns <strong style={{ color: monthly_income < monthly_total ? '#dc2626' : '#16a34a' }}>{fmt$(monthly_income)} a month</strong>.
            Here's how that compares.
          </p>
        </div>

        {/* Three-way comparison cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
          <CompareCard
            label={neighborhoodName}
            sublabel={`ZIP ${cost.zip}`}
            monthly_cost={monthly_total}
            median_income={cost.median_income}
            isThis
          />
          <CompareCard
            label={NYC_BENCH.label}
            sublabel="All five boroughs"
            monthly_cost={NYC_BENCH.monthly_cost}
            median_income={NYC_BENCH.median_income}
          />
          <CompareCard
            label={US_BENCH.label}
            sublabel="Across the country"
            monthly_cost={US_BENCH.monthly_cost}
            median_income={US_BENCH.median_income}
          />
        </div>

        {/* Where the money goes */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: 20,
          }}>
            Where the money goes — {fmt$(monthly_total)}/month breakdown
          </div>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 36, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            {COST_ORDER.map(k => {
              const pct = (cost.costs[k] / monthly_total) * 100;
              return (
                <div key={k} title={`${COST_LABELS[k]}: ${fmt$(cost.costs[k])}/mo`}
                  style={{ width: `${pct}%`, background: COST_COLORS[k], position: 'relative' }}
                />
              );
            })}
          </div>
          {/* Legend + dollar amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '12px 24px' }}>
            {COST_ORDER.map(k => {
              const pct = Math.round((cost.costs[k] / monthly_total) * 100);
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: COST_COLORS[k], flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#1a1a1a', fontWeight: 600 }}>
                      {fmt$(cost.costs[k])}<span style={{ fontWeight: 400, color: '#888', fontSize: 11 }}>/mo</span>
                    </div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888' }}>
                      {COST_LABELS[k]} · {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plain-language callout */}
        {cost.income_gap > 0 && (
          <div style={{
            padding: '28px 32px',
            background: '#fef2f2',
            borderRadius: 8,
            borderLeft: '4px solid #dc2626',
          }}>
            <div style={{
              fontFamily: 'Georgia, serif', fontSize: 'clamp(16px,2vw,20px)',
              fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, marginBottom: 12,
            }}>
              In {neighborhoodName}, a family earning the neighborhood's typical income
              is <strong style={{ color: '#dc2626' }}>{fmt$(Math.round(cost.income_gap / 12))} short
              every single month</strong> — just to cover the basics.
            </div>
            <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>
              That's not because people aren't working. It's because rent, childcare, food, and healthcare
              together cost more than this neighborhood's wages were designed to cover.
              The gap between what things cost and what families earn
              is <strong>{fmt$(cost.income_gap)} every year</strong>.
            </p>
          </div>
        )}

        {/* Source note */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#bbb', lineHeight: 1.6, margin: 0 }}>
            Costs reflect a reference household (1 adult, 1 child) using local housing costs + USDA food plan + MTA transportation + ACA healthcare + licensed childcare estimates.
            NYC and U.S. averages from MIT Living Wage Calculator 2024. Median income from ACS 2022 5-year estimates.
          </p>
        </div>
      </div>
    </section>
  );
};

interface NeighborhoodPageProps {
  selectedZip: string | null;
  onNavigate: (page: string) => void;
  onReturn: () => void;
}

interface NeighborhoodProfile {
  zip: string;
  nta_code: string;
  nta_name: string;
  city: string;
  state: string;
  tractCount: number;
  residentialWeight: number;
  totalWeight: number;
  tracts: string[];
  wwli: number;
  residentialBurden: number;
  structuralWeight: number;
  wwliTier: 'low' | 'moderate' | 'high';
}

interface SignalData {
  story_count: number;
  avg_confidence: number | null;
  sbi_score: number | null;
  signals: {
    economic_instability:   number | null;
    healthcare_access:      number | null;
    insurance_instability:  number | null;
    food_environment:       number | null;
    environmental_exposure: number | null;
    neighborhood_safety:    number | null;
    education_literacy:     number | null;
    justice_system:         number | null;
    mental_health:          number | null;
    substance_use:          number | null;
    social_support:         number | null;
    structural_barriers:    number | null;
  } | null;
}

interface SubmittedStory {
  id: string;
  zip_code: string;
  role: string;
  condition: string | null;
  story_text: string;
  themes: string[];
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const WWLI_COLOR = {
  low:      '#4a7c59',
  moderate: '#c89a54',
  high:     '#c45a3b',
};

const WWLI_LABEL = {
  low:      'Lower relative burden',
  moderate: 'Moderate structural burden',
  high:     'High structural burden',
};

// ── Structural burden — plain-language signal categories ──────────────────────

const SB_CATEGORIES = [
  {
    key: 'economic',
    label: 'Money & Stability',
    color: '#c45a3b',
    bg: '#fef5f2',
    borderColor: '#f5c2b2',
    description: 'Financial stress people mention day-to-day',
    signals: [
      { key: 'economic_instability',  plainName: 'Money stress & job insecurity',  desc: 'Not having enough for rent, bills, or food — or living in fear of losing work',           weight: 0.200 },
      { key: 'insurance_instability', plainName: 'Losing or lacking insurance',     desc: 'Coverage gaps, dropped plans, can\'t afford premiums, care denied',                      weight: 0.150 },
      { key: 'food_environment',      plainName: 'Hard to find healthy food',        desc: 'Food deserts, corner stores only, fresh produce too far or too expensive',               weight: 0.100 },
    ],
  },
  {
    key: 'healthcare',
    label: 'Getting Medical Care',
    color: '#2563eb',
    bg: '#eff6ff',
    borderColor: '#bfdbfe',
    description: 'What gets in the way of seeing a doctor',
    signals: [
      { key: 'healthcare_access',   plainName: 'Can\'t reach a doctor',     desc: 'No nearby specialists, no transportation, months-long waits for an appointment',        weight: 0.200 },
      { key: 'structural_barriers', plainName: 'Systems blocking care',      desc: 'Paperwork, language barriers, prior authorizations, insurance denials stopping treatment', weight: 0.100 },
    ],
  },
  {
    key: 'environment',
    label: 'Where You Live',
    color: '#16a34a',
    bg: '#f0fdf4',
    borderColor: '#bbf7d0',
    description: 'The physical conditions of home and neighborhood',
    signals: [
      { key: 'environmental_exposure', plainName: 'Pollution & unsafe housing',  desc: 'Lead paint, mold, industrial pollution, living near highways or waste sites',          weight: 0.100 },
      { key: 'neighborhood_safety',    plainName: 'Safety concerns outside',      desc: 'Avoiding going out, stress from violence exposure, fear affecting daily health choices', weight: 0.050 },
    ],
  },
  {
    key: 'social',
    label: 'Life Circumstances',
    color: '#7c3aed',
    bg: '#faf5ff',
    borderColor: '#ddd6fe',
    description: 'Social, mental, and systemic pressures',
    signals: [
      { key: 'mental_health',      plainName: 'Mental health struggles',         desc: 'Depression, anxiety, or trauma that intersect with managing a chronic illness',        weight: 0.050 },
      { key: 'education_literacy', plainName: 'Understanding the health system',  desc: 'Difficulty grasping diagnoses, navigating paperwork, or communicating with providers', weight: 0.050 },
      { key: 'justice_system',     plainName: 'Contact with police or courts',    desc: 'Incarceration history or immigration fears that stop people from seeking care',        weight: 0.050 },
      { key: 'social_support',     plainName: 'Feeling alone',                    desc: 'No family nearby, no one to drive to appointments, isolated from support',             weight: 0.025 },
      { key: 'substance_use',      plainName: 'Substance use context',            desc: 'Patterns that intersect with health — not judgment, just context the stories share',   weight: 0.025 },
    ],
  },
] as const;

// ── Donut chart helpers ───────────────────────────────────────────────────────

function ptOnCircle(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutArc(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, endDeg: number
): string {
  const sweep = endDeg - startDeg;
  if (sweep <= 0) return '';
  const large = sweep > 180 ? 1 : 0;
  const o1 = ptOnCircle(cx, cy, outerR, startDeg);
  const o2 = ptOnCircle(cx, cy, outerR, endDeg);
  const i1 = ptOnCircle(cx, cy, innerR, endDeg);
  const i2 = ptOnCircle(cx, cy, innerR, startDeg);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

// Category weight totals (normalized to 100% for the ghost donut)
const CAT_WEIGHTS = { economic: 0.45, healthcare: 0.30, environment: 0.15, social: 0.20 };
const CAT_WEIGHT_TOTAL = Object.values(CAT_WEIGHTS).reduce((a, b) => a + b, 0);

type SignalKey = keyof NonNullable<SignalData['signals']>;

function categoryScore(
  catKey: string,
  signals: NonNullable<SignalData['signals']>
): number {
  const cat = SB_CATEGORIES.find(c => c.key === catKey);
  if (!cat) return 0;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const sig of cat.signals) {
    const v = signals[sig.key as SignalKey];
    if (v !== null && v !== undefined) {
      weightedSum += v * sig.weight;
      totalWeight += sig.weight;
    }
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

interface DonutProps {
  signalData: SignalData | null;
}

const BurdenDonut: React.FC<DonutProps> = ({ signalData }) => {
  const hasData = signalData && signalData.story_count > 0 && signalData.signals;
  const cx = 95; const cy = 95; const outerR = 80; const innerR = 55; const GAP = 3;

  let segments: { key: string; startDeg: number; endDeg: number; color: string; ghost: boolean }[] = [];

  if (hasData && signalData.signals) {
    const sigs = signalData.signals;
    const scores = SB_CATEGORIES.map(c => ({
      key: c.key,
      color: c.color,
      score: categoryScore(c.key, sigs),
    }));
    const total = scores.reduce((s, c) => s + c.score, 0) || 1;
    let cursor = 0;
    scores.forEach((cat, i) => {
      const sweep = (cat.score / total) * (360 - GAP * SB_CATEGORIES.length);
      const start = cursor + (i > 0 ? GAP : 0);
      segments.push({ key: cat.key, startDeg: start, endDeg: start + sweep, color: cat.color, ghost: false });
      cursor = start + sweep;
    });
  } else {
    // Ghost donut — proportional to category weights
    let cursor = 0;
    SB_CATEGORIES.forEach((cat, i) => {
      const pct = CAT_WEIGHTS[cat.key as keyof typeof CAT_WEIGHTS] / CAT_WEIGHT_TOTAL;
      const sweep = pct * (360 - GAP * SB_CATEGORIES.length);
      const start = cursor + (i > 0 ? GAP : 0);
      segments.push({ key: cat.key, startDeg: start, endDeg: start + sweep, color: cat.color, ghost: true });
      cursor = start + sweep;
    });
  }

  const sbi = hasData && signalData.sbi_score !== null
    ? Math.round(signalData.sbi_score * 100)
    : null;

  return (
    <div style={{ position: 'relative', width: 190, height: 190, flexShrink: 0 }}>
      <svg width="190" height="190" viewBox="0 0 190 190">
        {segments.map(seg => (
          <path
            key={seg.key}
            d={donutArc(cx, cy, outerR, innerR, seg.startDeg, seg.endDeg)}
            fill={seg.ghost ? seg.color : seg.color}
            opacity={seg.ghost ? 0.15 : 0.9}
          />
        ))}
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {sbi !== null ? (
          <>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 300, color: '#1a1a1a', lineHeight: 1 }}>{sbi}</span>
            <span style={{ fontFamily: 'system-ui', fontSize: 9, color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 3 }}>/ 100</span>
            <span style={{ fontFamily: 'system-ui', fontSize: 9, color: '#888', marginTop: 4, textAlign: 'center', maxWidth: 64 }}>overall burden score</span>
          </>
        ) : (
          <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#ccc', textAlign: 'center', maxWidth: 60 }}>No stories yet</span>
        )}
      </div>
    </div>
  );
};

// ── StructuralBurdenSection ───────────────────────────────────────────────────

interface StructuralBurdenProps {
  signalData: SignalData | null;
  neighborhoodName: string;
  onNavigate: (page: string) => void;
}

const StructuralBurdenSection: React.FC<StructuralBurdenProps> = ({ signalData, neighborhoodName, onNavigate }) => {
  const hasData = signalData && signalData.story_count > 0 && signalData.signals;

  return (
    <section style={{ background: '#faf7f3', padding: '64px 48px', borderBottom: '1px solid #e8e4df' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 12,
          }}>
            What People Here Are Dealing With
          </div>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,36px)',
            fontWeight: 300, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 16,
          }}>
            {hasData
              ? `The pressures that show up in stories from ${neighborhoodName}`
              : `12 things that shape health in every neighborhood`}
          </h2>
          <p style={{
            fontFamily: 'system-ui', fontSize: 15, color: '#555',
            lineHeight: 1.75, maxWidth: 700, margin: 0,
          }}>
            {hasData
              ? `When community members share stories, we quietly read them for 12 kinds of pressure — things like money stress, trouble getting to a doctor, or feeling unsafe at home. The charts below show what comes up most often in ${neighborhoodName}.`
              : `When someone submits a story from this neighborhood, we read it for 12 kinds of structural pressure. Not to judge anyone — but to see patterns. Because when the same walls show up in story after story, that's a system problem, not a personal one.`}
          </p>
        </div>

        {/* Donut + category legend row */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 40, marginBottom: 48, flexWrap: 'wrap',
        }}>
          <BurdenDonut signalData={signalData} />

          {/* Category legend */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{
              fontFamily: 'system-ui', fontSize: 10, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: 16,
            }}>
              {hasData ? 'How the burden breaks down' : 'The four areas we track'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SB_CATEGORIES.map(cat => {
                const score = hasData && signalData.signals
                  ? Math.round(categoryScore(cat.key, signalData.signals) * 100)
                  : null;
                const pct = score !== null ? score : null;
                return (
                  <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{cat.label}</span>
                        {pct !== null && (
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: cat.color }}>{pct}</span>
                        )}
                      </div>
                      <div style={{ height: 6, background: '#e8e4df', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: pct !== null ? `${pct}%` : '100%',
                          background: pct !== null ? cat.color : 'transparent',
                          borderRadius: 3,
                          transition: 'width 0.7s ease',
                          opacity: pct !== null ? 1 : 0.12,
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!hasData && (
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => onNavigate('stories')}
                  style={{
                    fontFamily: 'system-ui', fontSize: 12, fontWeight: 600,
                    letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '10px 20px', background: '#c45a3b', color: '#fff',
                    border: 'none', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  Be the first to share a story →
                </button>
                <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#aaa', marginTop: 8 }}>
                  Every story adds signal to this chart.
                </p>
              </div>
            )}
            {hasData && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', lineHeight: 1.6, margin: 0 }}>
                  Based on <strong>{signalData.story_count}</strong> {signalData.story_count === 1 ? 'story' : 'stories'} from this neighborhood.
                  Each story is read by AI for these 12 patterns — nothing is identified or stored about who wrote it.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Category signal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {SB_CATEGORIES.map(cat => (
            <div key={cat.key} style={{
              background: '#fff',
              border: `1px solid ${cat.borderColor}`,
              borderTop: `4px solid ${cat.color}`,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              {/* Category header */}
              <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${cat.borderColor}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                  <span style={{
                    fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase', color: cat.color,
                  }}>
                    {cat.label}
                  </span>
                </div>
                <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', margin: '4px 0 0', lineHeight: 1.5 }}>
                  {cat.description}
                </p>
              </div>

              {/* Signals */}
              <div style={{ padding: '12px 20px 16px' }}>
                {cat.signals.map((sig, i) => {
                  const raw = hasData && signalData.signals
                    ? signalData.signals[sig.key as SignalKey]
                    : null;
                  const pct = raw !== null && raw !== undefined ? Math.round(raw * 100) : null;
                  const barColor = pct === null ? cat.color
                    : pct >= 67 ? '#dc2626'
                    : pct >= 34 ? '#d97706'
                    : '#16a34a';

                  return (
                    <div key={sig.key} style={{ marginTop: i === 0 ? 0 : 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                          {sig.plainName}
                        </span>
                        {pct !== null && (
                          <span style={{
                            fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 400,
                            color: barColor, marginLeft: 8, flexShrink: 0,
                          }}>
                            {pct}
                          </span>
                        )}
                      </div>
                      <div style={{ height: 6, background: '#f0ece6', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{
                          height: '100%',
                          width: pct !== null ? `${pct}%` : `${sig.weight * 100 * 3}%`,
                          background: pct !== null ? barColor : '#e0dbd5',
                          borderRadius: 3,
                          transition: 'width 0.6s ease',
                          opacity: pct !== null ? 1 : 0.4,
                        }} />
                      </div>
                      <p style={{ fontFamily: 'system-ui', fontSize: 10, color: '#aaa', lineHeight: 1.5, margin: 0 }}>
                        {pct !== null
                          ? (pct >= 67 ? 'Comes up often in stories from here'
                             : pct >= 34 ? 'Mentioned in some stories from here'
                             : 'Rarely mentioned in stories from here')
                          : sig.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#bbb', lineHeight: 1.7, margin: 0 }}>
            Bar values show how strongly each pattern appeared across stories (0 = not present, 100 = present in nearly every story).
            The overall burden score is a weighted average across all 12 signals.
            No individual story is shown or scored on its own — only patterns across the whole neighborhood.
          </p>
        </div>
      </div>
    </section>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────


const WwliGauge: React.FC<{ score: number; tier: 'low' | 'moderate' | 'high' }> = ({ score, tier }) => {
  const color = WWLI_COLOR[tier];
  const circumference = 2 * Math.PI * 52; // r=52
  const dash = (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="70" cy="70" r="52"
          fill="none"
          stroke="rgba(0,0,0,0.07)"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle cx="70" cy="70" r="52"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          fontWeight: '300',
          color: '#1a1a1a',
          lineHeight: 1
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '10px',
          color: '#aaa',
          marginTop: '4px'
        }}>
          / 100
        </span>
      </div>
    </div>
  );
};

const PatientStoryCard: React.FC<{ story: PatientStory; onNavigate: (page: string) => void }> = ({ story }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e8e4df',
    borderRadius: '4px',
    padding: '28px',
    position: 'relative',
    borderTop: `4px solid ${story.accentColor}`
  }}>
    <div style={{
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      fontWeight: '600',
      color: story.accentColor,
      marginBottom: '4px'
    }}>{story.name}</div>
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      color: '#888',
      marginBottom: '16px'
    }}>
      {story.profile.age} · {story.profile.ethnicity} · {story.diagnosisShort}
    </div>
    <p style={{
      fontFamily: 'Georgia, serif',
      fontSize: '15px',
      fontStyle: 'italic',
      color: '#333',
      lineHeight: '1.65',
      borderLeft: `3px solid ${story.accentColor}`,
      paddingLeft: '16px',
      margin: 0
    }}>
      &ldquo;{story.pullQuotes[0].substring(0, 180)}{story.pullQuotes[0].length > 180 ? '…' : ''}&rdquo;
    </p>
  </div>
);

const SubmittedStoryCard: React.FC<{ story: SubmittedStory }> = ({ story }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e8e4df',
    borderRadius: '4px',
    padding: '28px',
    borderTop: '4px solid #c45a3b'
  }}>
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    }}>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 10px',
        background: '#f5f5f5',
        borderRadius: '3px',
        color: '#666',
        textTransform: 'capitalize'
      }}>{story.role}</span>
      {story.condition && (
        <span style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: '600',
          padding: '3px 10px',
          background: '#c45a3b',
          borderRadius: '3px',
          color: '#fff'
        }}>{story.condition}</span>
      )}
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        padding: '3px 10px',
        background: '#eef7f0',
        borderRadius: '3px',
        color: '#2e7d52'
      }}>Community voice</span>
    </div>
    <p style={{
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      lineHeight: '1.7',
      color: '#333',
      margin: 0
    }}>
      {story.story_text}
    </p>
    {story.themes?.length > 0 && (
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f0f0f0'
      }}>
        {story.themes.map((t, i) => (
          <span key={i} style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: '#888'
          }}>{t}{i < story.themes.length - 1 ? ' ·' : ''}</span>
        ))}
      </div>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const NeighborhoodPage: React.FC<NeighborhoodPageProps> = ({ selectedZip, onNavigate, onReturn }) => {
  const [neighborhood, setNeighborhood] = useState<NeighborhoodProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const [submittedStories, setSubmittedStories] = useState<SubmittedStory[]>([]);
  const [costData, setCostData] = useState<CostEntry | null>(null);

  // Fetch neighborhood geo profile
  useEffect(() => {
    if (!selectedZip) { setError('No ZIP code selected'); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/geo/neighborhood-profile?zip=${selectedZip}`)
      .then(r => r.json())
      .then(result => {
        if (result.success && result.data) {
          setNeighborhood(result.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(err => { setError(err.message); setNeighborhood(null); })
      .finally(() => setLoading(false));
  }, [selectedZip]);

  // Fetch AI signal data
  useEffect(() => {
    if (!selectedZip) return;
    fetch(`/api/stories/signals-by-zip?zip=${selectedZip}`)
      .then(r => r.json())
      .then(data => { if (data.success) setSignalData(data); })
      .catch(console.error);
  }, [selectedZip]);

  // Fetch cost of living data
  useEffect(() => {
    if (!selectedZip) return;
    fetch(`/api/cost-of-living?geo_id=${selectedZip}`)
      .then(r => r.json())
      .then(data => { if (data.success) setCostData(data.data); })
      .catch(console.error);
  }, [selectedZip]);

  // Fetch user-submitted stories
  useEffect(() => {
    if (!selectedZip) return;
    fetch(`/api/stories/by-zip?zip=${selectedZip}`)
      .then(r => r.json())
      .then(data => { if (data.success && Array.isArray(data.stories)) setSubmittedStories(data.stories); })
      .catch(console.error);
  }, [selectedZip]);

  // Curated patient stories
  const neighborhoodStories: PatientStory[] = [];
  if (neighborhood) {
    const hood = getNeighborhoodForZip(neighborhood.zip);
    neighborhoodStories.push(...patientStories.filter(s =>
      s.neighborhood.toLowerCase() === hood.toLowerCase()
    ));
  }

  const totalStories = neighborhoodStories.length + submittedStories.length;

  // ── Loading / error ───────────────────────────────────────────────────────
  if (loading || error || !neighborhood) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#faf7f3' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '80px 32px',
          textAlign: 'center'
        }}>
          <button onClick={onReturn} style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            color: '#888',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '0 auto 32px'
          }}>← Back to Map</button>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: loading ? '#1a1a1a' : '#c45a3b',
            marginBottom: '12px'
          }}>
            {loading ? 'Loading…' : 'Unable to load neighborhood'}
          </p>
          {error && (
            <p style={{ fontFamily: 'system-ui', fontSize: '14px', color: '#666' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  const wwliColor = WWLI_COLOR[neighborhood.wwliTier];

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <section style={{
        background: '#faf7f3',
        padding: '48px 48px 0',
        borderBottom: `3px solid ${wwliColor}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Back + share */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button onClick={onReturn} style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '1px',
              color: '#888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>← Back to Map</button>

            <button onClick={() => onNavigate('stories')} style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '10px 20px',
              background: '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}>
              Share a story for {neighborhood.zip}
            </button>
          </div>

          {/* Neighborhood name + WWLI gauge */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '48px',
            alignItems: 'end',
            paddingBottom: '48px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '12px'
              }}>
                Neighborhood Profile · {neighborhood.city}, {neighborhood.state}
              </div>

              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: '300',
                color: '#1a1a1a',
                lineHeight: '1.1',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                {neighborhood.nta_name}
              </h1>

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                color: '#666'
              }}>
                ZIP {neighborhood.zip} · {neighborhood.tractCount} census tract{neighborhood.tractCount !== 1 ? 's' : ''}
              </p>

              {/* WWLI breakdown pills */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '28px',
                flexWrap: 'wrap'
              }}>
                {[
                  { label: 'Structural Weight', value: neighborhood.structuralWeight, note: '60% of WWLI' },
                  { label: 'Residential Burden', value: neighborhood.residentialBurden, note: '40% of WWLI' },
                ].map(({ label, value, note }) => (
                  <div key={label} style={{
                    background: '#fff',
                    border: '1px solid #e8e4df',
                    borderRadius: '4px',
                    padding: '12px 16px'
                  }}>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '22px',
                      fontWeight: '300',
                      color: '#1a1a1a'
                    }}>
                      {value}<span style={{ fontSize: '13px', color: '#aaa', marginLeft: '2px' }}>/100</span>
                    </div>
                    <div style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '11px',
                      color: '#444',
                      marginTop: '2px'
                    }}>{label}</div>
                    <div style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '10px',
                      color: '#aaa',
                      marginTop: '2px'
                    }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gauge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <WwliGauge score={neighborhood.wwli} tier={neighborhood.wwliTier} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: wwliColor,
                  marginBottom: '2px'
                }}>
                  Where We Live Index
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  {WWLI_LABEL[neighborhood.wwliTier]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WWLI Methodology ──────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '20px 48px', borderBottom: '1px solid #e8e4df' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#c45a3b',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              paddingTop: '2px',
              flexShrink: 0
            }}>
              WWLI Formula:
            </span>
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              color: '#666',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}>
              (Structural Weight × 0.60) + (Residential Burden × 0.40) — derived from census tract geographic weights.
              Higher scores indicate greater concentration of structural burden in this ZIP code.
              Tiers: 0–33 lower · 34–66 moderate · 67–100 high.
            </span>
          </div>
        </div>
      </section>

      {/* ── COST OF LIVING ────────────────────────────────────────── */}
      {costData && (
        <WhatItCosts cost={costData} neighborhoodName={neighborhood.nta_name} />
      )}

      {/* ── STRUCTURAL BURDEN ─────────────────────────────────────── */}
      <StructuralBurdenSection
        signalData={signalData}
        neighborhoodName={neighborhood.nta_name}
        onNavigate={onNavigate}
      />

      {/* ── STORIES ───────────────────────────────────────────────── */}
      <section style={{ padding: '64px 48px 80px', background: '#faf7f3' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '12px'
              }}>
                Community Voices
              </div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: '400',
                color: '#1a1a1a',
                marginBottom: '4px'
              }}>
                What Patients & Caregivers Report
              </h2>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#888'
              }}>
                {totalStories} submission{totalStories !== 1 ? 's' : ''} from {neighborhood.nta_name}
              </p>
            </div>
          </div>

          {totalStories === 0 ? (
            <div style={{
              padding: '64px 32px',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '4px',
              border: '1px dashed #d0c8c0'
            }}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                color: '#888',
                marginBottom: '12px'
              }}>
                No stories yet for this neighborhood.
              </p>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#aaa',
                marginBottom: '28px'
              }}>
                Every submission adds signal to the index above.
              </p>
              <button
                onClick={() => onNavigate('stories')}
                style={{
                  padding: '12px 28px',
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Share your story
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {neighborhoodStories.map(story => (
                <PatientStoryCard key={story.id} story={story} onNavigate={onNavigate} />
              ))}
              {submittedStories.map(story => (
                <SubmittedStoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          {/* Ethics note */}
          <div style={{
            marginTop: '40px',
            padding: '20px 24px',
            background: '#fff',
            borderRadius: '4px',
            borderLeft: '3px solid #d0c8c0'
          }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              color: '#888',
              lineHeight: '1.7',
              margin: 0
            }}>
              <strong style={{ color: '#666' }}>How stories are shown:</strong> Submissions are
              anonymous by default, tied to neighborhood rather than individual identity.
              Where We Live never publishes identifying details. AI signal extraction runs
              on aggregated patterns — individual stories are not scored in isolation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
