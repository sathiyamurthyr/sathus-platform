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
import { aiEngineeringSolution } from '@/features/solutions/data/ai-engineering';
import { siteConfig } from '@/constants';


// Generate metadata for the page
export const metadata: Metadata = {
  title: 'AI Engineering',
  description:
    'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
  alternates: {
    canonical: '/solutions/ai-engineering',
  },
  openGraph: {
    title: 'AI Engineering — Sathus Technology',
    description:
      'Production-grade agentic systems with evaluation harnesses and enterprise-grade governance.',
    url: `${siteConfig.url}/solutions/ai-engineering`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Engineering — Sathus Technology',
    description:
      'Production-grade agentic systems with evaluation harnesses and enterprise-grade governance.',
  },
};

export default function AIEngineeringPage() {
  return (
    <>
      <ServiceJsonLd solution={aiEngineeringSolution} />
      <FAQPageJsonLd faqs={aiEngineeringSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: aiEngineeringSolution.title }]} />
      </div>
      <SolutionHero hero={aiEngineeringSolution.hero} />
      <BusinessChallenges challenges={aiEngineeringSolution.challenges} />
      <Capabilities capabilities={aiEngineeringSolution.capabilities} />
      <ArchitectureDiagram architecture={aiEngineeringSolution.architecture} />
      <TechnologyStack technologies={aiEngineeringSolution.technologies} />
      <DeliveryMethodology methodology={aiEngineeringSolution.methodology} />
      <BusinessOutcomes outcomes={aiEngineeringSolution.outcomes} />
      <CaseStudies caseStudies={aiEngineeringSolution.caseStudies} />
      <Faq faqs={aiEngineeringSolution.faqs} />
      <FinalCTA />
    </>
  );
}