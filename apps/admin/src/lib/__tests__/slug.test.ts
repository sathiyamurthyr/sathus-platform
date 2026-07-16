import { describe, expect, it } from 'vitest';
import { slugify, sanitizeSlug, isSlugAvailable } from '../slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips disallowed characters', () => {
    expect(slugify('Patient & "Care" (2026)!')).toBe('patient-care-2026');
  });

  it('collapses whitespace and underscores', () => {
    expect(slugify('  multi   space_and_underscore ')).toBe('multi-space-and-underscore');
  });

  it('removes diacritics', () => {
    expect(slugify('Café DéjÀ')).toBe('cafe-deja');
  });

  it('respects maxLength without breaking words when possible', () => {
    const slug = slugify('a very long title that should be trimmed', { maxLength: 12 });
    expect(slug.length).toBeLessThanOrEqual(12);
    expect(slug).not.toMatch(/-$/);
  });

  it('sanitizeSlug uses 256 max length', () => {
    const input = 'x'.repeat(500);
    expect(sanitizeSlug(input).length).toBe(256);
  });

  it('detects unavailable slugs ignoring the current id', () => {
    const existing = [
      { slug: 'about', id: '1' },
      { slug: 'contact', id: '2' },
    ];
    expect(isSlugAvailable('about', existing)).toBe(false);
    expect(isSlugAvailable('about', existing, '1')).toBe(true);
    expect(isSlugAvailable('new-page', existing)).toBe(true);
  });
});
