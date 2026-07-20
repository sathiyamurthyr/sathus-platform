import { MetadataRoute } from 'next';
import { siteConfig } from '@/constants';
import { allProducts } from '@/features/products/data';
import { allSolutions } from '@/features/solutions/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const SITE_URL = siteConfig.url;

  const staticRoutes: Array<{ route: string; priority: number; changeFreq: 'daily' | 'weekly' | 'monthly' }> = [
    { route: '', priority: 1.0, changeFreq: 'weekly' },
    { route: '/solutions', priority: 0.9, changeFreq: 'weekly' },
    { route: '/products', priority: 0.9, changeFreq: 'weekly' },
    { route: '/industries', priority: 0.8, changeFreq: 'monthly' },
    { route: '/resources', priority: 0.8, changeFreq: 'weekly' },
    { route: '/resources/blog', priority: 0.8, changeFreq: 'weekly' },
    { route: '/resources/insights', priority: 0.8, changeFreq: 'weekly' },
    { route: '/resources/case-studies', priority: 0.8, changeFreq: 'weekly' },
    { route: '/case-studies', priority: 0.8, changeFreq: 'weekly' },
    { route: '/trust', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/security', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/privacy', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/compliance', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/responsible-ai', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/business-continuity', priority: 0.7, changeFreq: 'monthly' },
    { route: '/trust/vulnerability-disclosure', priority: 0.7, changeFreq: 'monthly' },
    { route: '/company', priority: 0.7, changeFreq: 'monthly' },
    { route: '/company/about', priority: 0.7, changeFreq: 'monthly' },
    { route: '/company/leadership', priority: 0.7, changeFreq: 'monthly' },
    { route: '/company/investors', priority: 0.7, changeFreq: 'monthly' },
    { route: '/company/careers', priority: 0.7, changeFreq: 'weekly' },
    { route: '/company/contact', priority: 0.8, changeFreq: 'monthly' },
    { route: '/contact', priority: 0.8, changeFreq: 'monthly' },
    { route: '/book-strategy-session', priority: 0.9, changeFreq: 'monthly' },
    { route: '/legal', priority: 0.5, changeFreq: 'monthly' },
    { route: '/legal/privacy-policy', priority: 0.5, changeFreq: 'monthly' },
    { route: '/legal/terms', priority: 0.5, changeFreq: 'monthly' },
    { route: '/legal/cookies', priority: 0.5, changeFreq: 'monthly' },
    { route: '/search', priority: 0.3, changeFreq: 'monthly' },
    { route: '/industries/fintech', priority: 0.8, changeFreq: 'monthly' },
    { route: '/industries/financial-services', priority: 0.8, changeFreq: 'monthly' },
    { route: '/industries/life-sciences', priority: 0.8, changeFreq: 'monthly' },
    { route: '/industries/healthcare', priority: 0.8, changeFreq: 'monthly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ route, priority, changeFreq }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
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
