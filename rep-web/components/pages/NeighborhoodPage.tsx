'use client';

import React, { useState, useEffect } from 'react';
import { stories, dataPoints, Story } from '@/lib/mockData';

interface NeighborhoodPageProps {
  selectedZip: string | null;
  onNavigate: (page: string) => void;
  onReturn: () => void;
}

interface NeighborhoodProfile {
  zip: string;
  nta_code: string;
  nta_name: string;
  city: string;
  state: string;
  tractCount: number;
  residentialWeight: number;
  totalWeight: number;
  tracts: string[];
  burdenIndex: number;
  avgTravel: number;
  exposureIndex: number;
}

export const NeighborhoodPage: React.FC<NeighborhoodPageProps> = ({ selectedZip, onNavigate, onReturn }) => {
  const [neighborhood, setNeighborhood] = useState<NeighborhoodProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch neighborhood data from API
  useEffect(() => {
    const fetchNeighborhood = async () => {
      if (!selectedZip) {
        setError('No ZIP code selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/geo/neighborhood-profile?zip=${selectedZip}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch neighborhood data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setNeighborhood(result.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching neighborhood:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setNeighborhood(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhood();
  }, [selectedZip]);

  // Get stories for this neighborhood from mock data (temporary)
  const neighborhoodStories = neighborhood
    ? stories.filter(s => s.zip === neighborhood.zip)
    : [];

  // Calculate theme frequencies
  const themeCounts: Record<string, number> = {};
  neighborhoodStories.forEach(s => {
    s.themes.forEach(t => {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    });
  });
  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Error state
  if (error || !neighborhood) {
    return (
      <div style={{ paddingTop: '80px' }}>
        <section style={{
          padding: '48px 32px',
          background: '#faf7f3',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <button
              onClick={onReturn}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                color: '#888',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: '0 auto 24px'
              }}
            >
              ← Back to Map
            </button>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              color: '#c45a3b',
              marginBottom: '12px'
            }}>
              {loading ? 'Loading...' : 'Unable to Load Neighborhood'}
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              {loading
                ? 'Fetching neighborhood data...'
                : error
                ? `${error}. Please try selecting another neighborhood.`
                : 'Please select a neighborhood from the map.'}
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Header */}
      <section style={{
        padding: '48px 32px 32px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onReturn}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to Map
          </button>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#c45a3b',
                marginBottom: '8px'
              }}>Neighborhood Profile</div>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '42px',
                fontWeight: '400',
                marginBottom: '8px'
              }}>
                {neighborhood.nta_name} <span style={{ color: '#888', fontWeight: '300' }}>({neighborhood.zip})</span>
              </h1>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                color: '#aaa'
              }}>
                {neighborhood.city}, {neighborhood.state}
              </p>
            </div>

            <button
              onClick={() => onNavigate('stories')}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                padding: '14px 24px',
                background: '#c45a3b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Share a story for {neighborhood.zip}
            </button>
          </div>

          {/* Quick stats bar */}
          <div style={{
            display: 'flex',
            gap: '48px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            {[
              { label: 'Burden Index', value: neighborhood.burdenIndex, suffix: '/100' },
              { label: 'Avg Travel to Nephrology', value: neighborhood.avgTravel, suffix: ' min' },
              { label: 'Exposure Index', value: neighborhood.exposureIndex, suffix: '/100' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  color: '#fff',
                  marginBottom: '4px'
                }}>
                  {stat.value}<span style={{ fontSize: '16px', color: '#888' }}>{stat.suffix}</span>
                </div>
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#888',
                  letterSpacing: '0.5px'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sections */}
      <section style={{
        padding: '48px 32px',
        background: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {dataPoints.map((section, i) => (
            <div key={i} style={{
              background: '#faf7f3',
              borderRadius: '12px',
              padding: '28px',
              borderLeft: '4px solid #c45a3b'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px',
                color: '#c45a3b'
              }}>{section.icon}</div>
              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: '8px'
              }}>{section.title}</div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                {i === 1 ? neighborhood.avgTravel + ' minutes' :
                 i === 2 ? neighborhood.exposureIndex + '/100' :
                 section.content}
              </div>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6'
              }}>{section.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stories Section - THE SIGNATURE FEATURE */}
      <section style={{
        padding: '48px 32px 80px',
        background: '#fff',
        borderTop: '1px solid #e8e4df'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '28px',
                fontWeight: '400',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>What Patients and Caregivers Report</h2>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '15px',
                color: '#666'
              }}>
                {neighborhoodStories.length} submissions from this neighborhood
              </p>
            </div>

            {/* Top themes */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {topThemes.map(([theme, count], i) => (
                <span key={i} style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '13px',
                  padding: '8px 16px',
                  background: i === 0 ? '#c45a3b' : '#f5f5f5',
                  color: i === 0 ? '#fff' : '#444',
                  borderRadius: '20px'
                }}>
                  {theme} ({count})
                </span>
              ))}
            </div>
          </div>

          {/* Story cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {neighborhoodStories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Ethics note */}
          <div style={{
            marginTop: '32px',
            padding: '20px 24px',
            background: '#f9f9f9',
            borderRadius: '8px',
            borderLeft: '3px solid #ddd'
          }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '13px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              <strong>How stories are shown:</strong> Submissions are anonymous by default,
              tied to neighborhood rather than individual identity, and displayed as patterns
              when multiple voices surface the same themes. REP never publishes identifying details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e8e4df',
    borderRadius: '12px',
    padding: '28px',
    position: 'relative'
  }}>
    <div style={{
      position: 'absolute',
      top: '28px',
      right: '28px',
      fontFamily: 'Georgia, serif',
      fontSize: '48px',
      color: 'rgba(196, 90, 59, 0.15)',
      lineHeight: 1
    }}>{`"`}</div>

    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    }}>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '600',
        padding: '4px 10px',
        background: '#f5f5f5',
        borderRadius: '4px',
        color: '#666'
      }}>{story.role}</span>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: '600',
        padding: '4px 10px',
        background: '#c45a3b',
        borderRadius: '4px',
        color: '#fff'
      }}>{story.condition}</span>
    </div>

    <p style={{
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#1a1a1a',
      lineHeight: '1.6',
      fontStyle: 'italic',
      marginBottom: '16px'
    }}>
      {`"${story.quote}"`}
    </p>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #f0f0f0'
    }}>
      <div style={{
        display: 'flex',
        gap: '6px'
      }}>
        {story.themes.map((t, i) => (
          <span key={i} style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: '#888'
          }}>
            {t}{i < story.themes.length - 1 ? ' ·' : ''}
          </span>
        ))}
      </div>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#aaa'
      }}>{story.date}</span>
    </div>
  </div>
);
