# 15 — SEO & Discoverability Architecture

**Document:** 15_SEO_AND_DISCOVERABILITY.md  
**Owner:** SEO Architect & Staff Frontend Engineer  
**Status:** Active  

---

## Executive Summary

Search Engine Optimization (SEO) and discoverability are native architectural concerns in the Sathus Platform. Utilizing Next.js 15 Server Components, the platform automatically generates optimized metadata, OpenGraph cards, Twitter cards, Schema.org JSON-LD structured data, canonical URLs, and dynamic sitemaps.

---

## Metadata API Standard Architecture

All public pages in `apps/web/src/app/**` MUST export a structured `Metadata` object or implement a `generateMetadata` function:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise AI & Platform Architecture | Sathus Technology',
  description: 'Sathus Platform is the enterprise digital headquarters powering next-generation SaaS applications, digital experiences, and scalable microservices.',
  metadataBase: new URL('https://sathusplatform.com'),
  alternates: {
    canonical: 'https://sathusplatform.com',
  },
  openGraph: {
    title: 'Enterprise AI & Platform Architecture | Sathus Technology',
    description: 'Sathus Platform digital headquarters for scalable enterprise web applications.',
    url: 'https://sathusplatform.com',
    siteName: 'Sathus Technology',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sathus Technology Digital HQ',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI & Platform Architecture | Sathus Technology',
    description: 'Sathus Platform digital headquarters for scalable enterprise web applications.',
    images: ['/og-image.png'],
    creator: '@sathustech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

---

## Schema.org JSON-LD Structured Data

Structured data allows search engines to understand entity relationships. Public pages MUST inject JSON-LD script tags:

```tsx
export function OrganizationSchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sathus Technology Pvt. Ltd.',
    url: 'https://sathusplatform.com',
    logo: 'https://sathusplatform.com/logo.png',
    sameAs: [
      'https://twitter.com/sathustech',
      'https://linkedin.com/company/sathustechnology',
      'https://github.com/sathus-platform',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0199',
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
```

---

## Dynamic Sitemaps & Robots Control

1. **`sitemap.ts` (`apps/web/src/app/sitemap.ts`)**: Dynamically queries active pages, case studies, and blog posts to construct a compliant XML sitemap.
2. **`robots.ts` (`apps/web/src/app/robots.ts`)**: Generates dynamic `robots.txt` defining allowed user-agents and linking to the sitemap XML URL.

---

## Technical SEO & Core Web Vitals Performance

- **Target Lighthouse SEO Score**: **100 / 100**.
- **Core Web Vitals Targets**:
  - Largest Contentful Paint (LCP): `< 1.2s`
  - Interaction to Next Paint (INP): `< 100ms`
  - Cumulative Layout Shift (CLS): `0.00`
