'use client';

import React, { useState } from 'react';
import { neighborhoods, Neighborhood } from '@/lib/mockData';
import MapLibreMap from '@/components/MapLibreMap';

interface MapPageProps {
  selectedZip: string | null;
  onSelectZip: (zip: string) => void;
  onNavigate: (page: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ selectedZip, onSelectZip, onNavigate }) => {
  const [visibleLayers, setVisibleLayers] = useState({
    diseaseBurden: true,
    careAccess: false,
    environmentalExposure: false,
    transit: false
  });

  const handleLayerToggle = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
  <div style={{ paddingTop: '80px' }}>
    <section style={{
      padding: '48px 32px 24px',
      background: '#faf7f3'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '12px'
        }}>Map Explorer</h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: '#666',
          maxWidth: '600px'
        }}>
          Explore APOL1 and FSGS context by neighborhood. Stories appear as
          aggregated themes tied to place.
        </p>
      </div>
    </section>

    <section style={{
      padding: 'clamp(16px, 5vw, 32px)',
      background: '#fff',
      minHeight: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1.6fr))',
        gap: 'clamp(16px, 4vw, 32px)'
      }}>
        {/* Map Container */}
        <div style={{
          borderRadius: '12px',
          position: 'relative',
          minHeight: 'clamp(300px, 60vw, 500px)',
          overflow: 'hidden'
        }}>
          <MapLibreMap
            selectedZip={selectedZip}
            onZipClick={(zip) => {
              onSelectZip(zip);
              onNavigate('neighborhood');
            }}
            visibleLayers={visibleLayers}
          />

          {/* Layer controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: '#fff',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 20
          }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#888',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>Layers</div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#444',
              marginBottom: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={visibleLayers.diseaseBurden}
                onChange={() => handleLayerToggle('diseaseBurden')}
                style={{ accentColor: '#c45a3b' }}
              />
              Disease Burden
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#444',
              marginBottom: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={visibleLayers.careAccess}
                onChange={() => handleLayerToggle('careAccess')}
                style={{ accentColor: '#c45a3b' }}
              />
              Care Access
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#444',
              marginBottom: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={visibleLayers.environmentalExposure}
                onChange={() => handleLayerToggle('environmentalExposure')}
                style={{ accentColor: '#c45a3b' }}
              />
              Environmental Exposure
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#444',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={visibleLayers.transit}
                onChange={() => handleLayerToggle('transit')}
                style={{ accentColor: '#c45a3b' }}
              />
              Transit
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            background: '#faf7f3',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#888',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>How to use</div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>Click a ZIP to open its profile</div>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: '#666'
            }}>
              Each profile shows disease context, structural conditions,
              and aggregated patient/caregiver reports.
            </p>
          </div>

          {/* Neighborhood cards */}
          {neighborhoods.map(n => (
            <NeighborhoodCard
              key={n.zip}
              neighborhood={n}
              isSelected={selectedZip === n.zip}
              onSelect={() => {
                onSelectZip(n.zip);
                onNavigate('neighborhood');
              }}
            />
          ))}

        </div>
      </div>
    </section>
  </div>
  );
};

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  isSelected: boolean;
  onSelect: () => void;
}

const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ neighborhood, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    style={{
      background: '#fff',
      border: '1px solid #e8e4df',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#c45a3b';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 90, 59, 0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#e8e4df';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    }}>
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#1a1a1a'
      }}>{neighborhood.name}</div>
      <div style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        fontWeight: '600',
        color: '#c45a3b'
      }}>{neighborhood.zip}</div>
    </div>
    <div style={{
      display: 'flex',
      gap: '16px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#666'
    }}>
      <span>Burden: <strong style={{ color: '#1a1a1a' }}>{neighborhood.burdenIndex}</strong></span>
      <span>Travel: <strong style={{ color: '#1a1a1a' }}>{neighborhood.avgTravel}m</strong></span>
      <span>Stories: <strong style={{ color: '#1a1a1a' }}>{neighborhood.storyCount}</strong></span>
    </div>
  </button>
);
