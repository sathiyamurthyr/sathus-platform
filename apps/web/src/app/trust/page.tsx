import { Metadata } from 'next';
import { TrustHero } from '@/features/trust/components/TrustHero';
import { SecurityOverview } from '@/features/trust/components/SecurityOverview';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { PrivacyPrinciples } from '@/features/trust/components/PrivacyPrinciples';
import { ResponsibleAI } from '@/features/trust/components/ResponsibleAI';
import { BusinessContinuity } from '@/features/trust/components/BusinessContinuity';
import { Faq } from '@/features/trust/components/Faq';
import { Cta } from '@/features/trust/components/Cta';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/json-ld';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import {
  securityControls,
  complianceFrameworks,
  privacyPrinciples,
  responsibleAIPrinciples,
  businessContinuityPlans,
  trustFAQ,
} from '@/features/trust/data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Trust Center — Security, Privacy & Data Protection',
  description: 'Our commitment to enterprise security posture, zero-trust architecture, GDPR data sovereignty, and responsible AI governance.',
  path: '/trust',
  keywords: [
    'Sathus Trust Center',
    'Zero-trust security',
    'Data sovereignty',
    'GDPR compliance',
    'Responsible AI framework',
    'Enterprise encryption',
  ],
});

export default function TrustPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Trust Center', url: '/trust' }]} />
      {trustFAQ && trustFAQ.length > 0 && (
        <FAQPageJsonLd faqs={trustFAQ.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}
      <TrustHero />
      <SecurityOverview controls={securityControls} />
      <ComplianceGrid frameworks={complianceFrameworks} />
      <PrivacyPrinciples principles={privacyPrinciples} />
      <ResponsibleAI principles={responsibleAIPrinciples} />
      <BusinessContinuity plans={businessContinuityPlans} />
      <Faq faq={trustFAQ} />
      <Cta />
    </>
  );
}