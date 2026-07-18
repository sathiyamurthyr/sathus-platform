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
import { aiEngineeringSolution } from '@/features/solutions/data/ai-engineering';

const SITE_URL = 'https://sathus.in';

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
    url: `${SITE_URL}/solutions/ai-engineering`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Engineering — Sathus Technology',
    description:
      'Production-grade agentic systems with evaluation harnesses and enterprise-grade governance.',
  },
};

// JSON-LD schemas
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Solutions',
      item: `${SITE_URL}/solutions`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'AI Engineering',
      item: `${SITE_URL}/solutions/ai-engineering`,
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: aiEngineeringSolution.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function AIEngineeringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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