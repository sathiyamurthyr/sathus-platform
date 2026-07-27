import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { ComplianceMatrix } from '@/components/interactive/compliance-matrix';
import { complianceFrameworks } from '@/features/trust/data';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

export const metadata: Metadata = generatePageMetadata({
  title: 'Compliance Frameworks — SOC 2 Type II, HIPAA & ISO 27001 Audits',
  description: 'Independent third-party audits, SOC 2 Type II attestations, ISO 27001 certification, and HIPAA healthcare compliance alignments.',
  path: '/trust/compliance',
  keywords: [
    'SOC 2 Type II Compliance',
    'HIPAA Compliance AI',
    'ISO 27001 Certification',
    'GDPR EU Sovereignty',
    'Enterprise Compliance Matrix',
  ],
});

export default function CompliancePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Trust Center', url: '/trust' },
          { name: 'Compliance', url: '/trust/compliance' },
        ]}
      />

      <div className="container mx-auto px-4 py-12 space-y-10">
        <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Compliance' }]} />
        <SectionIntro
          eyebrow="Trust Center"
          title="Regulatory Compliance Frameworks"
          description="Independent third-party audits, SOC 2 Type II attestations, ISO 27001, and HIPAA compliance alignments."
        />

        {/* Interactive Enterprise Compliance Matrix */}
        <ComplianceMatrix />

        <ComplianceGrid frameworks={complianceFrameworks} />
      </div>
    </>
  );
}