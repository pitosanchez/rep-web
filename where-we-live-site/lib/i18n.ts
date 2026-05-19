import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en.json';
import es from '../messages/es.json';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en';
  return {
    locale,
    messages: locale === 'es' ? es : en
  };
});
