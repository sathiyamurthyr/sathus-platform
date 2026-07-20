import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BusinessContinuity } from '@/features/trust/components/BusinessContinuity';
import { businessContinuityPlans } from '@/features/trust/data';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Business Continuity & Disaster Recovery',
  description: 'Our disaster recovery, RPO/RTO SLAs, and business continuity plans.',
  alternates: {
    canonical: '/trust/business-continuity',
  },
  openGraph: {
    title: 'Business Continuity — Sathus Technology',
    description: 'Our disaster recovery and business continuity plans.',
    url: `${siteConfig.url}/trust/business-continuity`,
    type: 'website',
  },
};

export default function BusinessContinuityPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Business Continuity' }]} />
      <SectionIntro
        eyebrow="Trust Center"
        title="Business Continuity & Resilience"
        description="RPO < 15 mins, RTO < 1 hour. Multi-region failover, automated backups, and incident response SLA guarantees."
      />
      <BusinessContinuity plans={businessContinuityPlans} />
    </div>
  );
}