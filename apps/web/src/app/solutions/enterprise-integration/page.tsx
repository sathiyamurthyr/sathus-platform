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
import { enterpriseIntegrationSolution } from '@/features/solutions/data/enterprise-integration';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Enterprise Integration & Event Mesh',
  description: enterpriseIntegrationSolution.description,
  alternates: { canonical: '/solutions/enterprise-integration' },
  openGraph: {
    title: 'Enterprise Integration — Sathus Technology',
    description: enterpriseIntegrationSolution.description,
    url: `${siteConfig.url}/solutions/enterprise-integration`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Integration — Sathus Technology',
    description: enterpriseIntegrationSolution.description,
  },
};

export default function EnterpriseIntegrationPage() {
  return (
    <>
      <ServiceJsonLd solution={enterpriseIntegrationSolution} />
      <FAQPageJsonLd faqs={enterpriseIntegrationSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: enterpriseIntegrationSolution.title }]} />
      </div>
      <SolutionHero hero={enterpriseIntegrationSolution.hero} />
      <BusinessChallenges challenges={enterpriseIntegrationSolution.challenges} />
      <Capabilities capabilities={enterpriseIntegrationSolution.capabilities} />
      <ArchitectureDiagram architecture={enterpriseIntegrationSolution.architecture} />
      <TechnologyStack technologies={enterpriseIntegrationSolution.technologies} />
      <DeliveryMethodology methodology={enterpriseIntegrationSolution.methodology} />
      <BusinessOutcomes outcomes={enterpriseIntegrationSolution.outcomes} />
      <CaseStudies caseStudies={enterpriseIntegrationSolution.caseStudies} />
      <Faq faqs={enterpriseIntegrationSolution.faqs} />
      <FinalCTA />
    </>
  );
}
