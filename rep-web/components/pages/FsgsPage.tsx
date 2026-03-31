'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface FsgsPageProps {
  onNavigate?: (page: string) => void;
}

export const FsgsPage: React.FC<FsgsPageProps> = ({ onNavigate: _onNavigate }) => {
  const t = useTranslations('fsgs');

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

        {/* Types of FSGS */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('typesTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('primaryTitle')}</h3>
              <p>{t('primaryDesc')}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('secondaryTitle')}</h3>
              <p>{t('secondaryDesc')}</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('geneticTitle')}</h3>
              <p style={{ marginBottom: '12px' }}>{t('geneticPara1')}</p>
              <p>{t('geneticPara2')}</p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('unknownTitle')}</h3>
              <p>{t('unknownDesc')}</p>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('symptomsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('symptomsPara1')}</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem5')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem6')}</li>
              <li>{t('symptomItem7')}</li>
            </ul>
            <div style={{ background: '#fff9f5', padding: '20px', borderLeft: '4px solid #c45a3b', borderRadius: '4px', marginTop: '24px' }}>
              <p style={{ marginBottom: 0 }}><strong>{t('seeDoctor')}</strong></p>
            </div>
          </div>
        </div>

        {/* Causes */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('causesTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('causesPara1')}</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('causeItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('causeItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('causeItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('causeItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('causeItem5')}</li>
              <li>{t('causeItem6')}</li>
            </ul>
          </div>
        </div>

        {/* Risk Factors */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('riskTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('riskPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('riskItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem3')}</li>
              <li>{t('riskItem4')}</li>
            </ul>
          </div>
        </div>

        {/* Diagnosis */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('diagnosisTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('diagnosisPara1')}</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('diagItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('diagItem2')}</li>
              <li>{t('diagItem3')}</li>
            </ul>
          </div>
        </div>

        {/* Medications */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('medsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('medsPara1')}</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('medItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('medItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('medItem3')}</li>
              <li>{t('medItem4')}</li>
            </ul>
          </div>
        </div>

        {/* Lifestyle Changes */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('lifestyleTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('lifestylePara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}>{t('lifestyleItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('lifestyleItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('lifestyleItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('lifestyleItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('lifestyleItem5')}</li>
              <li>{t('lifestyleItem6')}</li>
            </ul>
            <div style={{ background: '#faf7f3', padding: '24px', borderLeft: '4px solid #c45a3b', borderRadius: '4px', marginTop: '24px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '400', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('goalsTitle')}
              </h3>
              <p style={{ marginBottom: '12px' }}><strong>{t('shortTermGoals')}</strong></p>
              <p><strong>{t('longTermGoals')}</strong></p>
            </div>
          </div>
        </div>

        {/* Complications */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('complicationsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('complicationsPara1')}</p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('nephroticTitle')}</h3>
              <p>{t('nephroticDesc')}</p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>{t('failureTitle')}</h3>
              <p style={{ marginBottom: '12px' }}>{t('failurePara1')}</p>
              <ul style={{ marginLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>{t('dialysisDesc')}</li>
                <li>{t('transplantDesc')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final */}
        <div style={{ background: '#faf7f3', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '400', marginBottom: '16px', color: '#1a1a1a' }}>
            {t('journeyTitle')}
          </h3>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p>{t('journeyDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};
