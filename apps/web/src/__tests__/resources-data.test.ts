import { describe, it, expect } from 'vitest';
import {
  categories,
  authors,
  tags,
  resources,
  featuredContent,
} from '@/features/resources/data';

describe('Resources Data', () => {
  describe('categories', () => {
    it('has all resource categories', () => {
      expect(categories.length).toBe(7);
      expect(categories.find(c => c.id === 'blog')).toBeDefined();
      expect(categories.find(c => c.id === 'docs')).toBeDefined();
      expect(categories.find(c => c.id === 'learning')).toBeDefined();
    });
  });

  describe('resources', () => {
    it('has resources with required fields', () => {
      expect(resources.length).toBeGreaterThan(0);
      expect(resources[0].id).toBeDefined();
      expect(resources[0].title).toBeDefined();
      expect(resources[0].category).toBeDefined();
      expect(resources[0].author).toBeDefined();
    });
  });

  describe('featuredContent', () => {
    it('has featured content', () => {
      expect(featuredContent.length).toBeGreaterThan(0);
    });
  });
});