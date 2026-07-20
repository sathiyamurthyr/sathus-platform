import { MetadataRoute } from 'next';
import { siteConfig } from '@/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/auth/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
