'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const DATA_DICTIONARY = [
  {
    dataset: 'US Census / ACS (5-year)',
    source: 'US Census Bureau',
    geography: 'ZIP code (ZCTA)',
    frequency: 'Annual (5-year rolling)',
    limitations: 'Estimates carry margins of error; ZCTAs approximate ZIP boundaries.',
  },
  {
    dataset: 'Area Deprivation Index (ADI)',
    source: 'Univ. of Wisconsin NNHC, 2022',
    geography: 'Census block group',
    frequency: 'Updated ~every 2 years',
    limitations: 'Block-group data aggregated to ZIP — precision lost at aggregation.',
  },
  {
    dataset: 'TCOL Cost Burden (modeled)',
    source: 'MIT Living Wage Calculator + BLS CES',
    geography: 'ZIP code (modeled)',
    frequency: 'Annual baseline, modeled forward',
    limitations: 'Housing costs estimated from ACS median gross rent. Not household-specific.',
  },
  {
    dataset: 'Structural Risk Proxy',
    source: 'HUD USPS ZIP-to-Tract crosswalk',
    geography: 'ZIP code',
    frequency: 'Annual crosswalk release',
    limitations: 'Residential tract weight used as proxy — NOT a direct disease prevalence measure.',
  },
  {
    dataset: 'Access Constraint Proxy',
    source: 'HUD USPS ZIP-to-Tract crosswalk',
    geography: 'ZIP code',
    frequency: 'Annual crosswalk release',
    limitations: 'Based on residential distribution — NOT measured care access or wait times.',
  },
  {
    dataset: 'Environmental Context (Estimated)',
    source: 'Tract weight + location model',
    geography: 'ZIP code (modeled)',
    frequency: 'Static baseline',
    limitations: 'Modeled approximation only. No direct air, water, or environmental sampling.',
  },
  {
    dataset: 'Patient Stories (AI-extracted signals)',
    source: 'Anonymous community submissions',
    geography: 'ZIP code (self-reported)',
    frequency: 'Continuous (moderated)',
    limitations: 'Qualitative and self-reported. Aggregated only when ≥5 stories; confidence ≥ 0.6 required.',
  },
] as const;

export const MethodsPage: React.FC = () => {
  const t = useTranslations('methods');
  const [dictOpen, setDictOpen] = useState(false);

  return (
  <div style={{ paddingTop: '80px' }}>
    <section className="section-pad-md" style={{ background: '#faf7f3' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
          <h1 className="heading-xl" style={{ marginBottom: 0 }}>{t('title')}</h1>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: '#888', background: '#e8e4df',
            padding: '4px 12px', borderRadius: 4, alignSelf: 'center', whiteSpace: 'nowrap',
          }}>
            Data Version: v1.0 · April 2026
          </div>
        </div>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.7',
          maxWidth: '700px',
          marginTop: 16,
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

    {/* Data Dictionary */}
    <section style={{ background: '#fff', padding: '64px 48px', borderTop: '1px solid #e8e4df' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#1a1a1a', margin: 0 }}>
            Data Dictionary
          </h2>
          <button
            onClick={() => setDictOpen(o => !o)}
            style={{
              padding: '6px 16px', borderRadius: 4, border: '1px solid #c45a3b',
              fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, color: '#c45a3b',
              background: '#fff', cursor: 'pointer',
            }}
          >
            {dictOpen ? 'Collapse ▲' : 'Expand ▼'}
          </button>
        </div>
        <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>
          Every dataset used on this platform — its source, geographic granularity, update schedule, and known limitations.
        </p>
        {dictOpen && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'system-ui', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#faf7f3', borderBottom: '2px solid #e8e4df' }}>
                  {['Dataset', 'Source', 'Geography', 'Update Frequency', 'Known Limitations'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA_DICTIONARY.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e8e4df', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{row.dataset}</td>
                    <td style={{ padding: '10px 14px', color: '#555' }}>{row.source}</td>
                    <td style={{ padding: '10px 14px', color: '#555', whiteSpace: 'nowrap' }}>{row.geography}</td>
                    <td style={{ padding: '10px 14px', color: '#555', whiteSpace: 'nowrap' }}>{row.frequency}</td>
                    <td style={{ padding: '10px 14px', color: '#666', lineHeight: 1.5 }}>{row.limitations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>

    {/* Explicit Limitations */}
    <section style={{ background: '#fff8f0', padding: '48px 48px', borderTop: '1px solid #e8e4df' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#1a1a1a', marginBottom: 24 }}>
          What This Platform Cannot Tell You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
          {[
            {
              title: 'Individual Health Risk',
              body: 'No data on this platform predicts whether any individual person will develop kidney disease. Neighborhood patterns are not individual diagnoses.',
            },
            {
              title: 'Causation',
              body: 'We show associations — not proof that any factor causes disease. Correlation at the neighborhood level does not imply causation at the individual level.',
            },
            {
              title: 'Clinical Measurements',
              body: 'Structural Risk Proxy, Access Constraint Proxy, and Environmental Context layers are modeled estimates — not clinical data, not lab results, not patient records.',
            },
            {
              title: 'Future Outcomes',
              body: 'This platform does not predict disease progression, treatment response, or mortality. It maps current structural conditions.',
            },
            {
              title: 'Comprehensive Story Representation',
              body: 'Stories reflect people who submitted to this platform — not a random sample. Absence of stories from a ZIP does not mean absence of burden.',
            },
            {
              title: 'Completeness',
              body: 'Several Bronx ZIP codes lack sufficient story submissions (< 5) for signal aggregation. Those areas show structural data only.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: '#fff', border: '1px solid #e8e4df',
              borderLeft: '3px solid #c45a3b', borderRadius: '0 8px 8px 0',
              padding: '18px 20px',
            }}>
              <div style={{ fontFamily: 'system-ui', fontSize: 12, fontWeight: 700, color: '#c45a3b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {item.title}
              </div>
              <p style={{ fontFamily: 'system-ui', fontSize: 13, color: '#555', lineHeight: 1.65, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
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
