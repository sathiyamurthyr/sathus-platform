import React from 'react';
import { siteConfig } from '@/constants';
import { companyConfig } from '@/config/company';
import type { Product } from '@/features/products/types';
import type { Solution } from '@/features/solutions/types';

interface SoftwareApplicationJsonLdProps {
  product: Product;
}

export function SoftwareApplicationJsonLd({ product }: SoftwareApplicationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    applicationCategory: 'Enterprise Application',
    operatingSystem: 'Cloud / Cross-platform',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: companyConfig.name,
      url: companyConfig.website,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceJsonLdProps {
  solution: Solution;
}

export function ServiceJsonLd({ solution }: ServiceJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.title,
    description: solution.description,
    serviceType: solution.title,
    provider: {
      '@type': 'Organization',
      name: companyConfig.name,
      url: companyConfig.website,
    },
    termsOfService: `${companyConfig.website}/legal/terms`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageJsonLdProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQPageJsonLd({ faqs }: FAQPageJsonLdProps) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  authorName?: string;
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished = '2026-01-01',
  authorName = 'Sathus Engineering Team',
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${companyConfig.website}${url}`,
    datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: companyConfig.name,
      url: companyConfig.website,
      logo: `${companyConfig.website}/icon.svg`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ContactPageJsonLdProps {
  title?: string;
  description?: string;
}

export function ContactPageJsonLd({
  title = `Contact ${companyConfig.name}`,
  description = `Reach out to ${companyConfig.name} engineering, sales, and executive teams.`,
}: ContactPageJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: title,
    description,
    url: `${companyConfig.website}/contact`,
    mainEntity: companyConfig.getOrganizationSchema(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(companyConfig.getOrganizationSchema()) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(companyConfig.getLocalBusinessSchema()) }}
    />
  );
}

