// Solution data models

export interface Solution {
  slug: string;
  title: string;
  description: string;
  icon: string;
  hero: SolutionHero;
  challenges: Challenge[];
  capabilities: Capability[];
  architecture: ArchitectureDiagram;
  technologies: Technology[];
  methodology: DeliveryMethodology;
  outcomes: Outcome[];
  caseStudies: CaseStudy[];
  faqs: FAQ[];
}

export interface SolutionHero {
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
  stats?: HeroStat[];
}

export interface HeroStat {
  value: string;
  valueLabel?: string;
  label: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ArchitectureDiagram {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Technology {
  id: string;
  name: string;
  category: 'ai' | 'data' | 'cloud' | 'devops' | 'framework' | 'database' | 'other';
}

export interface DeliveryMethodology {
  title: string;
  description: string;
  stages: DeliveryStage[];
}

export interface DeliveryStage {
  name: string;
  description: string;
  duration?: string;
}

export interface Outcome {
  id: string;
  title: string;
  description: string;
  metric?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
  duration: string;
  image?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}