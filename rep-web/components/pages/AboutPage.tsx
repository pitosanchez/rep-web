'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const t = useTranslations('about');

  return (
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
          {t('heroTitle')}
        </h1>
      </div>
    </section>

    {/* Main Content */}
    <section style={{
      padding: '80px 32px',
      background: '#fff'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Essay Content */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          lineHeight: '1.8',
          color: '#333'
        }}>
          {/* Opening with large artistic drop cap */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              fontSize: '180px',
              fontWeight: '700',
              color: '#c45a3b',
              lineHeight: '0.75',
              textAlign: 'center',
              marginTop: '-8px'
            }}>
              S
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                fontWeight: '400',
                color: '#1a1a1a',
                marginBottom: '18px',
                marginTop: '0',
                lineHeight: '1.3'
              }}>
                {t('openingHeading')}
              </h3>

              <p style={{ marginBottom: '18px', marginTop: '0' }}>
                {t('para1')}
              </p>

              <p style={{ marginBottom: '18px' }}>
                {t('para2')}
              </p>

              <p style={{ marginBottom: '0', fontWeight: '600' }}>
                {t('learn')}
              </p>
            </div>
          </div>

          <p style={{ marginBottom: '18px', marginTop: '18px' }}>
            {t('para3')}
          </p>

          <p style={{ marginBottom: '18px' }}>
            {t('para4')}
          </p>

          <p style={{
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            paddingLeft: '24px',
            borderLeft: '4px solid #c45a3b',
            lineHeight: '1.7'
          }}>
            {t('quote1a')}
            <br /><br />
            {t('quote1b')}
          </p>

          <p style={{
            marginBottom: '48px',
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            fontStyle: 'italic',
            color: '#c45a3b',
            fontWeight: '500'
          }}>
            {t('belief')}
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            {t('storiesHealthcareTitle')}
          </h2>

          <p style={{ marginBottom: '24px' }}>
            {t('storiesHealthcareBody')}
          </p>

          <p style={{ marginBottom: '32px' }}>
            {t('storiesHealthcareBody2')}
          </p>

          <div style={{
            background: '#faf7f3',
            padding: '32px',
            borderRadius: '8px',
            marginBottom: '32px',
            borderLeft: '4px solid #c45a3b'
          }}>
            <p style={{ marginBottom: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              {t('question1')}
            </p>
            <p style={{ marginBottom: '16px', fontWeight: '600', color: '#1a1a1a' }}>
              {t('question2')}
            </p>
            <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
              {t('question3')}
            </p>
            <p style={{ marginTop: '16px', color: '#666', fontStyle: 'italic' }}>
              {t('questionsNote')}
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
            {t('missionTitle')}
          </h2>

          <p style={{ marginBottom: '24px' }}>
            {t('missionBody1')}
          </p>

          <p style={{ marginBottom: '24px' }}>
            {t('missionBody2')}
          </p>

          <p style={{
            marginBottom: '32px',
            fontFamily: 'Georgia, serif',
            fontSize: '19px',
            color: '#c45a3b',
            fontWeight: '600'
          }}>
            {t('missionEmphasis')}
          </p>

          <p style={{ marginBottom: '24px' }}>
            {t('missionBody3')}
          </p>

          <p style={{ marginBottom: '32px', fontWeight: '600', color: '#1a1a1a' }}>
            {t('missionGoal')}
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            {t('scienceTitle')}
          </h2>

          <p style={{ marginBottom: '24px' }}>
            {t('scienceBody1')}
          </p>

          <p style={{ marginBottom: '24px' }}>
            {t('scienceBody2')}
          </p>

          <p style={{ marginBottom: '24px' }}>
            {t('scienceBody3')}
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
            {t('scienceQuote')}
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: '48px'
          }}>
            {t('integratingTitle')}
          </h2>

          <p style={{ marginBottom: '24px' }}>
            {t('integratingBody')}
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
            <p style={{ marginBottom: '16px' }}>{t('closingLine1')}</p>
            <p style={{ marginBottom: '16px' }}>{t('closingLine2')}</p>
            <p>{t('closingLine3')}</p>
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
          {t('ctaTitle')}
        </h2>

        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '17px',
          color: '#666',
          marginBottom: '40px',
          lineHeight: '1.7'
        }}>
          {t('ctaDesc')}
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
            {t('ctaButton')}
          </button>
        )}
      </div>
    </section>
  </div>
  );
};
