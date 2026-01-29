/**
 * Mock data for REP wireframe
 * Replace with real data from API/database in production
 */

export interface Neighborhood {
  zip: string;
  name: string;
  city: string;
  state: string;
  burdenIndex: number;
  avgTravel: number;
  exposureIndex: number;
  storyCount: number;
  coords: { top: string; left: string };
}

export interface Story {
  id: number;
  zip: string;
  condition: 'APOL1' | 'FSGS' | 'CKD';
  role: 'Patient' | 'Caregiver';
  themes: string[];
  quote: string;
  date: string;
}

export const neighborhoods: Neighborhood[] = [
  {
    zip: '10456',
    name: 'Morrisania / South Bronx',
    city: 'New York',
    state: 'NY',
    burdenIndex: 82,
    avgTravel: 64,
    exposureIndex: 77,
    storyCount: 19,
    coords: { top: '35%', left: '55%' }
  },
  {
    zip: '10457',
    name: 'Tremont',
    city: 'New York',
    state: 'NY',
    burdenIndex: 76,
    avgTravel: 58,
    exposureIndex: 71,
    storyCount: 11,
    coords: { top: '28%', left: '48%' }
  },
  {
    zip: '10459',
    name: 'Longwood / Hunts Point',
    city: 'New York',
    state: 'NY',
    burdenIndex: 84,
    avgTravel: 72,
    exposureIndex: 81,
    storyCount: 14,
    coords: { top: '42%', left: '62%' }
  }
];

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
