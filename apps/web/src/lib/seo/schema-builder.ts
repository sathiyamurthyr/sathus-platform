import { companyConfig } from '@/config/company';

const BASE_URL = 'https://www.sathus.in';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItemSchema {
  name: string;
  url: string;
}

export interface SoftwareAppSchemaProps {
  name: string;
  slug: string;
  description: string;
  category: string;
  operatingSystem?: string;
  features?: string[];
  price?: string;
  currency?: string;
  ratingValue?: number;
  reviewCount?: number;
}

export interface ServiceSchemaProps {
  name: string;
  slug: string;
  description: string;
  serviceType: string;
  offers?: { name: string; description: string }[];
}

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export interface JobPostingSchemaProps {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  location?: string;
}

export class SchemaBuilder {
  static getOrganization() {
    return companyConfig.getOrganizationSchema();
  }

  static getLocalBusiness() {
    return companyConfig.getLocalBusinessSchema();
  }

  static getContactPoint() {
    return companyConfig.getContactPointSchema();
  }

  static getWebSite() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Sathus Technology',
      alternateName: ['Sathus', 'Sathus.in', 'Sathus Platform'],
      url: BASE_URL,
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  static getWebPage(title: string, description: string, url: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}/#webpage`,
      url,
      name: title,
      description,
      isPartOf: {
        '@id': `${BASE_URL}/#website`,
      },
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      inLanguage: 'en-US',
    };
  }

  static getBreadcrumbs(items: BreadcrumbItemSchema[]) {
    const allItems = [{ name: 'Home', url: BASE_URL }, ...items];
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: allItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
      })),
    };
  }

  static getFAQ(faqs: FAQItem[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  static getService({ name, slug, description, serviceType, offers = [] }: ServiceSchemaProps) {
    const serviceUrl = `${BASE_URL}/solutions/${slug}`;
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${serviceUrl}/#service`,
      name,
      serviceType,
      url: serviceUrl,
      description,
      provider: {
        '@type': 'Organization',
        name: companyConfig.name,
        url: BASE_URL,
      },
      hasOfferCatalog: offers.length > 0 ? {
        '@type': 'OfferCatalog',
        name: `${name} Capabilities`,
        itemListElement: offers.map((offer) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: offer.name,
            description: offer.description,
          },
        })),
      } : undefined,
    };
  }

  static getSoftwareApplication({
    name,
    slug,
    description,
    category,
    operatingSystem = 'Cloud, Web Browser, macOS, Windows, Linux',
    features = [],
    price = '0',
    currency = 'USD',
    ratingValue = 4.9,
    reviewCount = 42,
  }: SoftwareAppSchemaProps) {
    const appUrl = `${BASE_URL}/products/${slug}`;
    return {
      '@context': 'https://schema.org',
      '@type': ['SoftwareApplication', 'Product'],
      '@id': `${appUrl}/#software`,
      name,
      url: appUrl,
      description,
      applicationCategory: category,
      operatingSystem,
      featureList: features.join(', '),
      author: {
        '@type': 'Organization',
        name: companyConfig.name,
        url: BASE_URL,
      },
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        url: appUrl,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue.toString(),
        ratingCount: reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Principal Enterprise Architect' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: `Production-grade ${name} deployment with 99.99% SLA and full auditability.`,
        },
      ],
    };
  }

  static getArticle({
    headline,
    description,
    url,
    image = `${BASE_URL}/opengraph-image`,
    datePublished,
    dateModified,
    authorName = 'Sathus Technology Principal Engineering',
  }: ArticleSchemaProps) {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${url}/#article`,
      headline,
      description,
      url,
      image,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Organization',
        name: authorName,
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: companyConfig.name,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/icon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
    };
  }

  static getPerson(name: string, title: string, linkedinUrl?: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      jobTitle: title,
      worksFor: {
        '@type': 'Organization',
        name: companyConfig.name,
        url: BASE_URL,
      },
      sameAs: linkedinUrl ? [linkedinUrl] : [],
    };
  }

  static getJobPosting({
    title,
    description,
    datePosted,
    validThrough,
    employmentType = 'FULL_TIME',
    location = 'Chennai, TN, India / Remote',
  }: JobPostingSchemaProps) {
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title,
      description,
      datePosted,
      validThrough,
      employmentType,
      hiringOrganization: {
        '@type': 'Organization',
        name: companyConfig.name,
        sameAs: BASE_URL,
        logo: `${BASE_URL}/icon.svg`,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chennai',
          addressRegion: 'Tamil Nadu',
          addressCountry: 'IN',
        },
      },
    };
  }
}
