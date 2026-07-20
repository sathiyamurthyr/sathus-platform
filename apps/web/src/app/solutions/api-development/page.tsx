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
import { apiDevelopmentSolution } from '@/features/solutions/data/api-development';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'API Engineering & FastAPI Microservices',
  description: apiDevelopmentSolution.description,
  alternates: { canonical: '/solutions/api-development' },
  openGraph: {
    title: 'API Engineering — Sathus Technology',
    description: apiDevelopmentSolution.description,
    url: `${siteConfig.url}/solutions/api-development`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Engineering — Sathus Technology',
    description: apiDevelopmentSolution.description,
  },
};

export default function ApiDevelopmentPage() {
  return (
    <>
      <ServiceJsonLd solution={apiDevelopmentSolution} />
      <FAQPageJsonLd faqs={apiDevelopmentSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: apiDevelopmentSolution.title }]} />
      </div>
      <SolutionHero hero={apiDevelopmentSolution.hero} />
      <BusinessChallenges challenges={apiDevelopmentSolution.challenges} />
      <Capabilities capabilities={apiDevelopmentSolution.capabilities} />
      <ArchitectureDiagram architecture={apiDevelopmentSolution.architecture} />
      <TechnologyStack technologies={apiDevelopmentSolution.technologies} />
      <DeliveryMethodology methodology={apiDevelopmentSolution.methodology} />
      <BusinessOutcomes outcomes={apiDevelopmentSolution.outcomes} />
      <CaseStudies caseStudies={apiDevelopmentSolution.caseStudies} />
      <Faq faqs={apiDevelopmentSolution.faqs} />
      <FinalCTA />
    </>
  );
}
