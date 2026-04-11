'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useHamburger } from '@/hooks/useResponsive';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface NavItem {
  id: string;
  labelKey: string;
  children?: NavItem[];
}

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { isOpen, toggle, close } = useHamburger();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const t = useTranslations('nav');

  const navItems: NavItem[] = [
    { id: 'home', labelKey: 'home' },
    { id: 'about', labelKey: 'about' },
    { id: 'stories', labelKey: 'stories' },
    { id: 'map', labelKey: 'map' },
    { id: 'methods', labelKey: 'methods' },
    {
      id: 'kidney-disease',
      labelKey: 'kidneyDisease',
      children: [
        { id: 'kidney-disease-overview', labelKey: 'overview' },
        { id: 'apol1', labelKey: 'apol1' },
        { id: 'fsgs', labelKey: 'fsgs' }
      ]
    }
  ];

  const handleNavClick = (page: string) => {
    close();
    onNavigate(page);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(250, 247, 243, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)'
    }}>
      <div className="nav-inner">
        {/* Logo — left */}
        <button
          onClick={() => handleNavClick('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            flexShrink: 0
          }}
        >
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            letterSpacing: '-0.5px'
          }}>Where We Live</span>
        </button>

        {/* Nav links — center */}
        <div className={`nav-links${isOpen ? ' open' : ''}`}>
          {navItems.map(item => {
            const isActive = item.children
              ? item.children.some(child => currentPage === child.id)
              : currentPage === item.id;

            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  display: isOpen ? 'block' : 'inline-block'
                }}
                onMouseEnter={() => !isOpen && item.children && setOpenDropdown(item.id)}
                onMouseLeave={() => !isOpen && setOpenDropdown(null)}
              >
                <button
                  onClick={() => {
                    if (item.children) {
                      if (isOpen) {
                        setOpenDropdown(openDropdown === item.id ? null : item.id);
                      } else {
                        handleNavClick(item.id);
                      }
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    color: isActive ? '#1a1a1a' : '#666',
                    fontWeight: isActive ? '500' : '400',
                    cursor: 'pointer',
                    padding: isOpen ? '12px 24px' : '4px 0',
                    borderBottom: !isOpen && isActive ? '2px solid #c45a3b' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {t(item.labelKey)}
                  {item.children && (
                    <span style={{
                      fontSize: '10px',
                      transition: 'transform 0.2s ease',
                      transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  )}
                </button>

                {item.children && (
                  <>
                    {!isOpen && (
                      <div className="nav-dropdown" style={{
                        display: openDropdown === item.id ? 'flex' : 'none'
                      }}>
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            className={`nav-dropdown-item${currentPage === child.id ? ' active' : ''}`}
                            onClick={() => handleNavClick(child.id)}
                          >
                            {t(child.labelKey)}
                          </button>
                        ))}
                      </div>
                    )}
                    {isOpen && (
                      <div>
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            className={`nav-dropdown-item${currentPage === child.id ? ' active' : ''}`}
                            onClick={() => handleNavClick(child.id)}
                          >
                            {t(child.labelKey)}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Right side — share CTA + hamburger (mobile) + language switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => handleNavClick('share-story')}
            style={{
              background: '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.3px',
              padding: '8px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#a84832'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c45a3b'; }}
          >
            Share Your Story
          </button>
          <button
            className="hamburger-btn"
            onClick={toggle}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};
