import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.sathus.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/private/',
          '/auth/',
          '/temp/',
          '/workspace/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/private/',
          '/auth/',
          '/temp/',
          '/workspace/',
        ],
      },
      {
        userAgent: ['Twitterbot', 'facebookexternalhit', 'LinkedInBot', 'Slackbot', 'WhatsApp'],
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/private/',
          '/auth/',
          '/workspace/',
        ],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Amazonbot', 'meta-externalagent'],
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/private/',
          '/auth/',
          '/workspace/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

