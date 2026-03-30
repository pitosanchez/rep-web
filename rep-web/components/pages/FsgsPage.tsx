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
        {/* Overview Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Overview
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              <strong>Focal segmental glomerulosclerosis (FSGS)</strong> is a disease in which scar tissue develops on the glomeruli—the small parts of the kidneys that filter waste from the blood. Glomeruli are the tiny filtering units inside your kidney where blood is cleaned of wastes and toxins.
            </p>
            <p style={{ marginBottom: '20px' }}>
              FSGS is a serious condition that can lead to kidney failure, which can only be treated with dialysis or kidney transplant. Only some glomeruli are affected, but over time FSGS can lead to progressive kidney damage. You may experience swelling, have foamy urine and feel rundown due to the buildup of toxins in your body.
            </p>
            <p>
              Treatment options for FSGS depend on the type you have and can help slow ongoing kidney damage and might lead to improved kidney function over time.
            </p>
          </div>
        </div>

        {/* Types of FSGS Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Types of FSGS
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Primary FSGS</h3>
              <p>
                Many people diagnosed with FSGS have no known cause for their condition. This is called primary (idiopathic) FSGS.
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Secondary FSGS</h3>
              <p>
                Several factors can cause secondary FSGS, including infections, drug toxicity, diseases (such as diabetes or sickle cell disease), obesity, and other kidney diseases. Controlling or treating the underlying cause often slows ongoing kidney damage and might lead to improved kidney function over time.
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Genetic FSGS</h3>
              <p style={{ marginBottom: '12px' }}>
                This is a rare form of FSGS caused by genetic changes, also called familial FSGS. It's suspected when several members of a family show signs of FSGS.
              </p>
              <p>
                Familial FSGS can also occur when neither parent has the disease but each one carries a copy of an altered gene that can be passed on to the next generation.
              </p>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Unknown FSGS</h3>
              <p>
                In some cases, the underlying cause of FSGS cannot be determined despite the evaluation of clinical symptoms and extensive testing.
              </p>
            </div>
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
            Symptoms
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Many people with FSGS have <strong>no symptoms at all</strong>. When symptoms are present, they might include:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Swelling (edema)</strong> in the legs and ankles, around the eyes, and in other body parts
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Weight gain</strong> from fluid buildup
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Foamy urine</strong> from protein buildup (proteinuria)
              </li>
              <li style={{ marginBottom: '12px' }}>Fatigue and weakness</li>
              <li style={{ marginBottom: '12px' }}>Loss of appetite</li>
              <li style={{ marginBottom: '12px' }}>High blood pressure</li>
              <li>Muscle cramps</li>
            </ul>
            <div style={{
              background: '#fff9f5',
              padding: '20px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px',
              marginTop: '24px'
            }}>
              <p style={{ marginBottom: 0 }}>
                <strong>When to see a doctor:</strong> Contact your healthcare provider if you have any of the symptoms of FSGS.
              </p>
            </div>
          </div>
        </div>

        {/* Causes Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Causes
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Focal segmental glomerulosclerosis (FSGS) can be caused by a variety of conditions:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Medical conditions including diabetes, sickle cell disease, lupus, and other kidney diseases</li>
              <li style={{ marginBottom: '12px' }}>Obesity</li>
              <li style={{ marginBottom: '12px' }}>Infections such as HIV and hepatitis C</li>
              <li style={{ marginBottom: '12px' }}>Damage from illicit drugs, medicines, or toxins</li>
              <li style={{ marginBottom: '12px' }}>Gene changes passed through families (inherited gene changes) that can cause a rare form of FSGS</li>
              <li>Sometimes there is no known cause</li>
            </ul>
          </div>
        </div>

        {/* Risk Factors Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Risk Factors
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Factors that can raise your risk of developing FSGS include:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Medical conditions</strong> that can damage the kidneys such as diabetes, lupus, obesity, and other kidney diseases
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Certain infections</strong> including HIV and hepatitis C
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Gene changes</strong> passed through families that can raise the risk of FSGS
              </li>
              <li>
                <strong>Demographics:</strong> Males more than females; adults age 45 and older most prevalent; more common in people of African American descent
              </li>
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
                <strong>Urine tests:</strong> Look for protein (proteinuria) and blood in urine
              </li>
              <li>
                <strong>Kidney biopsy:</strong> A small sample of kidney tissue is examined under a microscope to confirm the diagnosis and determine the type of FSGS
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
            Medications to Manage FSGS
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
              Important lifestyle modifications that can help support healthy kidneys:
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

        {/* Complications Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Complications
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Focal segmental glomerulosclerosis (FSGS) may lead to other health concerns, including:
            </p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Nephrotic Syndrome</h3>
              <p>
                This kidney condition causes the body to pass too much protein in the urine. Nephrotic syndrome raises the risk of other health conditions, such as blood clots and high blood pressure.
              </p>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>Kidney Failure</h3>
              <p style={{ marginBottom: '12px' }}>
                Damage to the kidneys that can't be fixed causes the kidneys to stop working. The only treatments for kidney failure are dialysis or kidney transplant.
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
