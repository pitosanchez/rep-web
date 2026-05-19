# Internationalization (i18n) Setup Guide

## Overview

This project uses **next-intl** for production-grade English/Spanish internationalization with:
- SEO-friendly localized routes (`/en`, `/es`)
- Automatic locale detection
- Language switcher in navigation
- Clean folder structure with App Router
- Zero hydration errors
- No full-page reloads when switching languages

## Architecture

```
rep-web/
├── proxy.ts                     # Route-based locale detection (Next.js 16+)
├── messages/
│   ├── en.json                  # English translations
│   └── es.json                  # Spanish translations
├── where-we-live-site/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (i18n provider)
│   │   ├── globals.css
│   │   ├── [locale]/            # Dynamic locale segment
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── api/             # API routes (no locale prefix)
│   │   └── api/
│   ├── lib/
│   │   └── i18n.ts              # i18n config
│   ├── components/
│   │   ├── Navigation.tsx        # Has LanguageSwitcher
│   │   ├── LanguageSwitcher.tsx  # Language toggle (client)
│   │   └── ExampleTranslation.tsx
│   ├── next.config.ts
│   └── package.json
└── tsconfig.json
```

## How It Works

### 1. **Proxy** (`proxy.ts`)
- Intercepts all requests except `/api` and `/_next`
- Detects locale from URL and sets it
- Automatically redirects `/` to `/en`

### 2. **Root Layout** (`app/layout.tsx`)
- Wraps entire app in `NextIntlClientProvider`
- Loads messages for current locale
- Sets `lang` attribute on HTML

### 3. **[locale] Segment** (`app/[locale]/`)
- Dynamic routing for `/en`, `/es`, etc.
- Preserves route structure (e.g., `/en/map`, `/es/map`)

### 4. **Language Switcher** (`LanguageSwitcher.tsx`)
- Client component with dropdown
- Preserves current route when switching
- Uses `useRouter().push()` for smooth navigation
- No full-page reloads

## Using Translations

### In Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();

  return <h1>{t('hero.title')}</h1>;
}
```

### In Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations();

  return <h1>{t('hero.title')}</h1>;
}
```

### In Layout Components

```tsx
import { getTranslations } from 'next-intl/server';

export async function MyLayout() {
  const t = await getTranslations();

  return (
    <header>
      <nav>
        <a href="/en">{t('nav.home')}</a>
        <a href="/en/map">{t('nav.map')}</a>
      </nav>
    </header>
  );
}
```

## Adding New Translations

### 1. Add to both `messages/en.json` and `messages/es.json`

```json
{
  "myComponent": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

### 2. Use in component

```tsx
const t = useTranslations();
console.log(t('myComponent.title')); // "My Title" (English) or Spanish version
```

## Key Files

| File | Purpose |
|------|---------|
| `proxy.ts` | Route-based locale detection (Next.js 16+) |
| `messages/en.json` | English translations |
| `messages/es.json` | Spanish translations |
| `lib/i18n.ts` | i18n configuration |
| `app/layout.tsx` | Root layout with i18n provider |
| `app/[locale]/layout.tsx` | Locale segment layout |
| `components/LanguageSwitcher.tsx` | Language toggle button |
| `next.config.ts` | next-intl plugin configuration |

## SEO Considerations

### Hreflang Tags (Optional)

For better SEO, add hreflang links in your pages:

```tsx
import { getAlternateLinks } from 'next-intl/navigation';

export function Head() {
  const alternates = getAlternateLinks('page-id');
  return (
    <>
      {alternates.map(alt => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}
    </>
  );
}
```

### Sitemap (Optional)

Next.js automatically handles `/en` and `/es` routes in the sitemap.

## Troubleshooting

### Hydration Errors
- Ensure all client components use `'use client'`
- LanguageSwitcher must be imported as a client component
- Messages are passed server-side; no hydration mismatch

### Language Switcher Not Working
- Verify `useRouter()` and `usePathname()` are available (must be in `/app` structure)
- Ensure locale code matches config (`'en'`, `'es'`)
- Check that route includes locale (e.g., `/en/map` not `/map`)

### Translations Missing
- Verify keys exist in both `en.json` and `es.json`
- Check for typos in `t('key.path')` calls
- Inspect `messages/` folder during build: `npm run build`

### API Routes Not Working
- API routes should stay in `/app/api/` (not inside `[locale]/`)
- No locale prefix for API calls: `/api/geo/bronx-zips` not `/en/api/...`

## Production Checklist

- [ ] All page content translatable (check for hardcoded strings)
- [ ] LanguageSwitcher appears on all pages
- [ ] Language switching preserves route
- [ ] No full-page reloads on language toggle
- [ ] Metadata is locale-aware (in per-page layouts)
- [ ] API routes don't have locale prefix
- [ ] `messages/en.json` and `messages/es.json` are complete
- [ ] Middleware catches all routes
- [ ] Build succeeds: `npm run build`

## Resources

- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
