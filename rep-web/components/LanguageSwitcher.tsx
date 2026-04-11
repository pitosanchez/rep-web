'use client';

import { useLocale } from 'next-intl';
import React from 'react';

interface LanguageSwitcherProps {
  currentPage?: string;
}

export function LanguageSwitcher({ currentPage }: LanguageSwitcherProps) {
  const locale = useLocale();

  const switchTo = (newLocale: string) => {
    if (newLocale === locale) return;
    const pageParam = currentPage && currentPage !== 'home' ? `?page=${encodeURIComponent(currentPage)}` : '';
    window.location.href = `/${newLocale}${pageParam}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.06)',
      borderRadius: '6px',
      padding: '3px',
      gap: '2px'
    }}>
      {(['en', 'es'] as const).map((code) => {
        const label = code === 'en' ? 'ENG' : 'SPA';
        const isActive = locale === code;
        return (
          <button
            key={code}
            onClick={() => switchTo(code)}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: isActive ? '700' : '500',
              letterSpacing: '0.5px',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '4px',
              cursor: isActive ? 'default' : 'pointer',
              background: isActive ? '#1a1a1a' : 'transparent',
              color: isActive ? '#fff' : '#888',
              transition: 'all 0.2s ease',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = '#888';
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
