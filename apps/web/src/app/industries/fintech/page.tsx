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
import { fintechIndustry } from '@/features/industries';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'FinTech',
  description: 'Engineering platforms for digital banking, payments, and financial services with security, compliance, and scale.',
  alternates: {
    canonical: '/industries/fintech',
  },
  openGraph: {
    title: 'FinTech Solutions — Sathus Technology',
    description: 'Engineering platforms for digital banking, payments, and financial services with security, compliance, and scale.',
    url: `${SITE_URL}/industries/fintech`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinTech Solutions — Sathus Technology',
    description: 'Engineering platforms for digital banking, payments, and financial services with security, compliance, and scale.',
  },
};

export default function FinTechPage() {
  return (
    <>
      <IndustryHero hero={fintechIndustry.hero} />
      <IndustryOverview overview={fintechIndustry.overview} />
      <IndustryChallenges challenges={fintechIndustry.challenges} />
      <SolutionsGrid solutions={fintechIndustry.solutions} />
      <ReferenceArchitecture architecture={fintechIndustry.architecture} />
      <TechnologyStack technologies={fintechIndustry.technologies} />
      <BusinessOutcomes outcomes={fintechIndustry.outcomes} />
      <CaseStudies caseStudies={fintechIndustry.caseStudies} />
      <FAQ faqs={fintechIndustry.faqs} />
      <CTA />
    </>
  );
}