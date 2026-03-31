'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface Apol1PageProps {
  onNavigate?: (page: string) => void;
}

export const Apol1Page: React.FC<Apol1PageProps> = ({ onNavigate: _onNavigate }) => {
  const t = useTranslations('apol1');

  return (
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
          {t('heroTitle')}
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section style={{ padding: '80px 32px', background: '#fff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Overview */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('overviewTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('overviewPara1')}</p>
            <p style={{ marginBottom: '20px' }}>{t('overviewPara2')}</p>
            <p>{t('overviewPara3')}</p>
          </div>
        </div>

        {/* G1 and G2 */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('g1g2Title')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('g1g2Para1')}</p>
            <div style={{ background: '#faf7f3', padding: '24px', borderLeft: '4px solid #c45a3b', borderRadius: '4px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('howGenesWork')}
              </h3>
              <p>{t('howGenesPara')}</p>
            </div>
            <p style={{ marginBottom: '20px' }}><strong>{t('g1g2Stats')}</strong></p>
            <p>{t('g1g2Key')}</p>
          </div>
        </div>

        {/* Why Common in African Populations */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('whyCommonTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('whyCommonPara1')}</p>
            <p style={{ marginBottom: '20px' }}>{t('whyCommonPara2')}</p>
            <p>{t('whyCommonPara3')}</p>
          </div>
        </div>

        {/* Who Is At Risk */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('whoAtRiskTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('whoAtRiskPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('riskItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem5')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}><strong>{t('whoAtRiskNote')}</strong></p>
            <div style={{ background: '#fff9f5', padding: '20px', borderLeft: '4px solid #c45a3b', borderRadius: '4px' }}>
              <p style={{ marginBottom: 0 }}><strong>{t('testingAdvice')}</strong></p>
            </div>
          </div>
        </div>

        {/* What Kidney Problems Can APOL1 Cause */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('problemsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('problemsPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('problemItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('problemItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('problemItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('problemItem4')}</li>
              <li>{t('problemItem5')}</li>
            </ul>
            <p>{t('problemsKey')}</p>
          </div>
        </div>

        {/* Progression */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('progressionTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('progressionPara1')}</p>
            <p style={{ marginBottom: '20px' }}>{t('progressionPara2')}</p>
            <p>{t('progressionGoodNews')}</p>
          </div>
        </div>

        {/* Kidney Donation */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('donationTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('donationPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('donationItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('donationItem2')}</li>
              <li>{t('donationItem3')}</li>
            </ul>
            <p>{t('donationKey')}</p>
          </div>
        </div>

        {/* Testing */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('testingTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('testingPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('testingItem1')}</li>
              <li>{t('testingItem2')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}><strong>{t('testingRecommended')}</strong></p>
            <ul style={{ marginLeft: '20px' }}>
              <li>{t('testRec1')}</li>
              <li>{t('testRec2')}</li>
              <li>{t('testRec3')}</li>
            </ul>
          </div>
        </div>

        {/* What Can You Do */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('whatCanTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('whatCanPara1')}</p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('preventionTitle')}
              </h3>
              <ul style={{ marginLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>{t('preventItem1')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem2')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem3')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem4')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem5')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem6')}</li>
                <li style={{ marginBottom: '12px' }}>{t('preventItem7')}</li>
                <li>{t('preventItem8')}</li>
              </ul>
            </div>
            <div style={{ background: '#faf7f3', padding: '24px', borderLeft: '4px solid #c45a3b', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('futureTreatmentsTitle')}
              </h3>
              <p>{t('futureTreatmentsDesc')}</p>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div style={{ background: '#faf7f3', padding: '40px', borderRadius: '8px' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#1a1a1a' }}>
            {t('keyRememberTitle')}
          </h3>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('keyItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('keyItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('keyItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('keyItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('keyItem5')}</li>
              <li>{t('keyItem6')}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};
