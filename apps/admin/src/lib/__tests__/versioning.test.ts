import { describe, expect, it } from 'vitest';
import { createVersion, itemFromVersion, compareBodies, addComment, summarizeVersion } from '../versioning';
import type { ContentItem } from '@/types/content';

function makeItem(overrides: Partial<ContentItem> = {}): ContentItem {
  return {
    id: 'c1',
    title: 'Hello',
    slug: 'hello',
    body: 'original body',
    contentType: 'Page',
    status: 'Draft',
    noIndex: false,
    featured: false,
    deprecated: false,
    categoryNames: [],
    tagNames: [],
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('versioning', () => {
  it('creates a version with incremented number', () => {
    const v = createVersion(makeItem({ version: 3 }), 'admin', 'edit');
    expect(v.version).toBe(4);
    expect(v.body).toBe('original body');
    expect(v.author).toBe('admin');
    expect(v.note).toBe('edit');
  });

  it('rebuilds a content item from a version', () => {
    const item = makeItem();
    const v = createVersion(item, 'admin');
    const restored = itemFromVersion(v, makeItem({ title: 'Different' }));
    expect(restored.title).toBe('Hello');
    expect(restored.version).toBe(2);
  });

  it('compares bodies and reports stats', () => {
    const { stats } = compareBodies('line one\nline two', 'line one\nline changed');
    expect(stats.unchanged).toBe(1);
    expect(stats.removed).toBe(1);
    expect(stats.added).toBe(1);
  });

  it('adds comments to a version', () => {
    const v = createVersion(makeItem(), 'admin');
    const withComment = addComment(v, 'jane', 'nice work');
    expect(withComment.comments).toHaveLength(1);
    expect(withComment.comments[0].body).toBe('nice work');
    expect(withComment.comments[0].author).toBe('jane');
  });

  it('summarizes a version', () => {
    const v = createVersion(makeItem(), 'admin', 'First cut');
    expect(summarizeVersion(v)).toContain('First cut');
  });
});
