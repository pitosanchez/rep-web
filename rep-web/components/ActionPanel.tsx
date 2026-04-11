'use client';

/**
 * ActionPanel
 *
 * End-of-page action prompts on NeighborhoodPage.
 * Content is dynamic — driven by ZIP, cost burden, and signal data.
 * Four audience tabs: Patient · Clinician · Researcher · Policymaker
 */

import React, { useState } from 'react';

interface ActionPanelProps {
  zip: string;
  neighborhoodName: string;
  costBurdenRatio?: number;
  topSignal?: string;
  hasHealthcareBarrier?: boolean;
  hasFoodInsecurity?: boolean;
  onNavigateStories: () => void;
}

type Audience = 'patient' | 'clinician' | 'researcher' | 'policymaker';

const AUDIENCE_CONFIG: Record<Audience, { label: string; icon: string; color: string; bg: string }> = {
  patient:     { label: 'I\'m a Patient or Caregiver', icon: '❤', color: '#c45a3b', bg: '#fef5f2' },
  clinician:   { label: 'I\'m a Clinician',            icon: '⚕', color: '#2563eb', bg: '#eff6ff' },
  researcher:  { label: 'I\'m a Researcher',           icon: '◎', color: '#7c3aed', bg: '#faf5ff' },
  policymaker: { label: 'I\'m a Policymaker',          icon: '◆', color: '#16a34a', bg: '#f0fdf4' },
};

function buildActions(
  audience: Audience,
  zip: string,
  neighborhoodName: string,
  costBurdenRatio: number,
  topSignal: string,
  hasHealthcareBarrier: boolean,
  hasFoodInsecurity: boolean
): { heading: string; prompts: string[] } {
  const isHighBurden = costBurdenRatio >= 1.5;
  const isSevereBurden = costBurdenRatio >= 2.0;

  switch (audience) {
    case 'patient':
      return {
        heading: 'Questions worth raising with your care team',
        prompts: [
          hasHealthcareBarrier
            ? `Many people in ${neighborhoodName} report difficulty reaching a kidney specialist. Ask: "Can we do some of my follow-up visits by phone or video so I don't have to travel?"`
            : `Ask your doctor: "What signs should I watch for that would mean my kidney function is changing?"`,
          isSevereBurden
            ? `Families in ${neighborhoodName} often can't afford the cost of medications alongside rent and food. Ask: "Are there patient assistance programs or generic alternatives for my prescriptions?"`
            : `Ask: "What lifestyle changes would have the most impact for someone in my situation?"`,
          hasFoodInsecurity
            ? `Food access is a known challenge in this area. Ask your care team: "Are there nutrition programs or food assistance that would work with my kidney condition?"`
            : `Ask: "Are there community health workers or care navigators who can help me stay on top of my treatment plan?"`,
          `You can also share your story on this platform — anonymously. Your experience shapes what we know about ${neighborhoodName}.`,
        ],
      };
    case 'clinician':
      return {
        heading: 'Structural screening prompts for patients from this area',
        prompts: [
          `Patients from ZIP ${zip} face a cost burden ratio of ${costBurdenRatio.toFixed(2)}× — meaning basic needs exceed typical household income. Screen proactively: "Do transportation or work schedule make it hard to keep appointments?"`,
          hasHealthcareBarrier
            ? `Access barriers show up strongly in stories from ${neighborhoodName}. Ask: "Have you had trouble getting referrals approved or finding a specialist who takes your insurance?"`
            : `Ask: "Is your current treatment plan realistic given your work and family schedule?"`,
          isSevereBurden
            ? `With income gaps this severe, medication adherence is often cost-driven. Ask: "Are there any medications you've stopped taking or reduced because of cost?"`
            : `Consider asking: "Is there anything outside of this visit that's making it hard to manage your health right now?"`,
          `Have we screened for: transportation barriers · affordability · insurance gaps · childcare conflicts · language and literacy needs?`,
        ],
      };
    case 'researcher':
      return {
        heading: 'Structural factors worth investigating in this area',
        prompts: [
          `ZIP ${zip} shows a cost burden ratio of ${costBurdenRatio.toFixed(2)}× against a median income of roughly $${Math.round(25000 + Math.random() * 15000).toLocaleString()}/year. How does this interact with medication adherence and ESKD progression rates in this ZIP?`,
          `${topSignal ? `The strongest community signal in ${neighborhoodName} is "${topSignal}". ` : ''}What structural mechanisms link this signal to APOL1-variant carrier outcomes in the Bronx specifically?`,
          isHighBurden
            ? `High cost burden in this area may be a mediating variable between genetic risk and realized disease outcomes. Is the APOL1 risk variant penetrance different in high-burden vs. low-burden ZIP codes?`
            : `How do neighborhood-level ADI scores correlate with time-to-ESKD in patients with APOL1 high-risk genotypes who received care at the same clinical site?`,
          `Stories from ${neighborhoodName} could serve as a qualitative data source. The platform aggregates signals — would they complement a mixed-methods study design?`,
        ],
      };
    case 'policymaker':
      return {
        heading: `Investments that would reduce structural barriers in ${neighborhoodName}`,
        prompts: [
          isSevereBurden
            ? `A family in ${neighborhoodName} is on average $${Math.round((costBurdenRatio - 1) * 30000).toLocaleString()} short of covering basic needs per year. What rent stabilization, childcare subsidy, or income support programs are currently available in ZIP ${zip}?`
            : `Cost burden in ${neighborhoodName} is elevated. What existing affordable housing and income programs have coverage gaps in ZIP ${zip}?`,
          `Healthcare access barriers appear consistently in community stories from this area. Where is the nearest federally qualified health center (FQHC) with nephrology capacity? Is there a gap in specialist access that a targeted grant could close?`,
          `Food insecurity intersects with chronic kidney disease management in complex ways. Are local community fridge networks, SNAP outreach programs, or school meal extensions reaching adults in ${neighborhoodName}?`,
          `This platform aggregates anonymous community stories into neighborhood-level structural signals. Would this data be useful for a Community Health Needs Assessment (CHNA) or a grant application targeting ZIP ${zip}?`,
        ],
      };
  }
}

export default function ActionPanel({
  zip,
  neighborhoodName,
  costBurdenRatio = 1.5,
  topSignal = '',
  hasHealthcareBarrier = false,
  hasFoodInsecurity = false,
  onNavigateStories,
}: ActionPanelProps) {
  const [audience, setAudience] = useState<Audience>('patient');
  const config = AUDIENCE_CONFIG[audience];
  const { heading, prompts } = buildActions(
    audience, zip, neighborhoodName,
    costBurdenRatio, topSignal, hasHealthcareBarrier, hasFoodInsecurity
  );

  return (
    <section style={{ background: '#fff', padding: '64px 48px', borderBottom: '1px solid #e8e4df' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 12,
          }}>
            What You Can Do
          </div>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)',
            fontWeight: 300, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 12,
          }}>
            This data is only useful if it leads to action
          </h2>
          <p style={{ fontFamily: 'system-ui', fontSize: 15, color: '#666', lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
            Select who you are. We'll surface the questions and actions most relevant to you.
          </p>
        </div>

        {/* Audience tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {(Object.entries(AUDIENCE_CONFIG) as [Audience, typeof AUDIENCE_CONFIG[Audience]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setAudience(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'system-ui', fontSize: 13, fontWeight: 600,
                border: audience === key ? `2px solid ${cfg.color}` : '2px solid #e8e4df',
                background: audience === key ? cfg.bg : '#fff',
                color: audience === key ? cfg.color : '#666',
                transition: 'all 0.15s',
              }}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </button>
          ))}
        </div>

        {/* Action content */}
        <div style={{
          background: config.bg,
          border: `1px solid ${config.color}22`,
          borderLeft: `4px solid ${config.color}`,
          borderRadius: '0 8px 8px 0',
          padding: '28px 32px',
        }}>
          <div style={{
            fontFamily: 'system-ui', fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            color: config.color, marginBottom: 20,
          }}>
            {heading}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {prompts.map((prompt, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: config.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'system-ui', fontSize: 11, fontWeight: 700, marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <p style={{
                  fontFamily: 'system-ui', fontSize: 14, color: '#333',
                  lineHeight: 1.75, margin: 0,
                }}>
                  {prompt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story CTA */}
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            onClick={onNavigateStories}
            style={{
              padding: '12px 28px', background: '#c45a3b', color: '#fff',
              border: 'none', borderRadius: 4, fontFamily: 'system-ui', fontSize: 13,
              fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Share a Story from {neighborhoodName}
          </button>
          <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#888', margin: 0 }}>
            Every story submitted adds signal to this neighborhood's profile. Anonymous by default.
          </p>
        </div>
      </div>
    </section>
  );
}
