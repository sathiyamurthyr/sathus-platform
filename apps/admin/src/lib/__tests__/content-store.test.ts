import { describe, expect, it, beforeAll, beforeEach } from 'vitest';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const storage = new LocalStorageMock();

beforeAll(() => {
  (globalThis as unknown as { window: { localStorage: LocalStorageMock } }).window = {
    localStorage: storage,
  };
});

beforeEach(() => {
  storage.clear();
});

import {
  createContentItem,
  updateContentItem,
  deleteContentItem,
  listContentItems,
  getContentItem,
  applyWorkflow,
  listVersions,
  restoreVersion,
  addVersionComment,
  resetStore,
} from '../content-store';

const sampleInput = {
  title: 'Getting Started',
  slug: 'getting-started',
  body: '<p>Welcome</p>',
  description: 'Intro',
  contentType: 'DocPage' as const,
  status: 'Draft' as const,
  noIndex: false,
  featured: false,
  deprecated: false,
  categoryNames: [],
  tagNames: [],
};

describe('content-store CRUD', () => {
  it('creates an item with version 1 and seed version', () => {
    const item = createContentItem(sampleInput, 'admin');
    expect(item.id).toBeTruthy();
    expect(item.version).toBe(1);
    expect(listVersions(item.id)).toHaveLength(1);
  });

  it('lists and filters items', () => {
    createContentItem(sampleInput, 'admin');
    createContentItem({ ...sampleInput, title: 'Second', slug: 'second', contentType: 'Article' }, 'admin');
    expect(listContentItems().items).toHaveLength(2);
    expect(listContentItems({ contentType: 'Article' }).items).toHaveLength(1);
    expect(listContentItems({ search: 'second' }).items).toHaveLength(1);
  });

  it('updates an item and records a new version', () => {
    const item = createContentItem(sampleInput, 'admin');
    const updated = updateContentItem(item.id, { body: '<p>Updated</p>' }, 'admin');
    expect(updated.version).toBe(2);
    expect(getContentItem(item.id)?.body).toBe('<p>Updated</p>');
    expect(listVersions(item.id)).toHaveLength(2);
  });

  it('deletes an item and its versions', () => {
    const item = createContentItem(sampleInput, 'admin');
    deleteContentItem(item.id);
    expect(getContentItem(item.id)).toBeNull();
    expect(listVersions(item.id)).toHaveLength(0);
  });
});

describe('content-store workflow', () => {
  it('submits for review then approves', () => {
    const item = createContentItem(sampleInput, 'admin');
    const reviewed = applyWorkflow(item.id, 'submit', { authorName: 'admin' });
    expect(reviewed.status).toBe('InReview');
    const approved = applyWorkflow(reviewed.id, 'approve', { authorName: 'jane', approvalNote: 'ok' });
    expect(approved.status).toBe('Approved');
    expect(approved.workflow?.reviewerName).toBe('jane');
  });

  it('publishes from approved and sets publishedAt', () => {
    const item = createContentItem(sampleInput, 'admin');
    applyWorkflow(item.id, 'submit', { authorName: 'admin' });
    applyWorkflow(item.id, 'approve', { authorName: 'jane' });
    const published = applyWorkflow(item.id, 'publish', { authorName: 'jane' });
    expect(published.status).toBe('Published');
    expect(published.publishedAt).toBeTruthy();
  });
});

describe('content-store versions', () => {
  it('restores a previous version', () => {
    const item = createContentItem(sampleInput, 'admin');
    updateContentItem(item.id, { body: '<p>v2</p>' }, 'admin');
    const versions = listVersions(item.id);
    const v1 = versions.find((v) => v.version === 1)!;
    const restored = restoreVersion(item.id, v1.id, 'admin');
    expect(restored.body).toBe('<p>Welcome</p>');
    expect(listVersions(item.id).length).toBe(3);
  });

  it('adds comments to a version', () => {
    const item = createContentItem(sampleInput, 'admin');
    const v1 = listVersions(item.id)[0];
    const versions = addVersionComment(item.id, v1.id, 'jane', 'looks good');
    expect(versions.find((v) => v.id === v1.id)?.comments).toHaveLength(1);
  });
});

describe('resetStore', () => {
  it('clears persisted data', () => {
    createContentItem(sampleInput, 'admin');
    resetStore();
    expect(listContentItems().items).toHaveLength(0);
  });
});
