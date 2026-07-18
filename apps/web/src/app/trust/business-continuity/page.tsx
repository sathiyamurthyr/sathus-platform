import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { BusinessContinuity } from '@/features/trust/components/BusinessContinuity';
import { businessContinuityPlans } from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Business Continuity',
  description: 'Our business continuity and disaster recovery practices.',
  alternates: {
    canonical: '/trust/business-continuity',
  },
  openGraph: {
    title: 'Business Continuity — Sathus Technology',
    description: 'Our business continuity and disaster recovery practices.',
    url: `${SITE_URL}/trust/business-continuity`,
    type: 'website',
  },
};

export default function BusinessContinuityPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Trust Center"
        title="Business Continuity"
        description="Our business continuity and disaster recovery practices."
      />
      <BusinessContinuity plans={businessContinuityPlans} />
    </div>
  );
}