'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface KidneyDiseasePageProps {
  onNavigate?: (page: string) => void;
}

export const KidneyDiseasePage: React.FC<KidneyDiseasePageProps> = ({ onNavigate }) => {
  const t = useTranslations('kidney');

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

        {/* What Is Kidney Disease */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('whatIsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('whatIsPara1')}</p>
            <p style={{ marginBottom: '20px' }}>{t('whatIsPara2')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('whatIsItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('whatIsItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('whatIsItem3')}</li>
              <li>{t('whatIsItem4')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>{t('whatIsPara3')}</p>
            <div style={{ background: '#fff9f5', padding: '20px', borderLeft: '4px solid #c45a3b', borderRadius: '4px' }}>
              <p style={{ marginBottom: 0 }}><strong>{t('whatIsImportant')}</strong></p>
            </div>
          </div>
        </div>

        {/* How Do Doctors Find Kidney Disease */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('howFoundTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('howFoundPara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('howFoundItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('howFoundItem2')}</li>
              <li>{t('howFoundItem3')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>{t('howFoundPara2')}</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('howFoundItem4')}</li>
              <li>{t('howFoundItem5')}</li>
            </ul>
          </div>
        </div>

        {/* The Five Stages */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('stagesTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('stagesPara1')}</p>
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#faf7f3', borderRadius: '4px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#c45a3b', color: '#fff' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #ddd' }}>{t('stageCol1')}</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderRight: '1px solid #ddd' }}>{t('stageCol2')}</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>{t('stageCol3')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['stage1', 'stage1Egfr', 'stage1Func'],
                    ['stage2', 'stage2Egfr', 'stage2Func'],
                    ['stage3a', 'stage3aEgfr', 'stage3aFunc'],
                    ['stage3b', 'stage3bEgfr', 'stage3bFunc'],
                    ['stage4', 'stage4Egfr', 'stage4Func'],
                    ['stage5', 'stage5Egfr', 'stage5Func'],
                  ].map(([stageKey, egfrKey, funcKey], i, arr) => (
                    <tr key={stageKey} style={{ borderBottom: i < arr.length - 1 ? '1px solid #e8e4df' : undefined }}>
                      <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}><strong>{t(stageKey as any)}</strong></td>
                      <td style={{ padding: '16px', borderRight: '1px solid #e8e4df' }}>{t(egfrKey as any)}</td>
                      <td style={{ padding: '16px' }}>{t(funcKey as any)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>{t('stagesPara2')}</p>
          </div>
        </div>

        {/* Symptoms */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('symptomsTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('symptomsPara1')}</p>
            <p style={{ marginBottom: '20px' }}><strong>{t('symptomsWhy')}</strong></p>
            <p style={{ marginBottom: '20px' }}><strong>{t('symptomsWhen')}</strong></p>
            <p style={{ marginBottom: '20px' }}><strong>{t('symptomsAdvanced')}</strong></p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem4')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem5')}</li>
              <li style={{ marginBottom: '12px' }}>{t('symptomItem6')}</li>
              <li>{t('symptomItem7')}</li>
            </ul>
          </div>
        </div>

        {/* Treatment */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('treatmentTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('treatmentPara1')}</p>
            <p style={{ marginBottom: '20px' }}>{t('treatmentPara2')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('treatItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('treatItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('treatItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('treatItem4')}</li>
              <li>{t('treatItem5')}</li>
            </ul>
            <div style={{ background: '#faf7f3', padding: '24px', borderLeft: '4px solid #c45a3b', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('eskdTitle')}
              </h3>
              <p>{t('eskdDesc')}</p>
            </div>
          </div>
        </div>

        {/* When to See a Doctor */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('whenSeeTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('whenSeePara1')}</p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('riskItem1')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem2')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem3')}</li>
              <li style={{ marginBottom: '12px' }}>{t('riskItem4')}</li>
              <li>{t('riskItem5')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}><strong>{t('monitoringNote')}</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '12px' }}>{t('monitorItem1')}</li>
              <li>{t('monitorItem2')}</li>
            </ul>
            <p style={{ marginBottom: '20px' }}>{t('whenSeePara2')}</p>
          </div>
        </div>

        {/* Types of Kidney Disease */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', marginBottom: '24px', color: '#1a1a1a' }}>
            {t('typesTitle')}
          </h2>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>{t('typesPara1')}</p>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('apol1TypeTitle')}
              </h3>
              <p style={{ marginBottom: '12px' }}>{t('apol1TypeDesc')}</p>
              <button
                onClick={() => onNavigate && onNavigate('apol1')}
                style={{
                  background: '#c45a3b', color: '#fff', border: 'none',
                  padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif', fontSize: '14px'
                }}
              >
                {t('learnApol1')}
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('fsgsTypeTitle')}
              </h3>
              <p style={{ marginBottom: '12px' }}>{t('fsgsTypeDesc')}</p>
              <button
                onClick={() => onNavigate && onNavigate('fsgs')}
                style={{
                  background: '#c45a3b', color: '#fff', border: 'none',
                  padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif', fontSize: '14px'
                }}
              >
                {t('learnFsgs')}
              </button>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                {t('otherTypesTitle')}
              </h3>
              <p>{t('otherTypesDesc')}</p>
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <div style={{ background: '#faf7f3', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '400', marginBottom: '16px', color: '#1a1a1a' }}>
            {t('bottomLineTitle')}
          </h3>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '17px', lineHeight: '1.9', color: '#333' }}>
            <p>{t('bottomLineDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};
