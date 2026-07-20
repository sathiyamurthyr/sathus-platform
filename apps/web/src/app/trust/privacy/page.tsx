import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PrivacyPrinciples } from '@/features/trust/components/PrivacyPrinciples';
import { privacyPrinciples } from '@/features/trust/data';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Privacy Framework',
  description: 'Our data privacy principles, GDPR compliance, and zero-retention commitments.',
  alternates: {
    canonical: '/trust/privacy',
  },
  openGraph: {
    title: 'Privacy Framework — Sathus Technology',
    description: 'Our data privacy principles, GDPR compliance, and zero-retention commitments.',
    url: `${siteConfig.url}/trust/privacy`,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Privacy' }]} />
      <SectionIntro
        eyebrow="Trust Center"
        title="Data Privacy Framework"
        description="We process enterprise data under strict zero-knowledge and zero-retention architectures."
      />
      <PrivacyPrinciples principles={privacyPrinciples} />
    </div>
  );
}