'use client';

import { useTranslations } from 'next-intl';

/**
 * Example component showing how to use translations
 * This is a client component that uses the useTranslations hook
 */
export function ExampleTranslation() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('hero.cta')}</button>
    </div>
  );
}

/**
 * If you need translations in a server component:
 *
 * import { getTranslations } from 'next-intl/server';
 *
 * export async function ServerComponent() {
 *   const t = await getTranslations();
 *
 *   return <h1>{t('hero.title')}</h1>;
 * }
 */
