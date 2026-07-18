import type { ContentItem, ContentQuery, ContentType } from '../types';
import type { StorageProvider } from '../providers/storage-provider';

export class ContentService {
  constructor(private storage: StorageProvider) {}

  async getContentItem(id: string): Promise<ContentItem | null> {
    return this.storage.getContentItem(id);
  }

  async getContentItems(query: ContentQuery): Promise<ContentItem[]> {
    return this.storage.getContentItems(query);
  }

  async getContentType(id: string): Promise<ContentType | null> {
    return this.storage.getContentType(id);
  }

  async getContentTypes(): Promise<ContentType[]> {
    return this.storage.getContentTypes();
  }

  async createContentItem(item: ContentItem): Promise<ContentItem> {
    return this.storage.createContentItem(item);
  }

  async updateContentItem(id: string, item: Partial<ContentItem>): Promise<ContentItem> {
    return this.storage.updateContentItem(id, item);
  }

  async deleteContentItem(id: string): Promise<void> {
    return this.storage.deleteContentItem(id);
  }
}