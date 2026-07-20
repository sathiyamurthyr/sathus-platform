import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Sathus Technology Privacy Policy and data protection commitments for enterprise clients.',
  alternates: {
    canonical: '/legal/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy — Sathus Technology',
    description: 'Sathus Technology Privacy Policy and data protection commitments.',
    url: `${siteConfig.url}/legal/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Legal', href: '/legal' }, { label: 'Privacy Policy' }]} />
      <SectionIntro
        eyebrow="Legal Policy"
        title="Privacy Policy"
        description="Effective Date: July 2026. This Privacy Policy details how Sathus Technology Pvt. Ltd. collects, uses, and safeguards enterprise data."
      />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Data Ownership & Zero Retention</h2>
          <p>
            Sathus Technology does not claim ownership over client data, code, or prompts processed by our software solutions. Enterprise data processed via Sathus AI or Memomes Cloud operates under strict zero-retention guidelines and is never utilized to train public machine learning models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Information Collection & Ingestion</h2>
          <p>
            We collect information provided directly during enterprise consultations, account creation, or technical support requests (such as name, corporate email, and organization domain). Platform logs are encrypted at rest with AES-256 and retained solely for auditing purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Regulatory Compliance (GDPR & HIPAA)</h2>
          <p>
            All data processing facilities align with EU General Data Protection Regulation (GDPR) mandates and HIPAA Business Associate Agreement (BAA) requirements for healthcare data ingestion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Contact Privacy Officer</h2>
          <p>
            For privacy inquiries or data erasure requests under GDPR/CCPA, contact our Data Protection Officer at <span className="text-foreground font-medium">privacy@sathus.technology</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
