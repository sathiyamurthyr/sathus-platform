import { Metadata } from 'next';
import { TrustHero } from '@/features/trust/components/TrustHero';
import { SecurityOverview } from '@/features/trust/components/SecurityOverview';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { PrivacyPrinciples } from '@/features/trust/components/PrivacyPrinciples';
import { ResponsibleAI } from '@/features/trust/components/ResponsibleAI';
import { BusinessContinuity } from '@/features/trust/components/BusinessContinuity';
import { Faq } from '@/features/trust/components/Faq';
import { Cta } from '@/features/trust/components/Cta';
import {
  securityControls,
  complianceFrameworks,
  privacyPrinciples,
  responsibleAIPrinciples,
  businessContinuityPlans,
  trustFAQ,
} from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Trust Center',
  description: 'Our commitment to security, privacy, and compliance for enterprise customers.',
  alternates: {
    canonical: '/trust',
  },
  openGraph: {
    title: 'Trust Center — Sathus Technology',
    description: 'Our commitment to security, privacy, and compliance for enterprise customers.',
    url: `${SITE_URL}/trust`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trust Center — Sathus Technology',
    description: 'Our commitment to security, privacy, and compliance for enterprise customers.',
  },
};

export default function TrustPage() {
  return (
    <>
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