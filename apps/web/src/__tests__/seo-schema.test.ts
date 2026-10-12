import { describe, it, expect } from 'vitest';
import { SchemaBuilder } from '@/lib/seo/schema-builder';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

describe('SEO Schema & Metadata Builder', () => {
  it('does not emit synthetic reviews or aggregateRating by default in getSoftwareApplication', () => {
    const schema = SchemaBuilder.getSoftwareApplication({
      name: 'Sathus AI',
      slug: 'sathus-ai',
      description: 'Enterprise AI Agent Platform',
      category: 'Enterprise Software',
      features: ['Multi-agent orchestration', 'Model Context Protocol'],
    });

    expect(schema['@type']).toEqual(['SoftwareApplication', 'Product']);
    expect(schema.name).toBe('Sathus AI');
    expect(schema.aggregateRating).toBeUndefined();
    expect(schema.review).toBeUndefined();
    expect(schema.offers).toBeDefined();
  });

  it('generates correct canonical URL and clean title without duplicate brand suffixes', () => {
    const meta = generatePageMetadata({
      title: 'Pricing | Sathus Technology',
      description: 'Enterprise pricing details.',
      path: '/pricing',
    });

    expect(meta.alternates?.canonical).toBe('https://www.sathus.in/pricing');
    expect(meta.title).toBe('Pricing');
  });

  it('generates correct homepage canonical URL without trailing slash', () => {
    const meta = generatePageMetadata({
      title: 'Enterprise AI & Data Engineering',
      description: 'Homepage description.',
      path: '/',
    });

    expect(meta.alternates?.canonical).toBe('https://www.sathus.in');
  });
});
