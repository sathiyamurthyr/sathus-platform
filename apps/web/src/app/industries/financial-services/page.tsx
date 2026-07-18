import { Metadata } from 'next';
import { IndustryHero } from '@/features/industries/components/IndustryHero';
import { IndustryOverview } from '@/features/industries/components/IndustryOverview';
import { IndustryChallenges } from '@/features/industries/components/IndustryChallenges';
import { SolutionsGrid } from '@/features/industries/components/SolutionsGrid';
import { ReferenceArchitecture } from '@/features/industries/components/ReferenceArchitecture';
import { BusinessOutcomes } from '@/features/industries/components/BusinessOutcomes';
import { TechnologyStack } from '@/features/industries/components/TechnologyStack';
import { CaseStudies } from '@/features/industries/components/CaseStudies';
import { FAQ } from '@/features/industries/components/FAQ';
import { CTA } from '@/features/industries/components/CTA';
import { financialServicesIndustry } from '@/features/industries';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Financial Services',
  description: 'Engineering platforms for banking, insurance, and capital markets with security, compliance, and scale.',
  alternates: {
    canonical: '/industries/financial-services',
  },
  openGraph: {
    title: 'Financial Services Solutions — Sathus Technology',
    description: 'Engineering platforms for banking, insurance, and capital markets with security, compliance, and scale.',
    url: `${SITE_URL}/industries/financial-services`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Services Solutions — Sathus Technology',
    description: 'Engineering platforms for banking, insurance, and capital markets with security, compliance, and scale.',
  },
};

export default function FinancialServicesPage() {
  return (
    <>
      <IndustryHero hero={financialServicesIndustry.hero} />
      <IndustryOverview overview={financialServicesIndustry.overview} />
      <IndustryChallenges challenges={financialServicesIndustry.challenges} />
      <SolutionsGrid solutions={financialServicesIndustry.solutions} />
      <ReferenceArchitecture architecture={financialServicesIndustry.architecture} />
      <TechnologyStack technologies={financialServicesIndustry.technologies} />
      <BusinessOutcomes outcomes={financialServicesIndustry.outcomes} />
      <CaseStudies caseStudies={financialServicesIndustry.caseStudies} />
      <FAQ faqs={financialServicesIndustry.faqs} />
      <CTA />
    </>
  );
}