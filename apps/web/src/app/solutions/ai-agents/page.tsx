import { Metadata } from 'next';
import { SolutionHero } from '@/features/solutions/components/SolutionHero';
import { BusinessChallenges } from '@/features/solutions/components/BusinessChallenges';
import { Capabilities } from '@/features/solutions/components/Capabilities';
import { ArchitectureDiagram } from '@/features/solutions/components/ArchitectureDiagram';
import { TechnologyStack } from '@/features/solutions/components/TechnologyStack';
import { DeliveryMethodology } from '@/features/solutions/components/DeliveryMethodology';
import { BusinessOutcomes } from '@/features/solutions/components/BusinessOutcomes';
import { CaseStudies } from '@/features/solutions/components/CaseStudies';
import { Faq } from '@/features/solutions/components/Faq';
import { FinalCTA } from '@/features/solutions/components/FinalCTA';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ServiceJsonLd, FAQPageJsonLd } from '@/components/seo/json-ld';
import { aiAgentsSolution } from '@/features/solutions/data/ai-agents';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Autonomous AI Agents & Swarm Systems',
  description: aiAgentsSolution.description,
  alternates: { canonical: '/solutions/ai-agents' },
  openGraph: {
    title: 'AI Agents — Sathus Technology',
    description: aiAgentsSolution.description,
    url: `${siteConfig.url}/solutions/ai-agents`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agents — Sathus Technology',
    description: aiAgentsSolution.description,
  },
};

export default function AiAgentsPage() {
  return (
    <>
      <ServiceJsonLd solution={aiAgentsSolution} />
      <FAQPageJsonLd faqs={aiAgentsSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: aiAgentsSolution.title }]} />
      </div>
      <SolutionHero hero={aiAgentsSolution.hero} />
      <BusinessChallenges challenges={aiAgentsSolution.challenges} />
      <Capabilities capabilities={aiAgentsSolution.capabilities} />
      <ArchitectureDiagram architecture={aiAgentsSolution.architecture} />
      <TechnologyStack technologies={aiAgentsSolution.technologies} />
      <DeliveryMethodology methodology={aiAgentsSolution.methodology} />
      <BusinessOutcomes outcomes={aiAgentsSolution.outcomes} />
      <CaseStudies caseStudies={aiAgentsSolution.caseStudies} />
      <Faq faqs={aiAgentsSolution.faqs} />
      <FinalCTA />
    </>
  );
}
