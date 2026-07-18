import type { ContentItem, ContentQuery, ContentType } from '../types';

// Storage Provider Interface
export interface StorageProvider {
  getContentItem(id: string): Promise<ContentItem | null>;
  getContentItems(query: ContentQuery): Promise<ContentItem[]>;
  getContentType(id: string): Promise<ContentType | null>;
  getContentTypes(): Promise<ContentType[]>;
  createContentItem(item: ContentItem): Promise<ContentItem>;
  updateContentItem(id: string, item: Partial<ContentItem>): Promise<ContentItem>;
  deleteContentItem(id: string): Promise<void>;
}

// Mock Storage Provider
export class MockStorageProvider implements StorageProvider {
  private content: Map<string, ContentItem> = new Map();
  private contentTypes: Map<string, ContentType> = new Map();

  async getContentItem(id: string): Promise<ContentItem | null> {
    return this.content.get(id) || null;
  }

  async getContentItems(query: ContentQuery): Promise<ContentItem[]> {
    let results = Array.from(this.content.values());

    if (query.contentTypeId) {
      results = results.filter((item) => item.contentTypeId === query.contentTypeId);
    }

    if (query.status) {
      results = results.filter((item) => item.status === query.status);
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    if (query.offset) {
      results = results.slice(query.offset);
    }

    return results;
  }

  async getContentType(id: string): Promise<ContentType | null> {
    return this.contentTypes.get(id) || null;
  }

  async getContentTypes(): Promise<ContentType[]> {
    return Array.from(this.contentTypes.values());
  }

  async createContentItem(item: ContentItem): Promise<ContentItem> {
    this.content.set(item.id, item);
    return item;
  }

  async updateContentItem(id: string, item: Partial<ContentItem>): Promise<ContentItem> {
    const existing = this.content.get(id);
    if (!existing) {
      throw new Error(`Content item ${id} not found`);
    }
    const updated = { ...existing, ...item };
    this.content.set(id, updated);
    return updated;
  }

  async deleteContentItem(id: string): Promise<void> {
    this.content.delete(id);
  }
}