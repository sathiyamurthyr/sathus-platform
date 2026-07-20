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
import { mcpDevelopmentSolution } from '@/features/solutions/data/mcp-development';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Model Context Protocol (MCP) Development',
  description: mcpDevelopmentSolution.description,
  alternates: { canonical: '/solutions/mcp-development' },
  openGraph: {
    title: 'MCP Development — Sathus Technology',
    description: mcpDevelopmentSolution.description,
    url: `${siteConfig.url}/solutions/mcp-development`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCP Development — Sathus Technology',
    description: mcpDevelopmentSolution.description,
  },
};

export default function McpDevelopmentPage() {
  return (
    <>
      <ServiceJsonLd solution={mcpDevelopmentSolution} />
      <FAQPageJsonLd faqs={mcpDevelopmentSolution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions', href: '/solutions' }, { label: mcpDevelopmentSolution.title }]} />
      </div>
      <SolutionHero hero={mcpDevelopmentSolution.hero} />
      <BusinessChallenges challenges={mcpDevelopmentSolution.challenges} />
      <Capabilities capabilities={mcpDevelopmentSolution.capabilities} />
      <ArchitectureDiagram architecture={mcpDevelopmentSolution.architecture} />
      <TechnologyStack technologies={mcpDevelopmentSolution.technologies} />
      <DeliveryMethodology methodology={mcpDevelopmentSolution.methodology} />
      <BusinessOutcomes outcomes={mcpDevelopmentSolution.outcomes} />
      <CaseStudies caseStudies={mcpDevelopmentSolution.caseStudies} />
      <Faq faqs={mcpDevelopmentSolution.faqs} />
      <FinalCTA />
    </>
  );
}
