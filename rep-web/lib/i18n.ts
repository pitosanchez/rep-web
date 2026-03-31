import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en.json';
import es from '../messages/es.json';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale || 'en',
  messages: locale === 'es' ? es : en
}));
