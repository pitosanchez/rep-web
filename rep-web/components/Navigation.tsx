import React from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => (
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <button
        onClick={() => onNavigate('home')}
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
        }}>REP</span>
        <span style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '13px',
          color: '#666',
          fontWeight: '400'
        }}>Rare Renal Equity Project</span>
      </button>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'map', label: 'Map Explorer' },
          { id: 'stories', label: 'Stories' },
          { id: 'about', label: 'About' },
          { id: 'methods', label: 'Methods' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: currentPage === item.id ? '#1a1a1a' : '#666',
              fontWeight: currentPage === item.id ? '500' : '400',
              cursor: 'pointer',
              padding: '4px 0',
              borderBottom: currentPage === item.id ? '2px solid #c45a3b' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);
