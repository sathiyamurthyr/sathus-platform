// Case Study data models

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  architecture: Architecture;
  technologies: Technology[];
  metrics: Metric[];
  timeline: Timeline;
  outcomes: Outcome[];
  testimonial?: Testimonial;
  relatedSolutions: string[];
  seo: SEO;
  featured: boolean;
  publishedAt: string;
}

export interface Architecture {
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

export interface Metric {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface Timeline {
  duration: string;
  phases: TimelinePhase[];
}

export interface TimelinePhase {
  name: string;
  description: string;
}

export interface Outcome {
  id: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export interface SEO {
  title: string;
  description: string;
  canonical: string;
}

// Filter types
export type IndustryFilter = string;
export type TechnologyFilter = string;
export type SolutionFilter = string;

// API types for future CMS integration
export interface CaseStudyFilters {
  industry?: IndustryFilter;
  technology?: TechnologyFilter;
  solution?: SolutionFilter;
  featured?: boolean;
}