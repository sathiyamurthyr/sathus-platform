// Types
export type {
  Industry,
  IndustryHero as IndustryHeroData,
  IndustryOverview as IndustryOverviewData,
  IndustryChallenge,
  IndustrySolution,
  Technology,
  BusinessOutcome,
  Architecture,
  CaseStudyReference,
  FAQ as IndustryFAQ,
} from './types';

// Data
export { financialServicesIndustry } from './data/financial-services';
export { fintechIndustry } from './data/fintech';
export { lifeSciencesIndustry } from './data/life-sciences';
export { healthcareIndustry } from './data/healthcare';

// Components
export { IndustryHero } from './components/IndustryHero';
export { IndustryOverview } from './components/IndustryOverview';
export { IndustryChallenges } from './components/IndustryChallenges';
export { SolutionsGrid } from './components/SolutionsGrid';
export { ReferenceArchitecture } from './components/ReferenceArchitecture';
export { TechnologyStack } from './components/TechnologyStack';
export { BusinessOutcomes } from './components/BusinessOutcomes';
export { CaseStudies } from './components/CaseStudies';
export { FAQ } from './components/FAQ';
export { CTA } from './components/CTA';
