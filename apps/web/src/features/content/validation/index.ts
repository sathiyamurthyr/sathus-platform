import { z } from 'zod';
import type { ContentStatus, ContentCategory, ContentBlockType } from '../types';

// Slug validation
export const slugSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fullPath: z.string().url(),
  redirectFrom: z.array(z.string().url()).optional(),
});

// SEO validation
export const seoMetadataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  canonical: z.string().url().optional(),
  openGraph: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    type: z.string().optional(),
  }).optional(),
  twitter: z.object({
    card: z.enum(['summary', 'summary_large_image']).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
  }).optional(),
  jsonLd: z.record(z.string(), z.unknown()).optional(),
  focusKeyword: z.string().optional(),
  readingTime: z.number().optional(),
});

// Author validation
export const contentAuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
});

// Tag validation
export const contentTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

// Relation validation
export const contentRelationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['reference', 'relation']),
  contentTypeId: z.string().uuid(),
  itemId: z.string().uuid(),
  field: z.string().min(1),
});

// Schedule validation
export const contentScheduleSchema = z.object({
  publishAt: z.string().optional(),
  unpublishAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Version validation
export const contentVersionSchema = z.object({
  version: z.number().int().positive(),
  createdAt: z.string(),
  createdBy: z.string().uuid(),
  changeSummary: z.string().optional(),
});

// Content Block validation
export const contentBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'text', 'markdown', 'rich-text', 'hero', 'cta', 'image', 'gallery',
    'video', 'faq', 'accordion', 'quote', 'statistics', 'timeline',
    'architecture-diagram', 'feature-grid', 'code-block', 'table', 'json'
  ]),
  order: z.number().int().min(0),
  data: z.record(z.string(), z.unknown()),
});

// Content Section validation
export const contentSectionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  blocks: z.array(contentBlockSchema),
});

// Content Type validation
export const contentTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['text', 'rich-text', 'markdown', 'image', 'reference', 'array', 'object']),
    required: z.boolean().optional(),
    validation: z.record(z.string(), z.unknown()).optional(),
  })),
  seo: seoMetadataSchema.optional(),
  templates: z.array(z.string()).optional(),
  permissions: z.array(z.object({
    role: z.string().min(1),
    actions: z.array(z.enum(['create', 'read', 'update', 'delete', 'publish'])),
  })).optional(),
  workflow: z.object({
    states: z.array(z.enum(['draft', 'review', 'published', 'archived'])),
    transitions: z.array(z.object({
      from: z.enum(['draft', 'review', 'published', 'archived']),
      to: z.enum(['draft', 'review', 'published', 'archived']),
      requiredPermission: z.string().optional(),
    })),
  }).optional(),
});

// Content Item validation
export const contentItemSchema = z.object({
  id: z.string().uuid(),
  contentTypeId: z.string().uuid(),
  slug: slugSchema,
  status: z.enum(['draft', 'review', 'published', 'archived']),
  title: z.string().min(1),
  description: z.string().optional(),
  sections: z.array(contentSectionSchema),
  seo: seoMetadataSchema,
  author: contentAuthorSchema.optional(),
  tags: z.array(contentTagSchema),
  relations: z.array(contentRelationSchema),
  schedule: contentScheduleSchema,
  version: contentVersionSchema,
});

// Content Query validation
export const contentQuerySchema = z.object({
  contentTypeId: z.string().uuid().optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
  category: z.enum(['page', 'blog', 'documentation', 'product', 'learning', 'trust-center', 'release-notes', 'careers', 'policies']).optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

// Validation functions
export function validateSlug(data: unknown) {
  return slugSchema.parse(data);
}

export function validateSeoMetadata(data: unknown) {
  return seoMetadataSchema.parse(data);
}

export function validateContentItem(data: unknown) {
  return contentItemSchema.parse(data);
}

export function validateContentType(data: unknown) {
  return contentTypeSchema.parse(data);
}