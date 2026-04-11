'use client';

/**
 * DataDisclaimer
 *
 * Persistent notice that map layers use proxy or modeled data —
 * not direct clinical measurements. Displayed on MapPage and NeighborhoodPage.
 */

import React, { useState } from 'react';

interface DataDisclaimerProps {
  /** Compact single-line variant for inline use */
  compact?: boolean;
}

export default function DataDisclaimer({ compact = false }: DataDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 12px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 6,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 11,
        color: '#78350f',
        lineHeight: 1.5,
      }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
        <span>
          Some layers use proxy or modeled data and do not represent direct clinical measurements.
          They reflect structural conditions, not individual outcomes or causation.{' '}
          <a href="#methods" style={{ color: '#92400e', fontWeight: 600 }}>Learn more</a>
        </span>
        <button
          onClick={() => setDismissed(true)}
          style={{
            marginLeft: 'auto', flexShrink: 0, background: 'none',
            border: 'none', cursor: 'pointer', color: '#92400e',
            fontSize: 14, lineHeight: 1, padding: 0,
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '14px 20px',
      background: '#fffbeb',
      border: '1px solid #fde68a',
      borderLeft: '4px solid #f59e0b',
      borderRadius: '0 6px 6px 0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: 12,
      color: '#78350f',
      lineHeight: 1.65,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠</span>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: 3, color: '#92400e' }}>
          Data Limitations
        </strong>
        Some layers on this map use proxy or modeled data and do not represent direct clinical
        measurements. They reflect structural conditions that are associated with health outcomes —
        not individual diagnoses, predictions, or causation. See the{' '}
        <span
          style={{ color: '#92400e', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Methods page
        </span>
        {' '}for full data sources and limitations.
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          flexShrink: 0, background: 'none', border: 'none',
          cursor: 'pointer', color: '#92400e', fontSize: 18, lineHeight: 1, padding: 0,
        }}
        aria-label="Dismiss disclaimer"
      >
        ×
      </button>
    </div>
  );
}
