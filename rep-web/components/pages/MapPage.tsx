'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MapLibreMap from '@/components/MapLibreMap';

interface ZipToTractRow {
  zip: string;
  nta_code: string;
  nta_name: string;
  weight_res: number;
  weight_tot: number;
  [key: string]: string | number | boolean | unknown;
}

interface MapPageProps {
  selectedZip: string | null;
  onSelectZip: (zip: string) => void;
  onNavigate: (page: string) => void;
}

const layerColors = {
  diseaseBurden: {
    nameKey: 'diseaseBurden' as const,
    accent: '#a83d25',
    gradient: 'linear-gradient(to right, #6ab576, #c89a54, #a83d25)'
  },
  careAccess: {
    nameKey: 'careAccess' as const,
    accent: '#b8334d',
    gradient: 'linear-gradient(to right, #1a5aa0, #4a7ec8, #b8334d)'
  },
  environmentalExposure: {
    nameKey: 'environmentalExposure' as const,
    accent: '#5c2e1f',
    gradient: 'linear-gradient(to right, #3d6b41, #a08050, #5c2e1f)'
  },
  transit: {
    nameKey: 'transit' as const,
    accent: '#c41e3a',
    gradient: 'linear-gradient(to right, #b39f00, #d97706, #c41e3a)'
  },
  areaDeprivationIndex: {
    nameKey: 'areaDeprivation' as const,
    accent: '#5c1fa2',
    gradient: 'linear-gradient(to right, #d0e8d0, #fce8a1, #f5a623, #e84c3d, #5c1fa2)'
  }
};

export const MapPage: React.FC<MapPageProps> = ({ selectedZip, onSelectZip, onNavigate }) => {
  const t = useTranslations('map');
  const [visibleLayers, setVisibleLayers] = useState({
    diseaseBurden: true,
    careAccess: false,
    environmentalExposure: false,
    transit: false,
    areaDeprivationIndex: true
  });
  const [uniqueZips, setUniqueZips] = useState<ZipToTractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ZIP-to-tract data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/geo/zip-to-tracts');
        if (!response.ok) {
          throw new Error(`Failed to fetch ZIP data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          // Get unique ZIPs (take first occurrence of each ZIP)
          const seen = new Set<string>();
          const unique = result.data.filter((row: ZipToTractRow) => {
            if (seen.has(row.zip)) return false;
            seen.add(row.zip);
            return true;
          });
          setUniqueZips(unique);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching ZIP data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLayerToggle = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Get the currently active layer for legend display
  const getActiveLayers = () => {
    return Object.entries(visibleLayers)
      .filter(([, isVisible]) => isVisible)
      .map(([layerId]) => layerId as keyof typeof visibleLayers);
  };

  const activeLayers = getActiveLayers();
  const activeLegendLayer = activeLayers.length > 0 ? activeLayers[0] : 'diseaseBurden';

  // Find selected ZIP data for the stats panel
  const selectedZipData = selectedZip ? uniqueZips.find(z => z.zip === selectedZip) : null;

  return (
  <div style={{ paddingTop: '80px' }}>
    {/* Header Section */}
    <section style={{
      padding: '48px 32px 24px',
      background: '#faf7f3'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '12px'
        }}>{t('title')}</h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: '#666',
          maxWidth: '700px',
          marginBottom: '16px'
        }}>
          {t('description')}
        </p>
        <div style={{
          background: '#fff9f5',
          padding: '12px 16px',
          borderRadius: '4px',
          borderLeft: '4px solid #c45a3b',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          color: '#333'
        }}>
          <strong>Tip:</strong> {t('tip')}
        </div>
      </div>
    </section>

    {/* Main Map Section */}
    <section style={{
      padding: '0',
      background: '#fff',
      minHeight: 'auto'
    }}>
      <div className="map-layout">
        {/* Map Column */}
        <div className="map-canvas">
          <MapLibreMap
            selectedZip={selectedZip}
            onZipClick={(zip) => {
              onSelectZip(zip);
              onNavigate('neighborhood');
            }}
            visibleLayers={visibleLayers}
          />
        </div>

        {/* Sidebar Panel */}
        <div className="map-sidebar">
          {/* Section A: Data Layers */}
          <div style={{
            padding: '20px 16px',
            borderBottom: '1px solid #e8e4df'
          }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#888',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>{t('dataLayers')}</div>

            <LayerCheckbox
              label={t('diseaseBurden')}
              checked={visibleLayers.diseaseBurden}
              color={layerColors.diseaseBurden.accent}
              onChange={() => handleLayerToggle('diseaseBurden')}
            />
            <LayerCheckbox
              label={t('careAccess')}
              checked={visibleLayers.careAccess}
              color={layerColors.careAccess.accent}
              onChange={() => handleLayerToggle('careAccess')}
            />
            <LayerCheckbox
              label={t('environmentalExposure')}
              checked={visibleLayers.environmentalExposure}
              color={layerColors.environmentalExposure.accent}
              onChange={() => handleLayerToggle('environmentalExposure')}
            />
            <LayerCheckbox
              label={t('transit')}
              checked={visibleLayers.transit}
              color={layerColors.transit.accent}
              onChange={() => handleLayerToggle('transit')}
            />
            <LayerCheckbox
              label={t('areaDeprivation')}
              checked={visibleLayers.areaDeprivationIndex}
              color={layerColors.areaDeprivationIndex.accent}
              onChange={() => handleLayerToggle('areaDeprivationIndex')}
            />

            {/* Layer Description */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #e8e4df',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#666'
            }}>
              {visibleLayers.diseaseBurden && (
                <p style={{ margin: 0 }}>
                  <strong>{t('diseaseBurden')}:</strong> {t('diseaseBurdenDesc')}
                </p>
              )}
              {visibleLayers.careAccess && (
                <p style={{ margin: 0 }}>
                  <strong>{t('careAccess')}:</strong> {t('careAccessDesc')}
                </p>
              )}
              {visibleLayers.environmentalExposure && (
                <p style={{ margin: 0 }}>
                  <strong>{t('environmentalExposure')}:</strong> {t('environmentalDesc')}
                </p>
              )}
              {visibleLayers.transit && (
                <p style={{ margin: 0 }}>
                  <strong>{t('transit')}:</strong> {t('transitDesc')}
                </p>
              )}
              {visibleLayers.areaDeprivationIndex && (
                <p style={{ margin: 0 }}>
                  <strong>{t('areaDeprivation')}:</strong> {t('adiDesc')}
                </p>
              )}
              {!visibleLayers.diseaseBurden && !visibleLayers.careAccess && !visibleLayers.environmentalExposure && !visibleLayers.transit && !visibleLayers.areaDeprivationIndex && (
                <p style={{ margin: 0, color: '#999' }}>
                  {t('noLayerSelected')}
                </p>
              )}
            </div>
          </div>

          {/* Section B: Legend */}
          <div style={{
            padding: '20px 16px',
            borderBottom: '1px solid #e8e4df'
          }}>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#888',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>{t('legend')}</div>

            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              color: '#444',
              marginBottom: '8px'
            }}>
              {t(layerColors[activeLegendLayer].nameKey)}
            </div>

            <div style={{
              height: '24px',
              background: layerColors[activeLegendLayer].gradient,
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #e8e4df'
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              color: '#666'
            }}>
              <span>{t('low')}</span>
              <span>{t('high')}</span>
            </div>
          </div>

          {/* Section C: Selected Area Stats */}
          {selectedZipData ? (
            <div style={{
              padding: '20px 16px',
              borderBottom: '1px solid #e8e4df'
            }}>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: '#888',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>{t('selectedArea')}</div>

              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '4px'
              }}>
                {selectedZipData.zip}
              </div>

              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#666',
                marginBottom: '12px'
              }}>
                {selectedZipData.nta_name || 'Unassigned'}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px',
                fontSize: '12px'
              }}>
                <div>
                  <div style={{ color: '#888', marginBottom: '4px' }}>{t('resWeight')}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                    {(selectedZipData.weight_res * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', marginBottom: '4px' }}>{t('totWeight')}</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                    {(selectedZipData.weight_tot * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', marginBottom: '4px' }}>{t('ntaCode')}</div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#1a1a1a' }}>
                    {selectedZipData.nta_code || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', marginBottom: '4px' }}>{t('ntaName')}</div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#1a1a1a' }}>
                    {selectedZipData.nta_name || '—'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('neighborhood')}
                style={{
                  width: '100%',
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#a84830'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#c45a3b'; }}
              >
                {t('viewProfile')}
              </button>
            </div>
          ) : (
            <div style={{
              padding: '20px 16px',
              borderBottom: '1px solid #e8e4df',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              color: '#999'
            }}>
              {t('clickNeighborhood')}
            </div>
          )}

          {/* Section D: Neighborhoods List */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 16px 12px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: '#888',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              {t('neighborhoods')}
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                margin: '0 8px 8px 8px',
                background: '#fff3f0',
                borderRadius: '6px',
                color: '#c45a3b',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px'
              }}>
                {t('errorLoading')} {error}
              </div>
            )}

            {loading && (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: '#999',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px'
              }}>
                {t('loading')}
              </div>
            )}

            {!loading && uniqueZips.length > 0 && (
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '8px 8px'
              }}>
                {uniqueZips.map(n => (
                  <NeighborhoodCard
                    key={n.zip}
                    data={n}
                    isSelected={selectedZip === n.zip}
                    onSelect={() => {
                      onSelectZip(n.zip);
                      onNavigate('neighborhood');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

interface LayerCheckboxProps {
  label: string;
  checked: boolean;
  color: string;
  onChange: () => void;
}

const LayerCheckbox: React.FC<LayerCheckboxProps> = ({ label, checked, color, onChange }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
    color: '#444',
    marginBottom: '10px',
    cursor: 'pointer'
  }}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ accentColor: color, width: '16px', height: '16px', cursor: 'pointer' }}
    />
    <span>{label}</span>
  </label>
);

interface NeighborhoodCardProps {
  data: ZipToTractRow;
  isSelected: boolean;
  onSelect: () => void;
}

const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ data, isSelected, onSelect }) => {
  // Calculate color based on weight_tot using the Disease Burden color scale
  const getColorForValue = (value: number) => {
    if (value < 0.25) return '#a8d5ba';
    if (value < 0.5) return '#c4b5a0';
    if (value < 0.75) return '#d4a574';
    return '#c45a3b';
  };

  const indicatorColor = getColorForValue(data.weight_tot);

  return (
    <button
      onClick={onSelect}
      style={{
        background: isSelected ? '#faf7f3' : '#fff',
        border: isSelected ? '2px solid #c45a3b' : '1px solid #e8e4df',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#c45a3b';
          e.currentTarget.style.backgroundColor = '#faf7f3';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#e8e4df';
          e.currentTarget.style.backgroundColor = '#fff';
        }
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
        gap: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '2px'
          }}>
            {data.nta_name || 'Unassigned'}
          </div>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: '#888'
          }}>
            {data.zip}
          </div>
        </div>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: indicatorColor,
          flexShrink: 0,
          marginTop: '2px',
          border: '1px solid rgba(0,0,0,0.1)'
        }} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        color: '#666'
      }}>
        <div>
          <div style={{ color: '#888', fontSize: '10px' }}>Res Weight</div>
          <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{(data.weight_res * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div style={{ color: '#888', fontSize: '10px' }}>Tot Weight</div>
          <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{(data.weight_tot * 100).toFixed(0)}%</div>
        </div>
      </div>
    </button>
  );
};
