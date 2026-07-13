import { describe, expect, it } from 'vitest';
import type { MediaAsset, MediaTag, MediaFolder } from '../lib/media-types';

describe('media-types', () => {
  const mockAsset: MediaAsset = {
    id: '1',
    fileName: 'test.jpg',
    fileExtension: 'jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024,
    checksum: 'abc123',
    storageKey: 'key-1',
    type: 'Image',
    status: 'Ready',
    language: 'en',
    tags: [],
    usageCount: 0,
    versionCount: 0,
    metadataCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('creates a valid media asset', () => {
    expect(mockAsset.id).toBe('1');
    expect(mockAsset.type).toBe('Image');
    expect(mockAsset.status).toBe('Ready');
    expect(mockAsset.sizeBytes).toBeGreaterThan(0);
  });

  it('validates tag structure', () => {
    const tag: MediaTag = {
      id: 't1',
      name: 'Nature',
      slug: 'nature',
      color: '#22c55e',
    };
    expect(tag.slug).toBe('nature');
    expect(tag.color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('validates folder tree structure', () => {
    const folder: MediaFolder = {
      id: 'f1',
      name: 'Root',
      slug: 'root',
      sortOrder: 0,
      children: [],
    };
    expect(folder.children).toHaveLength(0);
    expect(folder.sortOrder).toBe(0);
  });
});
