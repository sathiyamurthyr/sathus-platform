// Types
export type {
  CaseStudy,
  Architecture,
  Technology,
  Metric,
  Timeline,
  TimelinePhase,
  Outcome,
  Testimonial,
  SEO,
  CaseStudyFilters,
} from './types';

// Data
export {
  caseStudies,
  getIndustries,
  getTechnologies,
  getSolutions,
  getFeaturedCaseStudies,
  getCaseStudyBySlug,
  filterCaseStudies,
} from './data';

// Components
export { CaseStudyCard } from './components/CaseStudyCard';
export { CaseStudyHero } from './components/CaseStudyHero';
export { ChallengeSection } from './components/ChallengeSection';
export { SolutionSection } from './components/SolutionSection';
export { ArchitectureSection } from './components/ArchitectureSection';
export { TechnologySection } from './components/TechnologySection';
export { MetricsSection } from './components/MetricsSection';
export { TimelineSection } from './components/TimelineSection';
export { OutcomeSection } from './components/OutcomeSection';
export { QuoteSection } from './components/QuoteSection';
export { RelatedSolutions } from './components/RelatedSolutions';
export { CTA } from './components/CTA';