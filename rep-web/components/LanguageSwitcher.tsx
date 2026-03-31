'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLocale = (newLocale: string) => {
    if (newLocale === locale) return;

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');

    // Build new pathname with new locale
    const newPathname = `/${newLocale}${pathWithoutLocale || ''}`;

    // Navigate to new locale path
    router.push(newPathname);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          color: '#666',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#1a1a1a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#666';
        }}
      >
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            border: '1px solid #e8e4df',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            minWidth: '140px',
            marginTop: '8px',
            zIndex: 1000
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLocale(lang.code)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: locale === lang.code ? '#faf7f3' : '#fff',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: locale === lang.code ? '#c45a3b' : '#666',
                fontWeight: locale === lang.code ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#faf7f3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = locale === lang.code ? '#faf7f3' : '#fff';
              }}
            >
              <span style={{ marginRight: '8px' }}>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
