import { describe, it, expect } from 'vitest';
import { companyConfig, getOrganizationSchema } from '@/config/company';
import { complianceFrameworks, trustFAQ } from '@/features/trust/data';
import { SchemaBuilder } from '@/lib/seo/schema-builder';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { metadata as notFoundMetadata } from '@/app/not-found';

describe('Business Claims Integrity & Technical SEO Regression Tests', () => {
  describe('1. Company Founding History & Legal Registration', () => {
    it('standardizes legal incorporation date and founding date to August 28, 2024', () => {
      expect(companyConfig.incorporationDate).toBe('2024-08-28');
      expect(companyConfig.foundingDate).toBe('2024-08-28');
    });

    it('emits accurate foundingDate in Organization JSON-LD structured data', () => {
      const orgSchema = getOrganizationSchema() as any;
      expect(orgSchema['@type']).toBe('Organization');
      expect(orgSchema.name).toContain('Sathus Technology');
      expect(orgSchema.legalName).toBe('Sathus Technology Pvt. Ltd.');
      expect(orgSchema.foundingDate).toBe('2024-08-28');
    });
  });

  describe('2. Accurate Compliance Terminology (SOC 2, ISO 27001, HIPAA)', () => {
    it('does not claim SOC 2, ISO 27001, or HIPAA certification in trust center frameworks', () => {
      const frameworkIds = complianceFrameworks.map((f) => f.id);
      expect(frameworkIds).not.toContain('soc2');
      expect(frameworkIds).not.toContain('iso27001');
      expect(frameworkIds).not.toContain('hipaa');

      const frameworkNames = complianceFrameworks.map((f) => f.name.toLowerCase());
      expect(frameworkNames.some((name) => name.includes('soc 2 certified'))).toBe(false);
      expect(frameworkNames.some((name) => name.includes('iso 27001 certified'))).toBe(false);
      expect(frameworkNames.some((name) => name.includes('hipaa certified'))).toBe(false);
    });

    it('clearly distinguishes achieved controls from future planned targets', () => {
      const achieved = complianceFrameworks.filter((f) => f.status === 'achieved');
      const planned = complianceFrameworks.filter((f) => f.status === 'planned');

      expect(achieved.length).toBeGreaterThan(0);
      expect(planned.length).toBeGreaterThan(0);

      // Verify that implemented frameworks represent concrete security controls
      const achievedIds = achieved.map((f) => f.id);
      expect(achievedIds).toContain('zero-trust');
      expect(achievedIds).toContain('gdpr');
      expect(achievedIds).toContain('owasp');
    });

    it('provides accurate, verified answers in trust FAQs without claiming ongoing audits', () => {
      const complianceFaq = trustFAQ.find((f) => f.id === 'compliance');
      expect(complianceFaq).toBeDefined();
      expect(complianceFaq?.answer).not.toMatch(/in progress/i);
      expect(complianceFaq?.answer).not.toMatch(/SOC 2 and ISO 27001 certifications are in progress/i);
      expect(complianceFaq?.answer).toMatch(/Zero-Trust/i);
    });
  });

  describe('3. 404 Noindex Behavior & Canonical Suppression', () => {
    it('suppresses root canonical URL and marks not-found page as noindex', () => {
      // In Next.js App Router, not-found page should explicitly disable index and drop canonical
      expect(notFoundMetadata.robots).toBeDefined();
      expect((notFoundMetadata.robots as any).index).toBe(false);
      expect((notFoundMetadata.robots as any).follow).toBe(false);
      expect(notFoundMetadata.alternates?.canonical).toBeNull();
    });
  });

  describe('4. Structured Data & Metadata Integrity', () => {
    it('does not emit synthetic ratings or reviews in SoftwareApplication schema', () => {
      const schema = SchemaBuilder.getSoftwareApplication({
        name: 'Memomes Cloud',
        slug: 'memomes-cloud',
        description: 'Zero-knowledge document storage platform',
        category: 'Document Storage',
        features: ['AES-256 Client-Side Encryption', 'Expiring Links'],
      });

      expect(schema.aggregateRating).toBeUndefined();
      expect(schema.review).toBeUndefined();
      expect(schema.offers).toBeDefined();
    });

    it('generates canonical URL correctly without trailing slashes', () => {
      const meta = generatePageMetadata({
        title: 'Platform Overview',
        description: 'Overview description',
        path: '/products',
      });

      expect(meta.alternates?.canonical).toBe('https://www.sathus.in/products');
    });
  });
});
