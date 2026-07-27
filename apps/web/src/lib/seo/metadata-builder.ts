import type { Metadata } from 'next';
import { siteConfig } from '@/constants';

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

const DEFAULT_KEYWORDS = [
  'Sathus',
  'Sathus Technology',
  'sathus.in',
  'Sathus Platform',
  'enterprise AI engineering',
  'data platform engineering',
  'cloud modernization',
  'AI agents & swarms',
  'lakehouse architecture',
  'FastAPI MLOps',
  'Model Context Protocol',
  'Svora SaaS',
];

export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const baseUrl = 'https://www.sathus.in';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
  const combinedKeywords = Array.from(new Set([...keywords, ...DEFAULT_KEYWORDS]));

  return {
    metadataBase: new URL(baseUrl),
    title: `${title} | Sathus Technology`,
    description,
    keywords: combinedKeywords,
    authors: authors ? authors.map((name) => ({ name })) : [{ name: 'Sathus Technology', url: baseUrl }],
    creator: 'Sathus Technology Pvt. Ltd.',
    publisher: 'Sathus Technology Pvt. Ltd.',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'Sathus Technology',
      title: `${title} | Sathus Technology`,
      description,
      images: [
        {
          url: `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} — Sathus Technology Enterprise Platform`,
        },
      ],
      ...(ogType === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sathus Technology`,
      description,
      creator: '@sathustech',
      images: [`${baseUrl}/twitter-image`],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-sathus-tech',
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
      },
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    manifest: '/site.webmanifest',
  };
}
