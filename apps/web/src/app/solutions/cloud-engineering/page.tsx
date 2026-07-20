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
import { cloudEngineeringSolution } from '@/features/solutions/data/cloud-engineering';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Cloud Engineering & Infrastructure as Code',
  description: cloudEngineeringSolution.description,
  alternates: { canonical: '/solutions/cloud-engineering' },
  openGraph: {
    title: 'Cloud Engineering — Sathus Technology',
    description: cloudEngineeringSolution.description,
    url: `${siteConfig.url}/solutions/cloud-engineering`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Engineering — Sathus Technology',
    description: cloudEngineeringSolution.description,
  },
};

export default function CloudEngineeringPage() {
  return (
    <>
      <ServiceJsonLd solution={cloudEngineeringSolution} />
      <FAQPageJsonLd faqs={cloudEngineeringSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: cloudEngineeringSolution.title }]} />
      </div>
      <SolutionHero hero={cloudEngineeringSolution.hero} />
      <BusinessChallenges challenges={cloudEngineeringSolution.challenges} />
      <Capabilities capabilities={cloudEngineeringSolution.capabilities} />
      <ArchitectureDiagram architecture={cloudEngineeringSolution.architecture} />
      <TechnologyStack technologies={cloudEngineeringSolution.technologies} />
      <DeliveryMethodology methodology={cloudEngineeringSolution.methodology} />
      <BusinessOutcomes outcomes={cloudEngineeringSolution.outcomes} />
      <CaseStudies caseStudies={cloudEngineeringSolution.caseStudies} />
      <Faq faqs={cloudEngineeringSolution.faqs} />
      <FinalCTA />
    </>
  );
}
