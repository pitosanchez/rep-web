import React from 'react';

interface FsgsPageProps {
  onNavigate?: (page: string) => void;
}

export const FsgsPage: React.FC<FsgsPageProps> = ({ onNavigate }) => (
  <div style={{ paddingTop: '80px' }}>
    {/* Hero Section */}
    <section style={{
      background: 'linear-gradient(135deg, #c45a3b 0%, #8b4332 100%)',
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
          Focal Segmental Glomerulosclerosis (FSGS)
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* What is FSGS Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What is FSGS?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Many diseases and conditions can affect your kidney function by attacking and damaging the glomeruli. Glomeruli are the tiny filtering units inside your kidney where blood is cleaned of wastes and toxins. These diseases and conditions are called glomerular diseases and can have many different causes.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Focal segmental glomerulosclerosis (FSGS)</strong> is a type of glomerular disease and results in scarring (sclerosis) in your kidney. You may begin to feel sick, experience swelling, have foamy urine and feel rundown due to the build up of toxins in your body.
            </p>
            <p>
              Only some glomeruli are affected, but over time FSGS can lead to kidney failure where dialysis or a kidney transplant is required.
            </p>
          </div>
        </div>

        {/* Understanding the Term */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Breaking Down the Term
          </h3>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333',
            background: '#faf7f3',
            padding: '24px',
            borderLeft: '4px solid #c45a3b',
            borderRadius: '4px'
          }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Focal:</strong> Only some of the glomeruli in your kidneys are affected (not all of them)
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Segmental:</strong> Only part of each affected glomerulus is damaged
            </p>
            <p>
              <strong>Glomerulosclerosis:</strong> Scarring (fibrosis) and hardening of the glomeruli
            </p>
          </div>
        </div>

        {/* What Causes FSGS Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Causes FSGS?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              There are 3 types of FSGS: <strong>Primary, Secondary, and Genetic</strong>.
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Primary FSGS:</strong> The cause is unknown or idiopathic
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Secondary FSGS:</strong> Caused by an underlying disease or condition
              </li>
              <li>
                <strong>Genetic FSGS:</strong> Caused by inherited gene mutations
              </li>
            </ul>
          </div>
        </div>

        {/* Who Can Get FSGS Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Who Can Get FSGS?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>FSGS occurs more frequently in:</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                Males more than females
              </li>
              <li style={{ marginBottom: '12px' }}>
                Adults more than children
              </li>
              <li style={{ marginBottom: '12px' }}>
                Adults age 45 and older (most prevalent age group)
              </li>
              <li>
                People of African American descent
              </li>
            </ul>
          </div>
        </div>

        {/* Symptoms Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Symptoms of FSGS
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Many people with FSGS have <strong>no symptoms at all</strong>. When symptoms are present, the most common include:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Swelling in the legs, feet, hands, and face</li>
              <li style={{ marginBottom: '12px' }}>Foamy or bubbly urine</li>
              <li style={{ marginBottom: '12px' }}>Weight gain from fluid retention</li>
              <li style={{ marginBottom: '12px' }}>Fatigue and weakness</li>
              <li style={{ marginBottom: '12px' }}>Loss of appetite</li>
              <li style={{ marginBottom: '12px' }}>High blood pressure</li>
              <li>Muscle cramps</li>
            </ul>
          </div>
        </div>

        {/* Diagnosis Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            How is FSGS Diagnosed?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              If your healthcare provider suspects FSGS, they will review your medical history and order some tests such as:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Blood tests:</strong> Check kidney function and protein levels
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Urine tests:</strong> Look for protein and blood in urine
              </li>
              <li>
                <strong>Kidney biopsy:</strong> A small sample of kidney tissue is examined under a microscope to confirm the diagnosis
              </li>
            </ul>
          </div>
        </div>

        {/* Medications Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Medications to Relieve Symptoms
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Several medications can help manage FSGS symptoms and slow progression:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>ACE inhibitors or ARBs:</strong> Lower blood pressure and reduce protein in urine
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Corticosteroids:</strong> Reduce inflammation in the kidneys
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Immunosuppressants:</strong> Suppress the immune response attacking the kidneys
              </li>
              <li>
                <strong>Diuretics:</strong> Help manage swelling and fluid retention
              </li>
            </ul>
          </div>
        </div>

        {/* Lifestyle Changes Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Lifestyle Changes
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Yes, there are important lifestyle modifications that can help support healthy kidneys:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}>Stop smoking</li>
              <li style={{ marginBottom: '12px' }}>Follow a low sodium / low protein diet</li>
              <li style={{ marginBottom: '12px' }}>Be active and exercise regularly</li>
              <li style={{ marginBottom: '12px' }}>Avoid medications that can harm kidneys (such as NSAIDs)</li>
              <li style={{ marginBottom: '12px' }}>Maintain a healthy weight</li>
              <li>Take daily vitamins (such as Vitamin D)</li>
            </ul>
            <div style={{
              background: '#faf7f3',
              padding: '24px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px',
              marginTop: '24px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                fontWeight: '400',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                Goals of Treatment
              </h3>
              <p style={{ marginBottom: '12px' }}>
                <strong>Short-term goals:</strong> Reduce proteinuria, control blood pressure, manage swelling
              </p>
              <p>
                <strong>Long-term goals:</strong> Preserve kidney function, prevent progression to kidney failure, maintain quality of life
              </p>
            </div>
          </div>
        </div>

        {/* Progression Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Happens if FSGS Progresses to Kidney Failure?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              There are two main treatment options for kidney failure. Together, you and your healthcare provider will discuss which treatment option is best for you:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Dialysis:</strong> A mechanical process that filters waste and excess fluid from your blood
              </li>
              <li>
                <strong>Kidney transplant:</strong> Receiving a healthy kidney from a donor
              </li>
            </ul>
          </div>
        </div>

        {/* Final Section */}
        <div style={{
          background: '#faf7f3',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '16px',
            color: '#1a1a1a'
          }}>
            Your Unique FSGS Journey
          </h3>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p>
              The FSGS journey is unique for each patient. Close follow-up care with your healthcare provider is extremely important to help maintain the health of your kidneys and manage your condition effectively.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
