'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export const MethodsPage: React.FC = () => {
  const t = useTranslations('methods');

  return (
  <div style={{ paddingTop: '80px' }}>
    <section className="section-pad-md" style={{ background: '#faf7f3' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="heading-xl" style={{ marginBottom: '24px' }}>{t('title')}</h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.7',
          maxWidth: '700px'
        }}>
          {t('subtitle')}
        </p>
      </div>
    </section>

    <section className="section-pad-md" style={{ background: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="grid-2col">
          {/* Data Sources */}
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '20px'
            }}>{t('dataSourcesTitle')}</h2>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.8',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('census')}</strong>
                <p>{t('censusDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('osm')}</strong>
                <p>{t('osmDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('patientStories')}</strong>
                <p>{t('patientStoriesDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('cdc')}</strong>
                <p>{t('cdcDesc')}</p>
              </div>
            </div>
          </div>

          {/* Safety Rules */}
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '20px'
            }}>{t('safetyTitle')}</h2>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.8',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('minCellSize')}</strong>
                <p>{t('minCellSizeDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('geoDowngrade')}</strong>
                <p>{t('geoDowngradeDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('storyThreshold')}</strong>
                <p>{t('storyThresholdDesc')}</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>{t('noIndividual')}</strong>
                <p>{t('noIndividualDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* What REP Can & Cannot Say */}
    <section className="section-pad-md" style={{ background: '#f9f9f9' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '48px',
          textAlign: 'center'
        }}>{t('whatWeShowTitle')}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          <div>
            <div style={{
              background: '#e8f5e9',
              borderLeft: '4px solid #6b8f71',
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                color: '#1a1a1a',
                marginBottom: '16px'
              }}>{t('weShowTitle')}</h3>
              <ul style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: '1.8',
                listStylePosition: 'inside'
              }}>
                <li>{t('weShow1')}</li>
                <li>{t('weShow2')}</li>
                <li>{t('weShow3')}</li>
                <li>{t('weShow4')}</li>
                <li>{t('weShow5')}</li>
                <li>{t('weShow6')}</li>
                <li>{t('weShow7')}</li>
              </ul>
            </div>
          </div>

          <div>
            <div style={{
              background: '#ffebee',
              borderLeft: '4px solid #c45a3b',
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                color: '#1a1a1a',
                marginBottom: '16px'
              }}>{t('weDontShowTitle')}</h3>
              <ul style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: '1.8',
                listStylePosition: 'inside'
              }}>
                <li>{t('weDontShow1')}</li>
                <li>{t('weDontShow2')}</li>
                <li>{t('weDontShow3')}</li>
                <li>{t('weDontShow4')}</li>
                <li>{t('weDontShow5')}</li>
                <li>{t('weDontShow6')}</li>
                <li>{t('weDontShow7')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Governance */}
    <section className="section-pad-md" style={{ background: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '24px'
        }}>{t('governanceTitle')}</h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.8',
          marginBottom: '32px'
        }}>
          {t('governanceBody')}
        </p>

        <div style={{
          background: '#faf7f3',
          padding: '32px',
          borderRadius: '12px',
          borderLeft: '4px solid #c45a3b'
        }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8'
          }}>
            <strong>{t('irb')}</strong> {t('irbDesc')}
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            marginTop: '12px'
          }}>
            <strong>{t('audit')}</strong> {t('auditDesc')}
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            marginTop: '12px'
          }}>
            <strong>{t('community')}</strong> {t('communityDesc')}
          </p>
        </div>
      </div>
    </section>
  </div>
  );
};
