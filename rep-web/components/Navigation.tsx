'use client';

import React from 'react';
import { useHamburger } from '@/hooks/useResponsive';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { isOpen, toggle, close } = useHamburger();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'stories', label: 'Stories' },
    { id: 'map', label: 'Map Explorer' },
    { id: 'methods', label: 'Methods' },
    { id: 'apol1', label: 'APOL1' },
    { id: 'fsgs', label: 'FSGS' }
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
        <button
          onClick={() => handleNavClick('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px'
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

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            className="hamburger-btn"
            onClick={toggle}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links${isOpen ? ' open' : ''}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: currentPage === item.id ? '#1a1a1a' : '#666',
                  fontWeight: currentPage === item.id ? '500' : '400',
                  cursor: 'pointer',
                  padding: isOpen ? '12px 24px' : '4px 0',
                  borderBottom: !isOpen && currentPage === item.id ? '2px solid #c45a3b' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
