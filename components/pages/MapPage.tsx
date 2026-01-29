import React from 'react';
import { neighborhoods, Neighborhood } from '@/lib/mockData';

interface MapPageProps {
  selectedZip: string | null;
  onSelectZip: (zip: string) => void;
  onNavigate: (page: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ selectedZip, onSelectZip, onNavigate }) => (
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
      padding: '32px',
      background: '#fff',
      minHeight: '70vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '32px'
      }}>
        {/* Map Container */}
        <div style={{
          background: '#e8e4df',
          borderRadius: '12px',
          position: 'relative',
          minHeight: '500px',
          overflow: 'hidden'
        }}>
          {/* Mock map background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(135deg, #d4cfc7 0%, #e8e4df 50%, #d4cfc7 100%)
            `,
            opacity: 0.8
          }} />

          {/* Grid lines for map feel */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />

          {/* "Bronx" label */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            color: '#888',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            South Bronx, NY
          </div>

          {/* ZIP markers */}
          {neighborhoods.map(n => (
            <button
              key={n.zip}
              onClick={() => {
                onSelectZip(n.zip);
                onNavigate('neighborhood');
              }}
              style={{
                position: 'absolute',
                top: n.coords.top,
                left: n.coords.left,
                transform: 'translate(-50%, -50%)',
                background: selectedZip === n.zip ? '#c45a3b' : '#fff',
                color: selectedZip === n.zip ? '#fff' : '#1a1a1a',
                border: '2px solid ' + (selectedZip === n.zip ? '#c45a3b' : '#1a1a1a'),
                borderRadius: '20px',
                padding: '8px 16px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
            >
              {n.zip}
            </button>
          ))}

          {/* Layer controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: '#fff',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
            {['Disease Burden', 'Care Access', 'Environmental Exposure', 'Transit'].map((layer, i) => (
              <label key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#444',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
                <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: '#c45a3b' }} />
                {layer}
              </label>
            ))}
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

          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            color: '#888',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <strong>Note:</strong> Coordinates are illustrative. Production version
            uses ZIP/tract polygons via PostGIS + GeoJSON.
          </div>
        </div>
      </div>
    </section>
  </div>
);

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
