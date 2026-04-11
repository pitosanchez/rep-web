'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MapLibreMap from '@/components/MapLibreMap';
import DataDisclaimer from '@/components/DataDisclaimer';

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

// Transit removed — duplicate data source (same weight_tot as Structural Risk Proxy)
const layers = [
  {
    key: 'costBurden' as const,
    labelKey: 'costBurden' as const,
    descKey: 'costBurdenDesc' as const,
    accent: '#dc2626',
    gradient: 'linear-gradient(to right, #3b82f6, #f59e0b, #dc2626)',
    isReal: true,
  },
  {
    key: 'areaDeprivationIndex' as const,
    labelKey: 'areaDeprivation' as const,
    descKey: 'adiDesc' as const,
    accent: '#5c1fa2',
    gradient: 'linear-gradient(to right, #d0e8d0, #fce8a1, #f5a623, #e84c3d, #5c1fa2)',
    isReal: true,
  },
  {
    key: 'diseaseBurden' as const,
    labelKey: 'diseaseBurden' as const,
    descKey: 'diseaseBurdenDesc' as const,
    accent: '#a83d25',
    gradient: 'linear-gradient(to right, #6ab576, #c89a54, #a83d25)',
    isReal: false,
  },
  {
    key: 'careAccess' as const,
    labelKey: 'careAccess' as const,
    descKey: 'careAccessDesc' as const,
    accent: '#b8334d',
    gradient: 'linear-gradient(to right, #1a5aa0, #4a7ec8, #b8334d)',
    isReal: false,
  },
  {
    key: 'environmentalExposure' as const,
    labelKey: 'environmentalExposure' as const,
    descKey: 'environmentalDesc' as const,
    accent: '#5c2e1f',
    gradient: 'linear-gradient(to right, #3d6b41, #a08050, #5c2e1f)',
    isReal: false,
  },
];

// ── Floating panel shell ───────────────────────────────────────────────────
const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: 'rgba(18, 18, 18, 0.93)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px',
    color: '#fff',
    backdropFilter: 'blur(4px)',
    ...style
  }}>
    {children}
  </div>
);

export const MapPage: React.FC<MapPageProps> = ({ selectedZip, onSelectZip, onNavigate }) => {
  const t = useTranslations('map');
  const [visibleLayers, setVisibleLayers] = useState({
    costBurden: true,
    diseaseBurden: false,
    careAccess: false,
    environmentalExposure: false,
    transit: false,
    areaDeprivationIndex: true
  });
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [uniqueZips, setUniqueZips] = useState<ZipToTractRow[]>([]);

  useEffect(() => {
    fetch('/api/geo/zip-to-tracts')
      .then(r => r.json())
      .then(result => {
        if (result.success && result.data) {
          const seen = new Set<string>();
          const unique = result.data.filter((row: ZipToTractRow) => {
            if (seen.has(row.zip)) return false;
            seen.add(row.zip);
            return true;
          });
          setUniqueZips(unique);
        }
      })
      .catch(console.error);
  }, []);

  const handleLayerToggle = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const activeLayers = layers.filter(l => visibleLayers[l.key]);
  const legendLayer = activeLayers[0] ?? layers[0];
  const selectedZipData = selectedZip ? uniqueZips.find(z => z.zip === selectedZip) : null;

  return (
    <div style={{
      paddingTop: '80px',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ── Full-height map container ──────────────────────────── */}
      <div style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* The map itself */}
        <MapLibreMap
          selectedZip={selectedZip}
          onZipClick={(zip) => {
            onSelectZip(zip);
            onNavigate('neighborhood');
          }}
          visibleLayers={visibleLayers}
        />

        {/* ── TOP-LEFT: Identity ─────────────────────────────── */}
        <Panel style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          padding: '16px 20px',
          maxWidth: '260px'
        }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#c45a3b',
            marginBottom: '6px'
          }}>
            {t('title')}
          </div>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Not genetics. Geography and justice.
          </p>
        </Panel>

        {/* ── LEFT: Layer controls ───────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '16px',
          zIndex: 10,
          width: '220px'
        }}>
          {/* Panel header / toggle */}
          <Panel style={{ marginBottom: '2px' }}>
            <button
              onClick={() => setLayerPanelOpen(o => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              {t('dataLayers')}
              <span style={{
                fontSize: '16px',
                color: '#c45a3b',
                lineHeight: 1,
                transform: layerPanelOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
                display: 'inline-block'
              }}>
                ›
              </span>
            </button>
          </Panel>

          {layerPanelOpen && (
            <Panel>
              {/* Layer toggles */}
              <div style={{ padding: '8px 0 4px' }}>
                {layers.map(layer => (
                  <label
                    key={layer.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      background: visibleLayers[layer.key] ? 'rgba(196,90,59,0.08)' : 'none'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = visibleLayers[layer.key] ? 'rgba(196,90,59,0.08)' : 'none'; }}
                  >
                    {/* Custom checkbox */}
                    <div
                      onClick={() => handleLayerToggle(layer.key)}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        border: `2px solid ${visibleLayers[layer.key] ? layer.accent : 'rgba(255,255,255,0.25)'}`,
                        background: visibleLayers[layer.key] ? layer.accent : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {visibleLayers[layer.key] && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '12px',
                        color: visibleLayers[layer.key] ? '#fff' : 'rgba(255,255,255,0.55)',
                        lineHeight: '1.3',
                        transition: 'color 0.15s ease'
                      }}>
                        {t(layer.labelKey)}
                      </span>
                      {!layer.isReal && (
                        <span style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '9px',
                          color: '#f59e0b',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                        }}>
                          ⚠ Proxy data
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Data disclaimer inside panel */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px' }}>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '10px',
                  color: '#f59e0b',
                  lineHeight: '1.5',
                  margin: 0,
                }}>
                  ⚠ Layers marked "Proxy data" use modeled approximations, not direct measurements.
                  They show structural patterns, not clinical outcomes.
                </p>
              </div>

              {/* Active layer description */}
              {activeLayers.length > 0 && (
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  padding: '12px 16px'
                }}>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {t(activeLayers[0].descKey)}
                  </p>
                </div>
              )}

              {/* Legend */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                padding: '12px 16px'
              }}>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  marginBottom: '8px'
                }}>
                  {t('legend')} · {t(legendLayer.labelKey)}
                </div>
                <div style={{
                  height: '8px',
                  background: legendLayer.gradient,
                  borderRadius: '4px',
                  marginBottom: '6px'
                }} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.35)'
                }}>
                  <span>{t('low')}</span>
                  <span>{t('high')}</span>
                </div>
              </div>
            </Panel>
          )}
        </div>

        {/* ── BOTTOM: Selected neighborhood bar ─────────────── */}
        {selectedZipData ? (
          <Panel style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            padding: '0',
            display: 'flex',
            alignItems: 'stretch',
            gap: '0',
            minWidth: '480px',
            maxWidth: '680px',
            overflow: 'hidden'
          }}>
            {/* Accent bar */}
            <div style={{
              width: '4px',
              background: '#c45a3b',
              flexShrink: 0
            }} />

            {/* ZIP info */}
            <div style={{ padding: '16px 24px', flex: 1 }}>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '4px'
              }}>
                {t('selectedArea')}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '22px',
                  color: '#fff',
                  fontWeight: '300'
                }}>
                  {selectedZipData.nta_name || 'Unassigned'}
                </span>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)'
                }}>
                  ZIP {selectedZipData.zip}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '16px 24px',
              borderLeft: '1px solid rgba(255,255,255,0.07)'
            }}>
              {[
                { label: t('resWeight'), value: `${(selectedZipData.weight_res * 100).toFixed(0)}%` },
                { label: t('totWeight'), value: `${(selectedZipData.weight_tot * 100).toFixed(0)}%` }
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '20px',
                    color: '#fff',
                    fontWeight: '300'
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: '2px'
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate('neighborhood')}
              style={{
                padding: '0 28px',
                background: '#c45a3b',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'background 0.2s ease',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#a84830'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c45a3b'; }}
            >
              {t('viewProfile')}
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
          </Panel>
        ) : (
          /* ── Bottom prompt when nothing selected ──────────── */
          <Panel style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            whiteSpace: 'nowrap'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#c45a3b',
              flexShrink: 0,
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)'
            }}>
              {t('clickNeighborhood')}
            </span>
          </Panel>
        )}

        {/* ── Pulse animation keyframes injected inline ──────── */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
        `}</style>
      </div>
    </div>
  );
};
