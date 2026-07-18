// Industry data models

export interface Industry {
  slug: string;
  name: string;
  description: string;
  hero: IndustryHero;
  overview: IndustryOverview;
  challenges: IndustryChallenge[];
  solutions: IndustrySolution[];
  architecture: Architecture;
  technologies: Technology[];
  outcomes: BusinessOutcome[];
  caseStudies: CaseStudyReference[];
  faqs: FAQ[];
  seo?: {
    title: string;
    description: string;
    canonical: string;
  };
}

export interface IndustryHero {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
}

export interface IndustryOverview {
  title: string;
  description: string;
}

export interface IndustryChallenge {
  id: string;
  title: string;
  description: string;
}

export interface IndustrySolution {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface Technology {
  id: string;
  name: string;
  category: 'ai' | 'data' | 'cloud' | 'devops' | 'framework' | 'database' | 'other';
}

export interface BusinessOutcome {
  id: string;
  title: string;
  description: string;
  metric?: string;
}

export interface Architecture {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CaseStudyReference {
  id: string;
  title: string;
  slug: string;
  industry: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}