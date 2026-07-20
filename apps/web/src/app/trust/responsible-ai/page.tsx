import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ResponsibleAI } from '@/features/trust/components/ResponsibleAI';
import { responsibleAIPrinciples } from '@/features/trust/data';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Responsible AI',
  description: 'Our principles for responsible AI development, governance, evaluation, and safety.',
  alternates: {
    canonical: '/trust/responsible-ai',
  },
  openGraph: {
    title: 'Responsible AI — Sathus Technology',
    description: 'Our principles for responsible AI development and deployment.',
    url: `${siteConfig.url}/trust/responsible-ai`,
    type: 'website',
  },
};

export default function ResponsibleAIPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Breadcrumb items={[{ label: 'Trust Center', href: '/trust' }, { label: 'Responsible AI' }]} />
      <SectionIntro
        eyebrow="Trust Center"
        title="Responsible AI Principles"
        description="Our core commitments to AI transparency, automated evaluation harnesses, human oversight, and safety guardrails."
      />
      <ResponsibleAI principles={responsibleAIPrinciples} />
    </div>
  );
}