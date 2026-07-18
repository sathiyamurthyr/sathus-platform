// Resources Platform Types

export type ResourceCategory =
  | 'blog'
  | 'docs'
  | 'learning'
  | 'whitepapers'
  | 'tutorials'
  | 'releases'
  | 'engineering';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  excerpt?: string;
  category: ResourceCategory;
  tags: Tag[];
  author: Author;
  publishedAt: string;
  readingTime?: number;
  difficulty?: Difficulty;
  series?: Series;
  featured?: boolean;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface FeaturedContent {
  id: string;
  resource: Resource;
  variant: 'hero' | 'card' | 'minimal';
}