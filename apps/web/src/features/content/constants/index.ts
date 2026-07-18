import type { ContentCategory, ContentStatus, ContentBlockType } from '../types';

// Default content categories
export const DEFAULT_CATEGORIES: ContentCategory[] = [
  'page',
  'blog',
  'documentation',
  'product',
  'learning',
  'trust-center',
  'release-notes',
  'careers',
  'policies',
];

// Default content statuses
export const DEFAULT_STATUSES: ContentStatus[] = [
  'draft',
  'review',
  'published',
  'archived',
];

// Default content block types
export const DEFAULT_BLOCK_TYPES: ContentBlockType[] = [
  'text',
  'markdown',
  'rich-text',
  'hero',
  'cta',
  'image',
  'gallery',
  'video',
  'faq',
  'accordion',
  'quote',
  'statistics',
  'timeline',
  'architecture-diagram',
  'feature-grid',
  'code-block',
  'table',
  'json',
];

// Category labels
export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  page: 'Pages',
  blog: 'Blog',
  documentation: 'Documentation',
  product: 'Products',
  learning: 'Learning Center',
  'trust-center': 'Trust Center',
  'release-notes': 'Release Notes',
  careers: 'Careers',
  policies: 'Policies',
};

// Status labels
export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  review: 'In Review',
  published: 'Published',
  archived: 'Archived',
};

// Block type labels
export const BLOCK_TYPE_LABELS: Record<ContentBlockType, string> = {
  text: 'Text',
  markdown: 'Markdown',
  'rich-text': 'Rich Text',
  hero: 'Hero',
  cta: 'Call to Action',
  image: 'Image',
  gallery: 'Gallery',
  video: 'Video',
  faq: 'FAQ',
  accordion: 'Accordion',
  quote: 'Quote',
  statistics: 'Statistics',
  timeline: 'Timeline',
  'architecture-diagram': 'Architecture Diagram',
  'feature-grid': 'Feature Grid',
  'code-block': 'Code Block',
  table: 'Table',
  json: 'JSON',
};

// Default SEO values
export const DEFAULT_SEO = {
  title: 'Sathus Technology',
  description: 'Enterprise software solutions for the modern business.',
  openGraph: {
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image' as const,
  },
};