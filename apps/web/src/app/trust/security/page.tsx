import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SecurityOverview } from '@/features/trust/components/SecurityOverview';
import { securityControls } from '@/features/trust/data';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Our security practices and controls for protecting enterprise data.',
  alternates: {
    canonical: '/trust/security',
  },
  openGraph: {
    title: 'Security — Sathus Technology',
    description: 'Our security practices and controls for protecting enterprise data.',
    url: `${siteConfig.url}/trust/security`,
    type: 'website',
  },
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Security' }]} />
      <SectionIntro
        eyebrow="Trust Center"
        title="Security Architecture & Controls"
        description="Our multi-layered security controls, encryption protocols, and SOC 2 Type II compliance standards for enterprise data."
      />
      <SecurityOverview controls={securityControls} />
    </div>
  );
}