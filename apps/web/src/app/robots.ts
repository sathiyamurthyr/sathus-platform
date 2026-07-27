import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.sathus.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/dashboard',
          '/api',
          '/private',
          '/auth',
          '/temp',
          '/_next/',
          '/workspace/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api', '/private', '/auth', '/temp'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api', '/private', '/auth', '/temp'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
