import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { ComplianceGrid } from '@/features/trust/components/ComplianceGrid';
import { ComplianceMatrix } from '@/components/interactive/compliance-matrix';
import { complianceFrameworks } from '@/features/trust/data';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

export const metadata: Metadata = generatePageMetadata({
  title: 'Regulatory Data Protection & Security Controls — Sathus',
  description: 'Enterprise security controls, zero-trust architecture, OWASP mitigation, and GDPR data sovereignty frameworks.',
  path: '/trust/compliance',
  keywords: [
    'Enterprise Security Controls',
    'Zero-Trust Architecture',
    'GDPR Data Sovereignty',
    'OWASP Security',
    'Enterprise Compliance Matrix',
  ],
});

export default function CompliancePage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 space-y-10">
        <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Compliance' }]} />
        <SectionIntro
          eyebrow="Trust Center"
          headingLevel="h1"
          title="Security & Regulatory Frameworks"
          description="Engineered security controls, zero-trust access policies, and GDPR data sovereignty standards."
        />

        {/* Interactive Enterprise Compliance Matrix */}
        <ComplianceMatrix />

        <ComplianceGrid frameworks={complianceFrameworks} />
      </div>
    </>
  );
}