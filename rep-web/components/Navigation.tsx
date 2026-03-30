'use client';

import React, { useState } from 'react';
import { useHamburger } from '@/hooks/useResponsive';

interface NavItem {
  id: string;
  label: string;
  children?: NavItem[];
}

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { isOpen, toggle, close } = useHamburger();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'stories', label: 'Stories' },
    { id: 'map', label: 'Map Explorer' },
    { id: 'methods', label: 'Methods' },
    {
      id: 'kidney-disease',
      label: 'Kidney Disease',
      children: [
        { id: 'kidney-disease-overview', label: 'Overview' },
        { id: 'apol1', label: 'APOL1' },
        { id: 'fsgs', label: 'FSGS' }
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
                    {item.label}
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
                              {child.label}
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
                              {child.label}
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
        </div>
      </div>
    </nav>
  );
};
