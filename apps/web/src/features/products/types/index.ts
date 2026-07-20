// Product Platform Types

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  hero: ProductHero;
  overview: ProductOverview;
  features: Feature[];
  benefits: Benefit[];
  pricingPreview?: PricingPreview;
  useCases: UseCase[];
  screenshots: Screenshot[];
  architecture?: Architecture;
  technology: Technology[];
  security: SecurityFeature[];
  roadmap: RoadmapItem[];
  faq: FAQ[];
  deploymentModels?: string[];
  scalabilityMetrics?: { label: string; value: string; description: string }[];
  integrations?: { name: string; category: string; description: string }[];
  relatedSolutions?: { title: string; href: string }[];
}

export interface ProductHero {
  title: string;
  description: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  badge?: string;
}

export interface ProductOverview {
  problem: string;
  solution: string;
  differentiator: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  metric?: string;
}

export interface PricingPreview {
  plans: PricingPlan[];
  cta: { text: string; href: string };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  industry: string;
}

export interface Screenshot {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Architecture {
  title: string;
  description: string;
  diagram: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}