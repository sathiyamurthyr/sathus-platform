import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { SecurityOverview } from '@/features/trust/components/SecurityOverview';
import { securityControls } from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Our security practices and controls for protecting enterprise data.',
  alternates: {
    canonical: '/trust/security',
  },
  openGraph: {
    title: 'Security — Sathus Technology',
    description: 'Our security practices and controls for protecting enterprise data.',
    url: `${SITE_URL}/trust/security`,
    type: 'website',
  },
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Trust Center"
        title="Security"
        description="Our security practices and controls for protecting enterprise data."
      />
      <SecurityOverview controls={securityControls} />
    </div>
  );
}