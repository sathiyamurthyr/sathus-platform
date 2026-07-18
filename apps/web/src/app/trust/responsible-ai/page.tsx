import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ResponsibleAI } from '@/features/trust/components/ResponsibleAI';
import { responsibleAIPrinciples } from '@/features/trust/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Responsible AI',
  description: 'Our principles for responsible AI development and deployment.',
  alternates: {
    canonical: '/trust/responsible-ai',
  },
  openGraph: {
    title: 'Responsible AI — Sathus Technology',
    description: 'Our principles for responsible AI development and deployment.',
    url: `${SITE_URL}/trust/responsible-ai`,
    type: 'website',
  },
};

export default function ResponsibleAIPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Trust Center"
        title="Responsible AI"
        description="Our principles for responsible AI development and deployment."
      />
      <ResponsibleAI principles={responsibleAIPrinciples} />
    </div>
  );
}