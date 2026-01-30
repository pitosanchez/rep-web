import React from 'react';

export const MethodsPage: React.FC = () => (
  <div style={{ paddingTop: '80px' }}>
    <section style={{
      padding: '80px 32px',
      background: '#faf7f3'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '48px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '24px'
        }}>Methods & Transparency</h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.7',
          maxWidth: '700px'
        }}>
          Everything REP shows is built on explicit, auditable decisions.
          {`Here's how we work.`}
        </p>
      </div>
    </section>

    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px'
        }}>
          {/* Data Sources */}
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '24px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '20px'
            }}>Data Sources</h2>
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
                <strong style={{ color: '#1a1a1a' }}>US Census / ACS</strong>
                <p>Poverty, education, income, housing (5-year estimates)</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>OpenStreetMap</strong>
                <p>Fast food, liquor stores, grocery access, transit (aggregated)</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>Patient Stories</strong>
                <p>Anonymous submissions tied to neighborhood, reviewed for safety</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>CDC / ATSDR</strong>
                <p>SVI (Social Vulnerability Index) — later phase</p>
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
            }}>Safety & Suppression</h2>
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
                <strong style={{ color: '#1a1a1a' }}>Minimum Cell Size</strong>
                <p>Metrics with n &lt; 11 are suppressed (NCHS standard)</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>Geography Downgrading</strong>
                <p>If insufficient data at tract level, aggregate to county</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>Story Threshold</strong>
                <p>Stories show only when 5+ submissions from same area/theme</p>
              </div>
              <div>
                <strong style={{ color: '#1a1a1a' }}>No Individual Inference</strong>
                <p>Data never presented in ways that could re-identify people</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* What REP Can & Cannot Say */}
    <section style={{
      padding: '80px 32px',
      background: '#f9f9f9'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '48px',
          textAlign: 'center'
        }}>{`What REP Shows & What It Doesn't`}</h2>

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
              }}>✓ REP DOES Show</h3>
              <ul style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: '1.8',
                listStylePosition: 'inside'
              }}>
                <li>Neighborhood-level patterns</li>
                <li>Associations between factors</li>
                <li>Environmental conditions</li>
                <li>Aggregated patient experiences</li>
                <li>Care access barriers</li>
                <li>Structural inequities</li>
                <li>Where investment could help</li>
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
              }}>✗ REP Does NOT Show</h3>
              <ul style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: '1.8',
                listStylePosition: 'inside'
              }}>
                <li>Individual-level health data</li>
                <li>Genetic risk predictions</li>
                <li>Clinical diagnoses</li>
                <li>Causal claims</li>
                <li>Who will get sick (predictive)</li>
                <li>Identifying details about patients</li>
                <li>Any data that could re-identify people</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Governance */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '24px'
        }}>Governance & Oversight</h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.8',
          marginBottom: '32px'
        }}>
          REP is built to be auditable. Every data suppression decision, every story threshold,
          every narrative choice is logged and explainable.
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
            <strong>IRB Review:</strong> All data governance rules follow NCHS guidelines
            and are suitable for IRB scrutiny.
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            marginTop: '12px'
          }}>
            <strong>Audit Trail:</strong> Every governance decision — suppression, downgrading, narrative approval —
            is logged with timestamp and reasoning.
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            marginTop: '12px'
          }}>
            <strong>Community Input:</strong> Rules are designed with community partners,
            researchers, and funders.
          </p>
        </div>
      </div>
    </section>
  </div>
);
