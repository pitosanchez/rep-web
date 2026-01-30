import React from 'react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ _onNavigate }) => (
  <div style={{ paddingTop: '80px' }}>
    <section style={{
      padding: '80px 32px',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#c45a3b',
          marginBottom: '16px'
        }}>About REP</div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '48px',
          fontWeight: '400',
          lineHeight: '1.15',
          marginBottom: '24px'
        }}>
          Disease does not happen<br />in a vacuum.
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          color: '#aaa',
          lineHeight: '1.7'
        }}>
          Decades of research show that APOL1-mediated kidney disease and FSGS are
          shaped not only by biology, but by environment and policy — housing, transit,
          exposure, access to specialty care, and the decisions that distribute those
          resources unequally.
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
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}>Our Commitment</h2>
            <div style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.8',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <p>
                <strong>No individual-level data.</strong> We never show disease dots on individuals.
                This protects privacy and prevents surveillance.
              </p>
              <p>
                <strong>Aggregation first.</strong> All data is aggregated to census tracts or higher.
                Small-number suppression is automatic (n &lt; 11).
              </p>
              <p>
                <strong>Stories tied to place, not identity.</strong> Patient voices appear as patterns
                by neighborhood, not as individual profiles.
              </p>
              <p>
                <strong>Threshold before display.</strong> Stories only appear when patterns emerge
                (minimum 5 submissions per neighborhood/theme).
              </p>
              <p>
                <strong>Clear limits.</strong> Every page explains what the data can and cannot show.
              </p>
            </div>
          </div>

          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              fontWeight: '400',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}>Who This Is For</h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                { title: 'Patients & Families', desc: 'Context: you\u2019re not alone, and it\u2019s not your fault.' },
                { title: 'Community Advocates', desc: 'Evidence to cite, not just testimony to share.' },
                { title: 'Researchers', desc: 'Neighborhood-level patterns to investigate.' },
                { title: 'Journalists', desc: 'A story that writes itself with place, data, and voice.' },
                { title: 'Funders & Policymakers', desc: 'Structural visibility on where investment is needed.' }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '16px',
                  background: '#faf7f3',
                  borderRadius: '8px',
                  borderLeft: '4px solid #c45a3b'
                }}>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>{item.title}</div>
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    color: '#666'
                  }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{
      padding: '80px 32px',
      background: '#f9f9f9',
      borderTop: '1px solid #e8e4df',
      borderBottom: '1px solid #e8e4df'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '32px',
          textAlign: 'center'
        }}>REP Is Designed to Be</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px'
        }}>
          {[
            { title: 'IRB-Safe', desc: 'Meets privacy standards. All data governance auditable.' },
            { title: 'Funder-Safe', desc: 'Clear ethics, reproducible methods, citable data.' },
            { title: 'Community-Centered', desc: 'Built with residents, not just for them.' },
            { title: 'Publishable', desc: 'Designed for peer review and scientific rigor.' }
          ].map((item, i) => (
            <div key={i} style={{
              padding: '24px',
              background: '#fff',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                color: '#1a1a1a',
                marginBottom: '8px'
              }}>{item.title}</h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: '#666'
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
