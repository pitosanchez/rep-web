import React from 'react';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => (
  <div style={{ paddingTop: '80px' }}>
    {/* Hero Section */}
    <section style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/womaninthewindo.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      padding: '120px 32px',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(44px, 8vw, 72px)',
          fontWeight: '300',
          lineHeight: '1.1',
          letterSpacing: '-1px'
        }}>
          Storytelling as Medicine
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Essay Content */}
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '17px',
          lineHeight: '1.9',
          color: '#333'
        }}>
          <p style={{ marginBottom: '24px', fontSize: '18px' }}>
            <span style={{
              fontSize: '64px',
              color: '#c45a3b',
              fontWeight: '700',
              float: 'left',
              lineHeight: '0.75',
              paddingRight: '10px',
              paddingTop: '6px'
            }}>S</span>
            tories are the engine that carries us forward—the thread that binds together the fabric of who we are and what we are called to become. They inform us and inspire us. At times, they make us uncomfortable, forcing us to confront truths we would rather not see. But it is precisely in this discomfort that their power lives. Through stories, we come to understand ourselves, our origins, and what we owe to one another.
          </p>

          <p style={{ marginBottom: '24px' }}>
            We learn through stories. From <em>Down These Mean Streets</em> by Piri Thomas, to <em>To Kill a Mockingbird</em> and the moral clarity of Atticus Finch, to the work of Toni Morrison, who forced us to sit with the legacy of slavery, identity, and healing. Even in comedy, someone like Richard Pryor used storytelling to challenge norms and expose reality when others could not. Stories do something data alone cannot—they make us feel, and in doing so, they make us care.
          </p>

          <p style={{
            marginBottom: '32px',
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            fontStyle: 'italic',
            color: '#666',
            borderLeft: '4px solid #c45a3b',
            paddingLeft: '24px'
          }}>
            This project is built on that belief.
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            Stories in Healthcare
          </h2>

          <p style={{ marginBottom: '24px' }}>
            In healthcare, data is essential—but it is often incomplete. Numbers can tell us what is happening, but rarely why. They can show patterns, but they cannot explain lived experience. Patient stories fill that gap. They provide context—cultural, emotional, environmental—that clinical data alone cannot capture. Research increasingly shows that storytelling improves understanding, builds trust, and leads to more patient-centered care. It helps researchers and clinicians align their work with what actually matters in people's lives.
          </p>

          <p style={{ marginBottom: '32px' }}>
            For communities affected by kidney disease—particularly those living with FSGS and APOL1-mediated kidney disease—this gap is even more pronounced.
          </p>

          <div style={{
            background: '#faf7f3',
            padding: '32px',
            borderRadius: '8px',
            marginBottom: '32px',
            borderLeft: '4px solid #c45a3b'
          }}>
            <p style={{ marginBottom: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              What does it mean to manage a chronic disease while living in a neighborhood with limited access to healthy food?
            </p>
            <p style={{ marginBottom: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              What does it mean to navigate treatment while dealing with financial instability or housing insecurity?
            </p>
            <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
              What does structural racism do—not just to access to care—but to the body itself?
            </p>
            <p style={{ marginTop: '16px', color: '#666', fontStyle: 'italic' }}>
              These are not abstract questions. They are lived realities.
            </p>
          </div>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            Our Mission
          </h2>

          <p style={{ marginBottom: '24px' }}>
            The Rare Renal Equity Project exists to connect these realities to the data. We are not just mapping disease—we are mapping experience. By pairing datasets with real stories from patients and families, we begin to see something different. The numbers stop being distant. They become human.
          </p>

          <p style={{ marginBottom: '24px' }}>
            You are no longer looking at a rate, a percentage, or a cluster on a map. You are seeing a person. A family. A set of choices shaped by constraints. A life.
          </p>

          <p style={{
            marginBottom: '32px',
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            color: '#c45a3b',
            fontWeight: '600'
          }}>
            And that shift matters.
          </p>

          <p style={{ marginBottom: '24px' }}>
            Because when we see the human story behind the data, it changes how we respond. Stories make information more memorable, more actionable, and more likely to influence behavior and decision-making. They create connection. They create urgency. They create accountability.
          </p>

          <p style={{ marginBottom: '32px', fontWeight: '600', color: '#1a1a1a' }}>
            Our goal is not just to tell stories, but to make them count.
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            Integrating Stories into Systems
          </h2>

          <p style={{ marginBottom: '24px' }}>
            We believe these stories can be studied, measured, and integrated into how research is done, how care is delivered, and how policy is shaped. This is about putting a human imprint on systems that have historically operated without one. It is about ensuring that when decisions are made—about funding, about research priorities, about care delivery—the voices of those most affected are not an afterthought, but a starting point.
          </p>

          <div style={{
            background: '#1a1a1a',
            color: '#fff',
            padding: '40px',
            borderRadius: '8px',
            marginTop: '48px',
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontWeight: '400',
            lineHeight: '1.8',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '16px' }}>This is storytelling as medicine.</p>
            <p style={{ marginBottom: '16px' }}>This is storytelling as data.</p>
            <p>This is storytelling as accountability.</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section style={{
      padding: '80px 32px',
      background: '#faf7f3',
      borderTop: '1px solid #e8e4df'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: '400',
          color: '#1a1a1a',
          marginBottom: '24px'
        }}>
          Read stories from the Bronx
        </h2>

        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '17px',
          color: '#666',
          marginBottom: '40px',
          lineHeight: '1.7'
        }}>
          See how patients and families navigate kidney disease while facing structural barriers to care, resources, and health.
        </p>

        {onNavigate && (
          <button
            onClick={() => onNavigate('stories')}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: '600',
              padding: '18px 48px',
              background: '#c45a3b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a84830';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#c45a3b';
            }}
          >
            Explore Stories
          </button>
        )}
      </div>
    </section>
  </div>
);
