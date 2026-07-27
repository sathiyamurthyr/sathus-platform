import React from 'react';
import { SchemaBuilder, FAQItem } from '@/lib/seo/schema-builder';
import type { Product } from '@/features/products/types';
import type { Solution } from '@/features/solutions/types';

export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SoftwareApplicationJsonLd({ product }: { product: Product }) {
  const schema = SchemaBuilder.getSoftwareApplication({
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: 'Enterprise Software',
    features: product.features ? product.features.map((f) => f.title) : [product.tagline],
  });
  return <JsonLdScript data={schema} />;
}

export function ServiceJsonLd({ solution }: { solution: Solution }) {
  const schema = SchemaBuilder.getService({
    name: solution.title,
    slug: solution.slug,
    description: solution.description,
    serviceType: solution.title,
    offers: solution.capabilities ? solution.capabilities.map((c) => ({ name: c.name, description: c.description })) : [],
  });
  return <JsonLdScript data={schema} />;
}

export function FAQPageJsonLd({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;
  const schema = SchemaBuilder.getFAQ(faqs);
  return <JsonLdScript data={schema} />;
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished = '2026-01-01',
  authorName = 'Sathus Technology Principal Engineering',
}: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  authorName?: string;
}) {
  const schema = SchemaBuilder.getArticle({
    headline,
    description,
    url,
    datePublished,
    authorName,
  });
  return <JsonLdScript data={schema} />;
}

export function OrganizationJsonLd() {
  return <JsonLdScript data={SchemaBuilder.getOrganization()} />;
}

export function LocalBusinessJsonLd() {
  return <JsonLdScript data={SchemaBuilder.getLocalBusiness()} />;
}

export function WebSiteJsonLd() {
  return <JsonLdScript data={SchemaBuilder.getWebSite()} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return <JsonLdScript data={SchemaBuilder.getBreadcrumbs(items)} />;
}
