import { MetadataRoute } from 'next';
import { siteConfig } from '@/constants';
import { allProducts } from '@/features/products/data';
import { allSolutions } from '@/features/solutions/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const SITE_URL = siteConfig.url;

  const staticRoutes = [
    '',
    '/solutions',
    '/products',
    '/industries',
    '/resources',
    '/resources/blog',
    '/resources/insights',
    '/resources/case-studies',
    '/trust',
    '/trust/security',
    '/trust/privacy',
    '/trust/compliance',
    '/trust/responsible-ai',
    '/trust/business-continuity',
    '/trust/vulnerability-disclosure',
    '/company',
    '/company/about',
    '/company/leadership',
    '/company/investors',
    '/company/careers',
    '/company/contact',
    '/legal',
    '/legal/privacy-policy',
    '/legal/terms',
    '/legal/cookies',
    '/contact',
    '/book-strategy-session',
    '/case-studies',
    '/search',
    '/industries/fintech',
    '/industries/financial-services',
    '/industries/life-sciences',
    '/industries/healthcare',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/solutions') || route.startsWith('/products') ? 0.9 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const solutionEntries: MetadataRoute.Sitemap = allSolutions.map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticEntries, ...productEntries, ...solutionEntries];
}
