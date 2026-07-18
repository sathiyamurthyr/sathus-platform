import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { PrivacyPrinciples } from '@/features/trust/components/PrivacyPrinciples';
import { privacyPrinciples } from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Our privacy principles and how we handle your data.',
  alternates: {
    canonical: '/trust/privacy',
  },
  openGraph: {
    title: 'Privacy — Sathus Technology',
    description: 'Our privacy principles and how we handle your data.',
    url: `${SITE_URL}/trust/privacy`,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Trust Center"
        title="Privacy"
        description="Our privacy principles and how we handle your data."
      />
      <PrivacyPrinciples principles={privacyPrinciples} />
    </div>
  );
}