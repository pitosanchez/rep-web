import React from 'react';

interface KidneyDiseasePageProps {
  onNavigate?: (page: string) => void;
}

export const KidneyDiseasePage: React.FC<KidneyDiseasePageProps> = ({ onNavigate }) => (
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
          Understanding Kidney Disease
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* What Is Kidney Disease Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Is Kidney Disease?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              <strong>Chronic kidney disease (CKD)</strong> happens when the kidneys are damaged for more than a few months. Think of your kidneys as your body's filtration system—they clean the blood by removing waste and extra fluid, which then leaves the body as urine.
            </p>
            <p style={{ marginBottom: '20px' }}>
              But kidneys do much more than just filter waste. They also:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Help control blood pressure</li>
              <li style={{ marginBottom: '12px' }}>Balance salt and minerals in your blood</li>
              <li style={{ marginBottom: '12px' }}>Help your body make red blood cells</li>
              <li>Keep your bones strong</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              When kidneys are damaged, they can't do these jobs properly. Waste and fluid build up in your body, which can cause serious health problems.
            </p>
            <div style={{
              background: '#fff9f5',
              padding: '20px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px'
            }}>
              <p style={{ marginBottom: 0 }}>
                <strong>Important:</strong> In the early stages of kidney disease, you might not feel sick or have any symptoms. You might not know that you have kidney disease until the condition is advanced. This is why regular check-ups are important, especially if you have risk factors like high blood pressure or diabetes.
              </p>
            </div>
          </div>
        </div>

        {/* How Doctors Find Kidney Disease Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            How Do Doctors Find Kidney Disease?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Healthcare professionals can find kidney disease through blood and urine tests. These tests look for:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>High levels of waste in the blood</li>
              <li style={{ marginBottom: '12px' }}>Protein in the urine (which shouldn't normally be there)</li>
              <li>Tiny amounts of blood in the urine</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              Doctors might also use imaging tests like:
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Ultrasound:</strong> Creates pictures of your kidneys using sound waves
              </li>
              <li>
                <strong>CT scans:</strong> Take detailed X-ray images to look at the kidneys in detail
              </li>
            </ul>
          </div>
        </div>

        {/* The Five Stages of Kidney Disease Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            The Five Stages of Kidney Disease
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Your healthcare team determines what stage you have by performing a blood test called the <strong>estimated glomerular filtration rate (eGFR)</strong>. This test measures how much blood your kidneys filter each minute. A low eGFR number means your kidneys are working less well.
            </p>
            <div style={{
              overflowX: 'auto',
              marginBottom: '20px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#faf7f3',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#c45a3b', color: '#fff' }}>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      borderRight: '1px solid #ddd'
                    }}>Stage</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      borderRight: '1px solid #ddd'
                    }}>eGFR (mL/min)</th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '600'
                    }}>Kidney Function</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e8e4df' }}>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 1</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>90 or above</td>
                    <td style={{ padding: '16px' }}>Healthy kidney function</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e8e4df' }}>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 2</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>60 to 89</td>
                    <td style={{ padding: '16px' }}>Mild loss of kidney function</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e8e4df' }}>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 3a</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>45 to 59</td>
                    <td style={{ padding: '16px' }}>Mild to moderate loss of kidney function</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e8e4df' }}>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 3b</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>30 to 44</td>
                    <td style={{ padding: '16px' }}>Moderate to severe loss of kidney function</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e8e4df' }}>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 4</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>15 to 29</td>
                    <td style={{ padding: '16px' }}>Severe loss of kidney function</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>Stage 5</strong></td>
                    <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>Less than 15</td>
                    <td style={{ padding: '16px' }}>Kidney failure (end-stage kidney disease)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              When the kidneys no longer work at the level needed to keep a person alive, it's called <strong>end-stage kidney disease (ESKD)</strong>. This happens when you have an eGFR under 15. At this point, a person needs either a kidney transplant or dialysis (a treatment that does the job of the kidneys).
            </p>
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
            Symptoms of Kidney Disease
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Chronic kidney disease symptoms tend to develop slowly over time. In the early stages, you might not notice anything at all. This is why many people don't realize they have kidney disease until it's advanced.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Why symptoms develop:</strong> Loss of kidney function causes a buildup of fluid or waste in your body. It also can cause acids, potassium, and phosphate to build up in the blood—all of which can cause symptoms.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>When symptoms appear:</strong> Most people with kidney disease have no symptoms until the very last stages, known as advanced kidney disease.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Symptoms of advanced kidney disease include:</strong>
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Nausea and vomiting</li>
              <li style={{ marginBottom: '12px' }}>Loss of appetite</li>
              <li style={{ marginBottom: '12px' }}>Fatigue and weakness</li>
              <li style={{ marginBottom: '12px' }}>Sleep problems</li>
              <li style={{ marginBottom: '12px' }}>Decreased mental sharpness</li>
              <li style={{ marginBottom: '12px' }}>High blood pressure that's hard to manage</li>
              <li>Shortness of breath (if fluid builds up in the lungs)</li>
            </ul>
          </div>
        </div>

        {/* Treatment Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Treatment for Kidney Disease
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              <strong>The goal of treatment is to slow down damage to the kidneys.</strong> This is often done by managing the underlying cause of the damage—for example, controlling blood pressure or managing diabetes.
            </p>
            <p style={{ marginBottom: '20px' }}>
              However, even after a cause has been found and treated, kidney damage could still get worse. This is why it's important to:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Take your medications as prescribed</li>
              <li style={{ marginBottom: '12px' }}>Monitor your blood pressure regularly</li>
              <li style={{ marginBottom: '12px' }}>Get regular kidney function tests</li>
              <li style={{ marginBottom: '12px' }}>Follow dietary recommendations</li>
              <li>Work closely with your healthcare team</li>
            </ul>
            <div style={{
              background: '#faf7f3',
              padding: '24px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                If Kidney Disease Progresses to End-Stage
              </h3>
              <p>
                <strong>Chronic kidney disease can progress to end-stage kidney failure.</strong> This is fatal unless a person gets a kidney transplant or starts dialysis—a treatment that does the job of the kidneys.
              </p>
            </div>
          </div>
        </div>

        {/* When to See a Doctor Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            When to See a Doctor
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              If you have an ongoing health condition that raises your risk of kidney disease, your main healthcare professional may want to monitor the health of your kidneys. Risk factors include:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Long-standing high blood pressure</li>
              <li style={{ marginBottom: '12px' }}>Diabetes</li>
              <li style={{ marginBottom: '12px' }}>Autoimmune diseases such as lupus</li>
              <li style={{ marginBottom: '12px' }}>Family history of kidney disease</li>
              <li>APOL1 genetic variations</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              <strong>Regular monitoring usually includes:</strong>
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>Blood tests to check kidney function (eGFR)</li>
              <li>Urine tests to check for protein</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              You may see your main healthcare professional every 6 to 12 months for these tests. If test results show possible kidney problems, you may be referred to a <strong>nephrologist</strong>—a doctor who specializes in kidney diseases.
            </p>
          </div>
        </div>

        {/* Types of Kidney Disease Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Different Types of Kidney Disease
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Chronic kidney disease can result from many different causes. The type you have affects how it's treated. Some specific types of kidney disease include:
            </p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                APOL1-Mediated Kidney Disease
              </h3>
              <p style={{ marginBottom: '12px' }}>
                A genetic form of kidney disease caused by variations in the APOL1 gene, particularly common in people with African ancestry.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('kidney-disease-overview')}
                style={{
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px'
                }}
              >
                Learn about APOL1
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                Focal Segmental Glomerulosclerosis (FSGS)
              </h3>
              <p style={{ marginBottom: '12px' }}>
                A kidney disease characterized by scarring of the glomeruli (tiny filtering units) and can be caused by various conditions.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('fsgs')}
                style={{
                  background: '#c45a3b',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px'
                }}
              >
                Learn about FSGS
              </button>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                Other Types
              </h3>
              <p>
                Other types include diabetic kidney disease, lupus nephritis, polycystic kidney disease, and kidney disease from high blood pressure. Your doctor can explain which type you have and what it means for your treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Key Takeaway Section */}
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
            The Bottom Line
          </h3>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p>
              Kidney disease often has no symptoms in early stages, making regular check-ups essential if you have risk factors. The good news is that treatment can slow disease progression, especially when started early. Work with your healthcare team to monitor your kidney health and manage any underlying conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
