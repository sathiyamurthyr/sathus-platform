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
import { genAiSolution } from '@/features/solutions/data/genai';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'GenAI Solutions — Enterprise Generative AI Engineering',
  description: genAiSolution.description,
  alternates: { canonical: '/solutions/genai' },
  openGraph: {
    title: 'GenAI Solutions — Sathus Technology',
    description: genAiSolution.description,
    url: `${siteConfig.url}/solutions/genai`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenAI Solutions — Sathus Technology',
    description: genAiSolution.description,
  },
};

export default function GenAiPage() {
  return (
    <>
      <ServiceJsonLd solution={genAiSolution} />
      <FAQPageJsonLd faqs={genAiSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: genAiSolution.title }]} />
      </div>
      <SolutionHero hero={genAiSolution.hero} />
      <BusinessChallenges challenges={genAiSolution.challenges} />
      <Capabilities capabilities={genAiSolution.capabilities} />
      <ArchitectureDiagram architecture={genAiSolution.architecture} />
      <TechnologyStack technologies={genAiSolution.technologies} />
      <DeliveryMethodology methodology={genAiSolution.methodology} />
      <BusinessOutcomes outcomes={genAiSolution.outcomes} />
      <CaseStudies caseStudies={genAiSolution.caseStudies} />
      <Faq faqs={genAiSolution.faqs} />
      <FinalCTA />
    </>
  );
}
