export const CONTENT_TYPES = [
  { value: 'Page', label: 'Page' },
  { value: 'Article', label: 'Article' },
  { value: 'DocPage', label: 'Documentation Page' },
  { value: 'Product', label: 'Product' },
] as const;

export const CONTENT_STATUSES = [
  { value: 'Draft', label: 'Draft' },
  { value: 'InReview', label: 'In Review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
] as const;

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'title', label: 'Title' },
  { value: 'publishedAt', label: 'Published Date' },
  { value: 'slug', label: 'Slug' },
] as const;

export type ContentTypeValue = (typeof CONTENT_TYPES)[number]['value'];
export type ContentStatusValue = (typeof CONTENT_STATUSES)[number]['value'];
export type SortByValue = (typeof SORT_OPTIONS)[number]['value'];

export type ContentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

export const WORKFLOW_ACTIONS = [
  { value: 'submit', label: 'Submit for Review' },
  { value: 'approve', label: 'Approve' },
  { value: 'reject', label: 'Request Changes' },
  { value: 'schedule', label: 'Schedule Publish' },
  { value: 'publish', label: 'Publish' },
  { value: 'unpublish', label: 'Unpublish' },
  { value: 'archive', label: 'Archive' },
  { value: 'restore', label: 'Restore' },
] as const;

export type WorkflowActionValue = (typeof WORKFLOW_ACTIONS)[number]['value'];

export interface VersionComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface ContentVersion {
  id: string;
  contentItemId: string;
  version: number;
  title: string;
  slug: string;
  body: string;
  description?: string;
  contentType: ContentTypeValue;
  status: ContentStatusValue;
  author: string;
  note?: string;
  createdAt: string;
  comments: VersionComment[];
}

export interface ContentWorkflow {
  status: ContentStatusValue;
  submittedForReviewAt?: string;
  reviewerId?: string;
  reviewerName?: string;
  approvedAt?: string;
  approvalNote?: string;
  rejectedAt?: string;
  scheduledAt?: string;
  publishedAt?: string;
  archivedAt?: string;
}

export interface SeoSettings {
  seoCanonical?: string;
  seoRobots?: string;
  noIndex: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: TwitterCardType;
  focusKeyword?: string;
  schemaJson?: string;
  redirectFrom?: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  body: string;
  contentType: ContentTypeValue;
  status: ContentStatusValue;
  publishedAt?: string;
  authorId?: string;
  authorName?: string;
  seoCanonical?: string;
  seoRobots?: string;
  noIndex: boolean;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterCard?: TwitterCardType;
  focusKeyword?: string;
  schemaJson?: string;
  redirectFrom?: string[];
  featured: boolean;
  navigationTitle?: string;
  displayOrder?: number;
  previousContentItemId?: string;
  nextContentItemId?: string;
  difficulty?: ContentDifficulty;
  estimatedReadTime?: number;
  deprecated: boolean;
  tagline?: string;
  featuresJson?: string;
  pricingPlanId?: string;
  coverImage?: string;
  readTime?: number;
  heroImage?: string;
  galleryJson?: string;
  categoryNames: string[];
  tagNames: string[];
  workflow?: ContentWorkflow;
  version?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
}
