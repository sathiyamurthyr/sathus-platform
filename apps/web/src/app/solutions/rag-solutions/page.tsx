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
import { ragSolutionsSolution } from '@/features/solutions/data/rag-solutions';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Enterprise RAG & Knowledge Systems',
  description: ragSolutionsSolution.description,
  alternates: { canonical: '/solutions/rag-solutions' },
  openGraph: {
    title: 'Enterprise RAG Solutions — Sathus Technology',
    description: ragSolutionsSolution.description,
    url: `${siteConfig.url}/solutions/rag-solutions`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise RAG Solutions — Sathus Technology',
    description: ragSolutionsSolution.description,
  },
};

export default function RagSolutionsPage() {
  return (
    <>
      <ServiceJsonLd solution={ragSolutionsSolution} />
      <FAQPageJsonLd faqs={ragSolutionsSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: ragSolutionsSolution.title }]} />
      </div>
      <SolutionHero hero={ragSolutionsSolution.hero} />
      <BusinessChallenges challenges={ragSolutionsSolution.challenges} />
      <Capabilities capabilities={ragSolutionsSolution.capabilities} />
      <ArchitectureDiagram architecture={ragSolutionsSolution.architecture} />
      <TechnologyStack technologies={ragSolutionsSolution.technologies} />
      <DeliveryMethodology methodology={ragSolutionsSolution.methodology} />
      <BusinessOutcomes outcomes={ragSolutionsSolution.outcomes} />
      <CaseStudies caseStudies={ragSolutionsSolution.caseStudies} />
      <Faq faqs={ragSolutionsSolution.faqs} />
      <FinalCTA />
    </>
  );
}
