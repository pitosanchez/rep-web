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
              The presence of a specific variant in the APOL1 gene on each chromosome confers an increased risk of chronic kidney disease and progression to end-stage kidney disease in individuals with recent African, African-American, Caribbean or Brazilian heritage.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Living donor kidney transplantation is currently the optimal form of renal replacement therapy for many individuals with end-stage kidney disease (ESKD), but living donors have a higher risk of developing chronic kidney disease (CKD) themselves. The post-donation risk is greater in those with African, African-American, Caribbean or Brazilian ancestry.
            </p>
            <p>
              As some evidence suggests that specific APOL1 alleles contribute to this risk, it is now recommended that APOL1 genotyping is incorporated into the donor assessment of individuals from these backgrounds.
            </p>
          </div>
        </div>

        {/* Clinical Features Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Clinical Features
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>APOL1 genotypes G1/G1, G1/G2 and G2/G2</strong> are associated with an increased risk of CKD, and faster progression to ESKD in individuals of African and Caribbean heritage. They are also associated with various glomerular diseases such as focal and segmental glomerulosclerosis (FSGS), HIV nephropathy, non-diabetic hypertensive nephropathy, lupus collapsing glomerulopathy, sickle cell nephropathy, COVID-19 associated nephropathy and pre-eclampsia.
              </li>
              <li style={{ marginBottom: '12px' }}>
                The actual risk of developing APOL1-mediated kidney disease is multifactorial.
              </li>
              <li>
                Longer-term studies of APOL1 genotypes on donor kidney function are currently in progress.
              </li>
            </ul>
          </div>
        </div>

        {/* Genomics Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Genomics
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              The APOL1 variants, G1 and G2, associated with an increased risk of CKD are most commonly found in populations in West Africa (G1 &gt;40% and G2 &lt;24%) but are also found in those living outside Africa with recent African or Caribbean descent. Approximately 10–15% of African Americans, for example, carry two APOL1 high-risk alleles.
            </p>
            <p style={{ marginBottom: '20px' }}>
              G1 and G2 were initially identified as strongly associated with FSGS and HIV-associated nephropathy. The G1 allele comprises two missense variants (variants that alter an amino acid) that are inherited together (in high linkage disequilibrium):
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>G1G</strong>, where serine at position 342 is replaced with a glycine (p.S342 G); and
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>G1M</strong>, where isoleucine at position 1384 is replaced with a methionine (p.I384 M).
              </li>
            </ul>
            <p>
              The G2 allele is a 6 base pair deletion resulting in the deletion of p.N388/Y389. When associated with p.N264K (a protective allele), the G2 allele no longer confers a risk of kidney disease.
            </p>
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
            Diagnosis
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p>
              Testing for the APOL1 variants is currently only recommended for potential living kidney donors considered to be at higher risk (that is, those with recent African, African-American, Caribbean or Brazilian ancestry). Extended family screening or testing in the presence of kidney disease is not currently recommended.
            </p>
          </div>
        </div>

        {/* Inheritance Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Inheritance and Genomic Counselling
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Most people with the APOL1 risk alleles will not develop significant kidney disease. For individuals with the G1/G1, G1/G2 or G2/G2 genotypes, one allele will have been inherited from each parent in an autosomal recessive manner, but family cascade testing is not indicated.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Pre-test genomic counselling should specifically focus on the implications of kidney donation, long-term donor outcomes and recipient graft survival.
            </p>
            <p>
              Currently, only small studies suggest an increased risk of CKD and kidney failure in donors with two high-risk alleles compared to those with one or none. Slightly reduced graft survival is also suggested, but the risks of shorter graft survival is unlikely to outweigh the benefits of transplantation for most recipients. The effects of recipient APOL1 genotype on graft survival are unknown.
            </p>
          </div>
        </div>

        {/* Management Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '32px',
            fontWeight: '400',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>
            Management
          </h2>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '17px',
            lineHeight: '1.9',
            color: '#333'
          }}>
            <p style={{ marginBottom: '20px' }}>
              No approved disease-specific treatments are currently available for APOL1 mediated kidney disease. However, several phase 1, 2 and 3 clinical trials are currently in progress.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Inaxaplin</strong> is a small-molecule inhibitor that targets APOL1 function. In a phase 2a clinical study, participants with two APOL1 variants and FSGS showed a significant reduction in proteinuria after 13 weeks of treatment with inaxaplin. This suggests that inaxaplin could potentially slow or prevent the progression of kidney disease in patients with these specific genetic risk factors.
            </p>
            <p>
              Because APOL1 genotyping is only recommended for potential living kidney donors with both parents of recent African, African-American, Caribbean or Brazilian ancestry, most individuals with two high-risk genotypes will remain undetected. Individuals should receive the standard of care for their specific type of kidney disease if known, and standard of care for CKD should be applied.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
