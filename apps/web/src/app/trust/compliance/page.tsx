import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { complianceFrameworks } from '@/features/trust/data';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Compliance Frameworks',
  description: 'Our certifications, audits, and compliance alignments including SOC 2, ISO 27001, and HIPAA.',
  alternates: {
    canonical: '/trust/compliance',
  },
  openGraph: {
    title: 'Compliance Frameworks — Sathus Technology',
    description: 'Our certifications, audits, and compliance alignments.',
    url: `${siteConfig.url}/trust/compliance`,
    type: 'website',
  },
};

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Compliance' }]} />
      <SectionIntro
        eyebrow="Trust Center"
        title="Regulatory Compliance Frameworks"
        description="Independent third-party audits, SOC 2 Type II attestations, ISO 27001, and HIPAA compliance alignments."
      />
      <ComplianceGrid frameworks={complianceFrameworks} />
    </div>
  );
}