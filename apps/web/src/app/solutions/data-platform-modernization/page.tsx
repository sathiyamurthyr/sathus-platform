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
import { dataPlatformModernizationSolution } from '@/features/solutions/data/data-platform-modernization';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Data Platform & Lakehouse Modernization',
  description: dataPlatformModernizationSolution.description,
  alternates: { canonical: '/solutions/data-platform-modernization' },
  openGraph: {
    title: 'Data Platform Modernization — Sathus Technology',
    description: dataPlatformModernizationSolution.description,
    url: `${siteConfig.url}/solutions/data-platform-modernization`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Platform Modernization — Sathus Technology',
    description: dataPlatformModernizationSolution.description,
  },
};

export default function DataPlatformModernizationPage() {
  return (
    <>
      <ServiceJsonLd solution={dataPlatformModernizationSolution} />
      <FAQPageJsonLd faqs={dataPlatformModernizationSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: dataPlatformModernizationSolution.title }]} />
      </div>
      <SolutionHero hero={dataPlatformModernizationSolution.hero} />
      <BusinessChallenges challenges={dataPlatformModernizationSolution.challenges} />
      <Capabilities capabilities={dataPlatformModernizationSolution.capabilities} />
      <ArchitectureDiagram architecture={dataPlatformModernizationSolution.architecture} />
      <TechnologyStack technologies={dataPlatformModernizationSolution.technologies} />
      <DeliveryMethodology methodology={dataPlatformModernizationSolution.methodology} />
      <BusinessOutcomes outcomes={dataPlatformModernizationSolution.outcomes} />
      <CaseStudies caseStudies={dataPlatformModernizationSolution.caseStudies} />
      <Faq faqs={dataPlatformModernizationSolution.faqs} />
      <FinalCTA />
    </>
  );
}
