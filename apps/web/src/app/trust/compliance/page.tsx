import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { complianceFrameworks } from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Compliance',
  description: 'Our compliance frameworks and certifications.',
  alternates: {
    canonical: '/trust/compliance',
  },
  openGraph: {
    title: 'Compliance — Sathus Technology',
    description: 'Our compliance frameworks and certifications.',
    url: `${SITE_URL}/trust/compliance`,
    type: 'website',
  },
};

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Trust Center"
        title="Compliance"
        description="Our compliance frameworks and certifications."
      />
      <ComplianceGrid frameworks={complianceFrameworks} />
    </div>
  );
}