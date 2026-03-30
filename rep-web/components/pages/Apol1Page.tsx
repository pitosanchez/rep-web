import React from 'react';

interface Apol1PageProps {
  onNavigate?: (page: string) => void;
}

export const Apol1Page: React.FC<Apol1PageProps> = ({ onNavigate }) => (
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
          APOL1-Mediated Kidney Disease
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
              APOL1-mediated kidney disease is a genetic condition that increases the risk of developing chronic kidney disease and kidney failure. It is caused by specific genetic variations (called G1 and G2) in a gene that your body uses to fight certain infections.
            </p>
            <p style={{ marginBottom: '20px' }}>
              These genetic variations are particularly common in people with African ancestry, including African Americans, people from the Caribbean, and people from Brazil. This doesn't mean everyone with these variations will develop kidney disease, but they have a higher risk than others.
            </p>
            <p>
              The interesting thing about this genetic condition is that the same gene variations that put you at risk for kidney disease actually protected your ancestors from a serious tropical disease called sleeping sickness. This explains why these variations are so common in certain populations—your ancestors who had them were more likely to survive that disease.
            </p>
          </div>
        </div>

        {/* What Are the Genetic Variations Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Are G1 and G2?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              G1 and G2 are two different variations in the APOL1 gene. Think of them as two different "typos" in the same instruction manual for your body. They're different typos, but they both can cause similar problems.
            </p>
            <div style={{
              background: '#faf7f3',
              padding: '24px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                How Genes Work
              </h3>
              <p>
                You inherit genes from both your mother and father. For most genes, you get one copy from each parent. If you inherit the same variation (like G1 or G2) from both parents, that's when it can affect your health. If you only get it from one parent, you're usually protected.
              </p>
            </div>
            <p style={{ marginBottom: '20px' }}>
              <strong>The numbers tell the story:</strong> About 20-22% of African Americans carry the G1 variation, and about 13-15% carry the G2 variation. This means approximately 10-15% of African Americans carry two copies of these variations (one from each parent), putting them at higher risk for kidney disease.
            </p>
            <p>
              The key point: You need to inherit these variations from <strong>both</strong> parents for them to significantly increase your risk of kidney disease. If you only inherited one from one parent, your risk is much lower.
            </p>
          </div>
        </div>

        {/* Why Is This Gene Common in African Populations Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Why Is This More Common in African Populations?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              These gene variations are most common in West Africa (in countries like Ghana and Nigeria) and are found throughout sub-Saharan Africa. They arrived in the Americas through the forced migration of millions of Africans during the slave trade.
            </p>
            <p style={{ marginBottom: '20px' }}>
              The reason these variations became so common in Africa is evolution. Thousands of years ago, when sleeping sickness was a deadly disease that killed many people in Africa, those who carried the G1 or G2 variations had a survival advantage—they were protected from the disease. So they were more likely to survive and have children, passing the variation on to the next generation.
            </p>
            <p>
              Over many generations, these protective variations became very common. But the trade-off is that when someone inherits two copies (one from each parent), the same genes that protected their ancestors from a tropical disease now put them at risk for kidney disease. This is a common pattern in human genetics—what protects you in one situation can harm you in another.
            </p>
          </div>
        </div>

        {/* Who Is At Risk Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Who Is At Risk?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              APOL1-mediated kidney disease primarily affects people with recent African ancestry, including:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>African Americans</li>
              <li style={{ marginBottom: '12px' }}>People from sub-Saharan Africa</li>
              <li style={{ marginBottom: '12px' }}>People from the Caribbean</li>
              <li style={{ marginBottom: '12px' }}>People from Brazil</li>
              <li style={{ marginBottom: '12px' }}>Anyone with a family history of kidney disease and African heritage</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              <strong>Important:</strong> Just because you have African ancestry doesn't mean you have these genetic variations. And even if you do, not everyone develops kidney disease. About 70-85% of African Americans do <strong>not</strong> carry two copies of these variations.
            </p>
            <div style={{
              background: '#fff9f5',
              padding: '20px',
              borderLeft: '4px solid #c45a3b',
              borderRadius: '4px'
            }}>
              <p style={{ marginBottom: 0 }}>
                <strong>Who should get tested?</strong> If you're planning to donate a kidney and have African ancestry, your doctor may recommend testing for APOL1 variations as part of your evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* What Kidney Problems Can It Cause Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Kidney Problems Can APOL1 Cause?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              APOL1-mediated kidney disease can cause several different types of kidney problems, including:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>HIV-associated kidney disease (HIVAN):</strong> People with HIV who also carry two APOL1 variations have a very high risk of developing kidney damage
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Focal Segmental Glomerulosclerosis (FSGS):</strong> A type of kidney scarring (see FSGS page for more details)
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Kidney disease related to lupus or sickle cell disease:</strong> For people with these conditions, having APOL1 variations increases their risk of severe kidney problems
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>High blood pressure-related kidney disease:</strong> APOL1 variations can make hypertension more damaging to the kidneys
              </li>
              <li>
                <strong>Chronic kidney disease (CKD):</strong> General decline in kidney function over time
              </li>
            </ul>
            <p>
              The key point: Having APOL1 variations doesn't guarantee you'll get kidney disease, but it does increase your risk—sometimes dramatically. Studies show that people with two copies of these variations develop kidney problems and progress to kidney failure much faster than those without them.
            </p>
          </div>
        </div>

        {/* Progression and Timeline Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            How Fast Does APOL1 Kidney Disease Progress?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              The speed of progression varies from person to person. However, research shows that people with two APOL1 variations tend to develop kidney problems <strong>5-10 years earlier</strong> than people without them.
            </p>
            <p style={{ marginBottom: '20px' }}>
              For example, if someone without APOL1 variations might need dialysis at age 60, someone with two copies might need it at age 50-55. This means starting kidney protective treatments earlier is especially important if you have these variations.
            </p>
            <p>
              The good news: Controlling blood pressure and managing other conditions (like diabetes or HIV) can slow the progression and delay the need for dialysis or transplant.
            </p>
          </div>
        </div>

        {/* Kidney Donation Considerations Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            APOL1 and Kidney Donation
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              If you're considering donating a kidney and have African ancestry, your doctor may test you for APOL1 variations. This is important because:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>Donors with two APOL1 variations have a higher risk of developing kidney disease after donation</strong> than donors without these variations
              </li>
              <li style={{ marginBottom: '12px' }}>
                Your doctor needs this information to help you understand your personal risk and make an informed decision about donation
              </li>
              <li>
                The benefits of kidney donation to the recipient usually still outweigh these risks, but you and your doctor should discuss what's right for your situation
              </li>
            </ul>
            <p>
              The important thing: Having APOL1 variations doesn't automatically disqualify you from donating. Instead, it means your medical team will monitor you more closely after donation and work with you on strategies to protect your remaining kidney.
            </p>
          </div>
        </div>

        {/* Testing Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            How Is APOL1 Tested?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              APOL1 testing is a simple genetic test done with a blood sample or saliva. It can tell you:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                Whether you carry zero, one, or two copies of the G1 or G2 variations
              </li>
              <li>
                Your overall risk level for kidney disease
              </li>
            </ul>
            <p style={{ marginBottom: '20px' }}>
              <strong>Currently, routine testing is recommended mainly for:</strong>
            </p>
            <ul style={{ marginLeft: '20px' }}>
              <li>People considering kidney donation (especially those with African ancestry)</li>
              <li>People with African ancestry who have kidney disease and want to understand their risk factors</li>
              <li>Patients with HIV who have African ancestry</li>
            </ul>
          </div>
        </div>

        {/* Management and Prevention Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            What Can You Do?
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              If you have APOL1 variations, here are things you can do to protect your kidney health:
            </p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1a1a1a'
              }}>
                Prevention Strategies
              </h3>
              <ul style={{ marginLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Control your blood pressure:</strong> This is the single most important thing you can do. Keep your blood pressure at your doctor's target level
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Manage diabetes:</strong> If you have diabetes, tight control of blood sugar helps protect your kidneys
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Avoid certain medications:</strong> NSAIDs (like ibuprofen) can damage kidneys, especially for people with APOL1 variations
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Maintain a healthy weight:</strong> Obesity increases kidney stress
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Exercise regularly:</strong> Physical activity helps protect your heart and kidneys
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Eat a healthy diet:</strong> Low sodium, appropriate protein intake
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Avoid smoking:</strong> Smoking damages blood vessels, including those in your kidneys
                </li>
                <li>
                  <strong>Get regular kidney health check-ups:</strong> Regular blood and urine tests help catch problems early
                </li>
              </ul>
            </div>
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
                Future Treatments
              </h3>
              <p>
                Researchers are working on new medications specifically designed to treat APOL1 kidney disease. Early studies show promise, including a drug called inaxaplin that may slow kidney damage. Ask your doctor about clinical trials that might be available to you.
              </p>
            </div>
          </div>
        </div>

        {/* Key Takeaways Section */}
        <div style={{
          background: '#faf7f3',
          padding: '40px',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '20px',
            color: '#1a1a1a'
          }}>
            Key Things to Remember
          </h3>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                APOL1 kidney disease is genetic, but <strong>you only have higher risk if you inherited the variation from both parents</strong>
              </li>
              <li style={{ marginBottom: '12px' }}>
                These variations are common in people with African ancestry, but not everyone with African ancestry has them
              </li>
              <li style={{ marginBottom: '12px' }}>
                Having the variation doesn't mean you will definitely get kidney disease—it just means your risk is higher
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>Blood pressure control is your best defense</strong> against developing kidney disease if you have APOL1 variations
              </li>
              <li style={{ marginBottom: '12px' }}>
                Regular kidney monitoring is important if you have two copies of these variations
              </li>
              <li>
                Talk to your doctor about your risk if you have African ancestry and kidney disease, or if you're considering kidney donation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
);
