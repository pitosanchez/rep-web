'use client';

/**
 * NeighborhoodCostDashboard
 *
 * Displays cost-of-living breakdown and structural strain for a ZIP code.
 * Fetches from /api/neighborhood-summary?geo_id=ZIP.
 *
 * Design tokens:
 *   Housing    → #dc2626 (red)
 *   Food       → #d97706 (orange)
 *   Transport  → #2563eb (blue)
 *   Healthcare → #16a34a (green)
 *   Childcare  → #7c3aed (purple)
 *   Other      → #6b7280 (gray)
 */

import React, { useEffect, useState } from 'react';

interface CostBreakdown {
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  childcare: number;
  other: number;
}

interface NeighborhoodSummary {
  zip: string;
  neighborhood: string;
  cost_of_living: {
    costs: CostBreakdown;
    required_income: number;
    median_income: number;
    income_gap: number;
    cost_burden_ratio: number;
  };
  adi: {
    adi_percentile: number;
    deprivation_tier: string;
  };
  structural_strain: {
    ssi: number;
    tier: 'lower' | 'moderate' | 'high';
  };
}

const COST_COLORS: Record<keyof CostBreakdown, string> = {
  housing:    '#dc2626',
  food:       '#d97706',
  transport:  '#2563eb',
  healthcare: '#16a34a',
  childcare:  '#7c3aed',
  other:      '#6b7280',
};

const COST_LABELS: Record<keyof CostBreakdown, string> = {
  housing:    'Housing',
  food:       'Food',
  transport:  'Transport',
  healthcare: 'Healthcare',
  childcare:  'Childcare',
  other:      'Other',
};

const CATEGORY_ORDER: (keyof CostBreakdown)[] = [
  'housing', 'childcare', 'food', 'healthcare', 'transport', 'other'
];

function formatDollar(n: number): string {
  return '$' + n.toLocaleString();
}

function SkeletonLine({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  return (
    <div style={{
      width,
      height,
      background: 'linear-gradient(90deg, #f0ece6 25%, #e8e2da 50%, #f0ece6 75%)',
      backgroundSize: '200% 100%',
      borderRadius: 4,
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

interface StackedBarProps {
  costs: CostBreakdown;
}

function StackedCostBar({ costs }: StackedBarProps) {
  const total = CATEGORY_ORDER.reduce((s, k) => s + costs[k], 0);
  return (
    <div>
      {/* Bar */}
      <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
        {CATEGORY_ORDER.map(k => {
          const pct = (costs[k] / total) * 100;
          return (
            <div
              key={k}
              title={`${COST_LABELS[k]}: ${formatDollar(costs[k])}/mo (${pct.toFixed(0)}%)`}
              style={{
                width: `${pct}%`,
                background: COST_COLORS[k],
                transition: 'width 0.5s ease',
              }}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {CATEGORY_ORDER.map(k => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: COST_COLORS[k], flexShrink: 0 }} />
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, color: '#555' }}>
              {COST_LABELS[k]} <strong>{formatDollar(costs[k])}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface IncomeBarProps {
  required_income: number;
  median_income: number;
}

function IncomeComparisonBar({ required_income, median_income }: IncomeBarProps) {
  const max = Math.max(required_income, median_income) * 1.08;
  const reqPct = (required_income / max) * 100;
  const medPct = (median_income / max) * 100;

  return (
    <div>
      {/* Required */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Required Income
          </span>
          <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>
            {formatDollar(required_income)}/yr
          </span>
        </div>
        <div style={{ height: 10, background: '#f0ece6', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${reqPct}%`, height: '100%', background: '#dc2626', borderRadius: 5, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      {/* Median */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'system-ui', fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Median Income
          </span>
          <span style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>
            {formatDollar(median_income)}/yr
          </span>
        </div>
        <div style={{ height: 10, background: '#f0ece6', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${medPct}%`, height: '100%', background: '#2563eb', borderRadius: 5, transition: 'width 0.6s ease' }} />
        </div>
      </div>
    </div>
  );
}



interface SsiGaugeProps {
  ssi: number;
  tier: string;
}

function SsiGauge({ ssi, tier }: SsiGaugeProps) {
  const tierColor = tier === 'high' ? '#dc2626' : tier === 'moderate' ? '#d97706' : '#16a34a';
  const tierLabel = tier === 'high' ? 'High Strain' : tier === 'moderate' ? 'Moderate Strain' : 'Lower Strain';
  const pct = ssi;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Number */}
      <div style={{ textAlign: 'center', minWidth: 64 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, color: tierColor, lineHeight: 1 }}>
          {ssi.toFixed(0)}
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 9, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>
          / 100
        </div>
      </div>
      {/* Bar + label */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            color: tierColor, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {tierLabel}
          </span>
        </div>
        <div style={{ height: 8, background: '#f0ece6', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: `linear-gradient(to right, #16a34a, #d97706, #dc2626)`,
            borderRadius: 4,
            transition: 'width 0.6s ease',
            backgroundSize: '300px 100%',
            backgroundPosition: `${(100 - pct) * -3}px 0`,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontFamily: 'system-ui', fontSize: 9, color: '#bbb' }}>Lower</span>
          <span style={{ fontFamily: 'system-ui', fontSize: 9, color: '#bbb' }}>High</span>
        </div>
      </div>
    </div>
  );
}

interface NeighborhoodCostDashboardProps {
  zip: string;
  /** Optional: compact mode for inline use inside NeighborhoodPage */
  compact?: boolean;
}

export default function NeighborhoodCostDashboard({ zip, compact = false }: NeighborhoodCostDashboardProps) {
  const [data, setData] = useState<NeighborhoodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zip) return;
    setLoading(true);
    setError(null);

    fetch(`/api/neighborhood-summary?geo_id=${zip}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.error || 'Failed to load data');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [zip]);

  const containerStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: compact ? 8 : 0,
    padding: compact ? '20px' : '32px',
    fontFamily: 'system-ui, sans-serif',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        <SkeletonLine width="40%" height={12} />
        <div style={{ marginTop: 12 }}><SkeletonLine width="100%" height={28} /></div>
        <div style={{ marginTop: 20 }}><SkeletonLine width="60%" height={12} /></div>
        <div style={{ marginTop: 8 }}><SkeletonLine width="100%" height={10} /></div>
        <div style={{ marginTop: 8 }}><SkeletonLine width="100%" height={10} /></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#c45a3b', fontSize: 13, margin: 0 }}>
          {error || 'No data available for this ZIP code.'}
        </p>
      </div>
    );
  }

  const { cost_of_living: col, adi, structural_strain } = data;
  const monthly_total = Object.values(col.costs).reduce((a, b) => a + b, 0);

  return (
    <div style={containerStyle}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* Section header */}
      {!compact && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 10, fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 6
          }}>
            Cost of Living Burden
          </div>
          <div style={{ width: 48, height: 1, background: '#c45a3b', marginBottom: 12 }} />
          <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>
            Monthly cost estimate for a reference household (1 adult + 1 child) in ZIP {data.zip}.
            A ratio above 1.0 means basic needs exceed median household income.
          </p>
        </div>
      )}

      {/* Monthly total callout */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: compact ? 28 : 36, fontWeight: 300, color: '#1a1a1a' }}>
          {formatDollar(monthly_total)}
        </span>
        <span style={{ fontFamily: 'system-ui', fontSize: 12, color: '#999' }}>/month</span>
        <span style={{
          marginLeft: 4,
          fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
          color: col.cost_burden_ratio > 1.5 ? '#dc2626' : col.cost_burden_ratio > 1.0 ? '#d97706' : '#16a34a',
          background: col.cost_burden_ratio > 1.5 ? '#fef2f2' : col.cost_burden_ratio > 1.0 ? '#fffbeb' : '#f0fdf4',
          padding: '2px 8px', borderRadius: 4,
        }}>
          {col.cost_burden_ratio.toFixed(2)}× ratio
        </span>
      </div>

      {/* Stacked cost bar */}
      <div style={{ marginBottom: 24 }}>
        <StackedCostBar costs={col.costs} />
      </div>

      {/* Income comparison */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'system-ui', fontSize: 10, fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: 12
        }}>
          Income vs. Required
        </div>
        <IncomeComparisonBar
          required_income={col.required_income}
          median_income={col.median_income}
        />
        {col.income_gap > 0 && (
          <div style={{
            marginTop: 10,
            padding: '8px 12px',
            background: '#fef2f2',
            borderLeft: '3px solid #dc2626',
            borderRadius: '0 4px 4px 0',
            fontFamily: 'system-ui', fontSize: 12, color: '#991b1b',
          }}>
            <strong>{formatDollar(col.income_gap)}</strong> annual shortfall — median income cannot cover basic needs
          </div>
        )}
      </div>

      {/* Structural Strain Index */}
      <div style={{
        padding: '16px',
        background: '#faf7f3',
        borderRadius: 8,
        marginBottom: compact ? 0 : 16,
      }}>
        <div style={{
          fontFamily: 'system-ui', fontSize: 10, fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: 12
        }}>
          Structural Strain Index
        </div>
        <SsiGauge ssi={structural_strain.ssi} tier={structural_strain.tier} />
        <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#888', lineHeight: 1.6, margin: '10px 0 0' }}>
          Weighted composite of cost burden ({Math.round(0.55 * 100)}%) and area deprivation ({Math.round(0.45 * 100)}%).
          ADI: {adi.adi_percentile}th national percentile.
        </p>
      </div>
    </div>
  );
}
