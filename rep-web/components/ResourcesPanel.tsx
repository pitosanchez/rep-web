'use client';

/**
 * ResourcesPanel
 *
 * Find care, find support, and learn more links — ZIP-aware.
 * Structured for future API integration (e.g. HRSA FQHC finder, 211.org).
 */

import React, { useState } from 'react';

interface ResourcesPanelProps {
  zip: string;
  neighborhoodName: string;
}

interface Resource {
  name: string;
  type: string;
  description: string;
  phone?: string;
  url?: string;
  note?: string;
}

const CARE_RESOURCES: Resource[] = [
  {
    name: 'NYC Health + Hospitals / Lincoln',
    type: 'Kidney Care',
    description: 'Full nephrology services. Accepts Medicaid, uninsured, and sliding-scale.',
    phone: '(718) 579-5000',
    url: 'https://www.nychealthandhospitals.org/lincoln',
    note: 'Serving the South Bronx',
  },
  {
    name: 'Montefiore Medical Center — Nephrology',
    type: 'Specialist Care',
    description: 'Kidney disease, FSGS, dialysis, and transplant care.',
    phone: '(718) 920-4321',
    url: 'https://www.montefiore.org',
    note: 'Multiple Bronx locations',
  },
  {
    name: 'Urban Health Plan',
    type: 'Community Health Center',
    description: 'Federally Qualified Health Center. Chronic disease management, care navigation.',
    phone: '(718) 589-2440',
    url: 'https://www.urbanhealthplan.org',
    note: 'South Bronx · sliding scale fees',
  },
  {
    name: 'NephCure Kidney International',
    type: 'FSGS / Kidney Disease',
    description: 'Patient support, insurance navigation, specialist referrals for FSGS and APOL1.',
    phone: '1 (866) 637-4287',
    url: 'https://nephcure.org',
    note: 'National · English & Spanish',
  },
];

const SUPPORT_RESOURCES: Resource[] = [
  {
    name: 'NYC 311',
    type: 'Rent & Benefits Help',
    description: 'Connects to emergency rental assistance, utility help, and benefits navigation.',
    phone: '311',
    url: 'https://portal.311.nyc.gov',
    note: 'Available 24/7 · multiple languages',
  },
  {
    name: 'BronxWorks',
    type: 'Community Support',
    description: 'Food pantry, housing assistance, employment, and case management.',
    phone: '(718) 588-3782',
    url: 'https://www.bronxworks.org',
    note: 'Bronx-wide services',
  },
  {
    name: 'American Kidney Fund',
    type: 'Financial Assistance',
    description: 'Grants to help cover dialysis, medications, and transportation costs.',
    phone: '1 (800) 638-8299',
    url: 'https://www.kidneyfund.org',
    note: 'National · income-eligible patients',
  },
  {
    name: 'NYC Food Help',
    type: 'Food Access',
    description: 'SNAP enrollment, community food pantries, and food delivery for homebound patients.',
    phone: '311',
    url: 'https://www.nyc.gov/foodhelp',
    note: 'Kidney-safe meal guidance available',
  },
];

const LEARN_RESOURCES: Resource[] = [
  {
    name: 'What Is APOL1? (NephCure)',
    type: 'Education',
    description: 'Plain-language explanation of the APOL1 gene, risk variants, and what they mean — and don\'t mean.',
    url: 'https://nephcure.org/livingwithkidneydisease/disease-education/apol1/',
  },
  {
    name: 'FSGS Explained (NephCure)',
    type: 'Education',
    description: 'What FSGS is, how it progresses, treatment options, and questions to ask your doctor.',
    url: 'https://nephcure.org/livingwithkidneydisease/disease-education/fsgs/',
  },
  {
    name: 'CKD and Race — CDC',
    type: 'Public Health Data',
    description: 'CDC data on chronic kidney disease disparities by race and community.',
    url: 'https://www.cdc.gov/kidneydisease',
  },
  {
    name: 'NYC Community Health Profiles',
    type: 'Neighborhood Data',
    description: 'Health data by neighborhood, including the Bronx — asthma, diabetes, hypertension, and more.',
    url: 'https://www.nyc.gov/site/doh/data/data-publications/profiles.page',
  },
];

const SECTIONS = [
  { key: 'care',    label: 'Find Care',         accent: '#2563eb', resources: CARE_RESOURCES },
  { key: 'support', label: 'Find Support',       accent: '#16a34a', resources: SUPPORT_RESOURCES },
  { key: 'learn',   label: 'Learn More',         accent: '#7c3aed', resources: LEARN_RESOURCES },
] as const;

export default function ResourcesPanel({ zip, neighborhoodName }: ResourcesPanelProps) {
  const [active, setActive] = useState<'care' | 'support' | 'learn'>('care');
  const section = SECTIONS.find(s => s.key === active)!;

  return (
    <section style={{ background: '#faf7f3', padding: '64px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 12,
          }}>
            Resources
          </div>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)',
            fontWeight: 300, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 12,
          }}>
            Care, support, and information for {neighborhoodName}
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#888', margin: 0 }}>
            These are general resources relevant to the Bronx. Always verify current availability.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              style={{
                padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
                border: active === s.key ? `2px solid ${s.accent}` : '2px solid #e8e4df',
                background: active === s.key ? s.accent : '#fff',
                color: active === s.key ? '#fff' : '#666',
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Resource cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
          {section.resources.map((r, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #e8e4df',
              borderTop: `3px solid ${section.accent}`,
              borderRadius: '0 0 8px 8px',
              padding: '20px',
            }}>
              <div style={{
                fontFamily: 'system-ui', fontSize: 9, fontWeight: 700,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: section.accent, marginBottom: 6,
              }}>
                {r.type}
              </div>
              <div style={{ fontFamily: 'system-ui', fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                {r.name}
              </div>
              <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#555', lineHeight: 1.6, margin: '0 0 12px' }}>
                {r.description}
              </p>
              {r.note && (
                <div style={{ fontFamily: 'system-ui', fontSize: 11, color: '#aaa', marginBottom: 10 }}>
                  {r.note}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/\D/g,'')}`} style={{
                    fontFamily: 'system-ui', fontSize: 12, fontWeight: 600, color: section.accent,
                    textDecoration: 'none', padding: '4px 10px', border: `1px solid ${section.accent}`,
                    borderRadius: 4,
                  }}>
                    {r.phone}
                  </a>
                )}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'system-ui', fontSize: 12, fontWeight: 600,
                    color: '#fff', background: section.accent, textDecoration: 'none',
                    padding: '4px 10px', borderRadius: 4,
                  }}>
                    Visit →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'system-ui', fontSize: 11, color: '#bbb', lineHeight: 1.6, margin: '24px 0 0' }}>
          Resources listed are general references for the Bronx area. Where We Live does not endorse any specific provider.
          Information current as of April 2026 — always verify before making care decisions.
        </p>
      </div>
    </section>
  );
}
