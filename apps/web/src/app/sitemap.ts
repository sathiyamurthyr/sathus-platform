import { MetadataRoute } from 'next';
import { allProducts } from '@/features/products/data';
import { allSolutions } from '@/features/solutions/data';
import { caseStudies } from '@/features/case-studies/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = 'https://www.sathus.in';

  // Core static routes with required priority rules
  const staticRoutes: Array<{ route: string; priority: number; changeFreq: 'daily' | 'weekly' | 'monthly' }> = [
    { route: '', priority: 1.0, changeFreq: 'daily' },
    { route: '/solutions', priority: 0.95, changeFreq: 'weekly' },
    { route: '/industries', priority: 0.95, changeFreq: 'weekly' },
    { route: '/products', priority: 0.95, changeFreq: 'weekly' },
    { route: '/resources', priority: 0.90, changeFreq: 'daily' },
    { route: '/company', priority: 0.90, changeFreq: 'weekly' },
    { route: '/company/about', priority: 0.90, changeFreq: 'monthly' },
    { route: '/company/why-sathus', priority: 0.90, changeFreq: 'monthly' },
    { route: '/company/partners', priority: 0.90, changeFreq: 'monthly' },
    { route: '/company/leadership', priority: 0.90, changeFreq: 'monthly' },
    { route: '/company/investors', priority: 0.90, changeFreq: 'monthly' },
    { route: '/company/careers', priority: 0.90, changeFreq: 'weekly' },
    { route: '/contact', priority: 0.85, changeFreq: 'monthly' },
    { route: '/book-strategy-session', priority: 0.95, changeFreq: 'monthly' },
    { route: '/case-studies', priority: 0.90, changeFreq: 'weekly' },
    { route: '/trust', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/security', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/privacy', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/compliance', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/responsible-ai', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/business-continuity', priority: 0.85, changeFreq: 'monthly' },
    { route: '/trust/vulnerability-disclosure', priority: 0.85, changeFreq: 'monthly' },
    { route: '/legal', priority: 0.60, changeFreq: 'monthly' },
    { route: '/legal/privacy-policy', priority: 0.60, changeFreq: 'monthly' },
    { route: '/legal/terms', priority: 0.60, changeFreq: 'monthly' },
    { route: '/legal/cookies', priority: 0.60, changeFreq: 'monthly' },
    { route: '/search', priority: 0.50, changeFreq: 'monthly' },
    { route: '/industries/fintech', priority: 0.90, changeFreq: 'monthly' },
    { route: '/industries/financial-services', priority: 0.90, changeFreq: 'monthly' },
    { route: '/industries/life-sciences', priority: 0.90, changeFreq: 'monthly' },
    { route: '/industries/healthcare', priority: 0.90, changeFreq: 'monthly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));

  const productEntries: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  const solutionEntries: MetadataRoute.Sitemap = allSolutions.map((s) => ({
    url: `${baseUrl}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,
  }));

  return [...staticEntries, ...productEntries, ...solutionEntries, ...caseStudyEntries];
}
