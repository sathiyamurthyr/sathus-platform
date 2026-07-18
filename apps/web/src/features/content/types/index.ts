// Content Platform Types

// Core Content Types
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type ContentCategory = 'page' | 'blog' | 'documentation' | 'product' | 'learning' | 'trust-center' | 'release-notes' | 'careers' | 'policies';

// Content Slug with validation
export interface ContentSlug {
  slug: string;
  fullPath: string;
  redirectFrom?: string[];
}

// SEO Metadata
export interface SeoMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
  };
  jsonLd?: Record<string, unknown>;
  focusKeyword?: string;
  readingTime?: number;
}

// Content Author
export interface ContentAuthor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// Content Tag
export interface ContentTag {
  id: string;
  name: string;
  slug: string;
}

// Content Relation
export interface ContentRelation {
  id: string;
  type: 'reference' | 'relation';
  contentTypeId: string;
  itemId: string;
  field: string;
}

// Content Schedule
export interface ContentSchedule {
  publishAt?: string;
  unpublishAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Content Version
export interface ContentVersionReference {
  version: number;
  createdAt: string;
  createdBy: string;
  changeSummary?: string;
}

// Content Block Types
export type ContentBlockType =
  | 'text'
  | 'markdown'
  | 'rich-text'
  | 'hero'
  | 'cta'
  | 'image'
  | 'gallery'
  | 'video'
  | 'faq'
  | 'accordion'
  | 'quote'
  | 'statistics'
  | 'timeline'
  | 'architecture-diagram'
  | 'feature-grid'
  | 'code-block'
  | 'table'
  | 'json';

// Base Content Block
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  data: Record<string, unknown>;
}

// Content Section
export interface ContentSection {
  id: string;
  title?: string;
  blocks: ContentBlock[];
}

// Content Type Definition
export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: ContentFieldDefinition[];
  seo?: SeoMetadata;
  templates?: string[];
  permissions?: ContentPermission[];
  workflow?: ContentWorkflow;
}

export interface ContentFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'rich-text' | 'markdown' | 'image' | 'reference' | 'array' | 'object';
  required?: boolean;
  validation?: Record<string, unknown>;
}

export interface ContentPermission {
  role: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'publish')[];
}

export interface ContentWorkflow {
  states: ContentStatus[];
  transitions: ContentWorkflowTransition[];
}

export interface ContentWorkflowTransition {
  from: ContentStatus;
  to: ContentStatus;
  requiredPermission?: string;
}

// Content Item
export interface ContentItem {
  id: string;
  contentTypeId: string;
  slug: ContentSlug;
  status: ContentStatus;
  title: string;
  description?: string;
  sections: ContentSection[];
  seo: SeoMetadata;
  author?: ContentAuthor;
  tags: ContentTag[];
  relations: ContentRelation[];
  schedule: ContentSchedule;
  version: ContentVersionReference;
}

// Content Query
export interface ContentQuery {
  contentTypeId?: string;
  status?: ContentStatus;
  tags?: string[];
  category?: ContentCategory;
  search?: string;
  limit?: number;
  offset?: number;
}