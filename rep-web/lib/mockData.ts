/**
 * Mock data for REP wireframe
 *
 * DEPRECATED: Neighborhood and geographic data now comes from API endpoints:
 * - /api/geo/zip-to-tracts - All ZIP to tract mappings
 * - /api/geo/neighborhood-clusters - Neighborhood aggregations
 * - /api/geo/neighborhood-profile - Individual neighborhood profiles
 * - /api/geo/bronx-zips - GeoJSON for map visualization
 *
 * This file is being phased out. It currently contains only:
 * - Stories (temporary until database is built)
 * - Generic content blocks (diffPoints, contextFactors, themes, dataPoints)
 */

export interface Story {
  id: number;
  zip: string;
  condition: 'APOL1' | 'FSGS' | 'CKD';
  role: 'Patient' | 'Caregiver';
  themes: string[];
  quote: string;
  date: string;
}

/**
 * TEMPORARY: Mock stories
 * Replace with real stories from database when available
 */
export const stories: Story[] = [
  {
    id: 1,
    zip: '10456',
    condition: 'APOL1',
    role: 'Patient',
    themes: ['Travel burden', 'Delayed referrals'],
    quote: "I was told genetics explained everything, but nobody asked how long it takes to get to care from here.",
    date: 'Jan 2026'
  },
  {
    id: 2,
    zip: '10456',
    condition: 'FSGS',
    role: 'Caregiver',
    themes: ['Fragmented care', 'Insurance barriers'],
    quote: "Appointments get labeled 'missed' like it's a character flaw. It's transit and time off work.",
    date: 'Jan 2026'
  },
  {
    id: 3,
    zip: '10459',
    condition: 'APOL1',
    role: 'Patient',
    themes: ['Environmental exposure', 'Clinician dismissal'],
    quote: "They test my blood but never ask about the air I breathe or the water I drink.",
    date: 'Dec 2025'
  }
];

export const themes = [
  'Travel burden',
  'Delayed referrals',
  'Fragmented care',
  'Insurance barriers',
  'Clinician dismissal',
  'Environmental exposure'
];

export const diffPoints = [
  {
    title: 'Aggregation-First',
    desc: 'No individual-level disease dots. Small-number suppression by default. Privacy built into architecture.',
    icon: '◐'
  },
  {
    title: 'Stories Tied to Place',
    desc: 'Patient voice appears as patterns by neighborhood — evidence, not spectacle.',
    icon: '◉'
  },
  {
    title: 'Structural Visibility',
    desc: 'Environmental exposure, care access, transit burden shown alongside genetic context.',
    icon: '▣'
  },
  {
    title: 'Built for Accountability',
    desc: 'Designed to be cited in grants, used in policy decks, argued with in rooms where decisions are made.',
    icon: '◈'
  }
];

export const contextFactors = [
  { label: 'Genetic Context', sub: 'APOL1 / FSGS prevalence (aggregated)', color: '#c45a3b' },
  { label: 'Structural Conditions', sub: 'Housing, exposure, transit, care access', color: '#d4a574' },
  { label: 'Lived Experience', sub: 'Patient/caregiver testimony by place', color: '#6b8f71' }
];

export const stats = [
  { label: 'Burden Index', value: 'burdenIndex', suffix: '/100' },
  { label: 'Avg Travel to Nephrology', value: 'avgTravel', suffix: ' min' },
  { label: 'Exposure Index', value: 'exposureIndex', suffix: '/100' },
  { label: 'Story Submissions', value: 'storyCount', suffix: '' }
];

export const dataPoints = [
  {
    title: 'Disease & Risk Context',
    icon: '◐',
    content: 'APOL1 / FSGS (aggregated)',
    note: 'Genetic context is shown at neighborhood level and is non-diagnostic. REP is aggregation-first.'
  },
  {
    title: 'Care Access',
    icon: '◉',
    content: 'Distance and transit reliability',
    note: 'Distance and transit reliability shape adherence and outcomes. "Noncompliance" often reflects access, not will.'
  },
  {
    title: 'Structural Exposure',
    icon: '▣',
    content: 'Elevated structural/environmental stressors',
    note: 'Elevated structural/environmental stressors compound over time and influence disease progression.'
  }
];
