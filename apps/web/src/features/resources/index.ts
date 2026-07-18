// Types
export type {
  ResourceCategory,
  Difficulty,
  Author,
  Tag,
  Series,
  Resource,
  Category,
  FeaturedContent as FeaturedContentType,
} from './types';

// Data
export { categories, authors, tags, resources, featuredContent } from './data';

// Components
export { ResourcesHero } from './components/ResourcesHero';
export { FeaturedContent } from './components/FeaturedContent';
export { CategoryGrid } from './components/CategoryGrid';
export { ResourceCard } from './components/ResourceCard';
export { NewsletterCTA } from './components/NewsletterCTA';
