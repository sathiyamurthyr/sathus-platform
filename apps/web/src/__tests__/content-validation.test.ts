import { describe, it, expect } from 'vitest';
import {
  slugSchema,
  seoMetadataSchema,
  contentItemSchema,
  validateSlug,
  validateSeoMetadata,
  validateContentItem,
} from '@/features/content/validation';

describe('Content Validation', () => {
  describe('slugSchema', () => {
    it('validates a valid slug', () => {
      const result = slugSchema.parse({
        slug: 'financial-services',
        fullPath: 'https://sathus.in/industries/financial-services',
      });
      expect(result.slug).toBe('financial-services');
    });

    it('throws for invalid slug format', () => {
      expect(() => slugSchema.parse({
        slug: 'Invalid Slug!',
        fullPath: 'https://sathus.in/test',
      })).toThrow();
    });
  });

  describe('seoMetadataSchema', () => {
    it('validates SEO metadata', () => {
      const result = seoMetadataSchema.parse({
        title: 'Test Title',
        description: 'Test description',
      });
      expect(result.title).toBe('Test Title');
    });

    it('throws for title longer than 60 characters', () => {
      expect(() => seoMetadataSchema.parse({
        title: 'This title is way too long and exceeds the 60 character limit',
        description: 'Test',
      })).toThrow();
    });
  });

  describe('validateSlug', () => {
    it('returns parsed slug for valid input', () => {
      const result = validateSlug({
        slug: 'test-slug',
        fullPath: 'https://example.com/test',
      });
      expect(result.slug).toBe('test-slug');
    });
  });

  describe('validateSeoMetadata', () => {
    it('returns parsed metadata for valid input', () => {
      const result = validateSeoMetadata({
        title: 'Test',
        description: 'Description',
      });
      expect(result.title).toBe('Test');
    });
  });
});