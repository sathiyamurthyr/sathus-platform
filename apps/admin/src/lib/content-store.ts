import type { ContentItem, ContentVersion } from '@/types/content';
import { createVersion, itemFromVersion, addComment as addCommentToVersion } from './versioning';
import { applyWorkflowAction } from './content-workflow';
import { slugify } from './slug';

const STORAGE_KEY = 'sathus.content.v1';

interface ContentStoreData {
  items: ContentItem[];
  versions: Record<string, ContentVersion[]>;
}

function emptyData(): ContentStoreData {
  return { items: [], versions: {} };
}

function read(): ContentStoreData {
  if (typeof window === 'undefined') return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as ContentStoreData;
    return { items: parsed.items ?? [], versions: parsed.versions ?? {} };
  } catch {
    return emptyData();
  }
}

function write(data: ContentStoreData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// createVersion increments from the supplied item version, so to produce a
// snapshot whose version equals `newVersion` we pass `newVersion - 1`.
function makeSnapshot(item: ContentItem, newVersion: number | undefined, author: string, note: string): ContentVersion {
  const version = newVersion ?? 1;
  return createVersion({ ...item, version: version - 1 }, author, note);
}

export interface ListContentParams {
  contentType?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

function matches(item: ContentItem, params: ListContentParams): boolean {
  if (params.contentType && item.contentType !== params.contentType) return false;
  if (params.status && item.status !== params.status) return false;
  if (params.search) {
    const q = params.search.toLowerCase();
    const hay = `${item.title} ${item.slug} ${item.description ?? ''}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function listContentItems(params: ListContentParams = {}): { items: ContentItem[]; total: number } {
  const data = read();
  const filtered = data.items.filter((item) => matches(item, params));
  const sortBy = params.sortBy ?? 'createdAt';
  const dir = params.sortDescending === false ? 1 : -1;
  filtered.sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortBy];
    const bv = (b as unknown as Record<string, unknown>)[sortBy];
    if (av === bv) return 0;
    return av! < bv! ? -1 * dir : 1 * dir;
  });
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
}

export function getContentItem(id: string): ContentItem | null {
  return read().items.find((i) => i.id === id) ?? null;
}

export function getContentItemBySlug(slug: string): ContentItem | null {
  return read().items.find((i) => i.slug === slug) ?? null;
}

export function createContentItem(
  input: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'> & { body: string },
  author: string
): ContentItem {
  const data = read();
  const now = new Date().toISOString();
  const item: ContentItem = {
    ...(input as ContentItem),
    id: uid('cnt'),
    slug: input.slug || slugify(input.title),
    version: 1,
    authorName: author,
    createdAt: now,
    updatedAt: now,
    categoryNames: input.categoryNames ?? [],
    tagNames: input.tagNames ?? [],
    workflow: {
      status: input.status,
      publishedAt: input.status === 'Published' ? now : undefined,
    },
  };
  data.items.push(item);
  data.versions[item.id] = [makeSnapshot(item, 1, author, 'Initial version')];
  write(data);
  return item;
}

export function updateContentItem(id: string, patch: Partial<ContentItem>, author: string): ContentItem {
  const data = read();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Content not found');
  const current = data.items[idx];
  const updated: ContentItem = {
    ...current,
    ...patch,
    id: current.id,
    version: (current.version ?? 1) + 1,
    authorName: author,
    updatedAt: new Date().toISOString(),
  };
  data.items[idx] = updated;
  data.versions[id] = [...(data.versions[id] ?? []), makeSnapshot(updated, updated.version, author, 'Update')];
  write(data);
  return updated;
}

export function deleteContentItem(id: string): void {
  const data = read();
  data.items = data.items.filter((i) => i.id !== id);
  delete data.versions[id];
  write(data);
}

export function listVersions(id: string): ContentVersion[] {
  return [...(read().versions[id] ?? [])].sort((a, b) => b.version - a.version);
}

export function getVersion(id: string, versionId: string): ContentVersion | null {
  return read().versions[id]?.find((v) => v.id === versionId) ?? null;
}

export function restoreVersion(id: string, versionId: string, author: string): ContentItem {
  const data = read();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Content not found');
  const version = data.versions[id]?.find((v) => v.id === versionId);
  if (!version) throw new Error('Version not found');
  const restored = itemFromVersion(version, data.items[idx]);
  restored.version = (data.items[idx].version ?? 1) + 1;
  data.items[idx] = restored;
  data.versions[id] = [
    ...(data.versions[id] ?? []),
    makeSnapshot(restored, restored.version, author, `Restored from v${version.version}`),
  ];
  write(data);
  return restored;
}

export function addVersionComment(id: string, versionId: string, author: string, body: string): ContentVersion[] {
  const data = read();
  const versions = data.versions[id];
  if (!versions) return [];
  data.versions[id] = versions.map((v) => (v.id === versionId ? addCommentToVersion(v, author, body) : v));
  write(data);
  return data.versions[id];
}

export function applyWorkflow(id: string, action: Parameters<typeof applyWorkflowAction>[1], ctx: Parameters<typeof applyWorkflowAction>[2] = {}): ContentItem {
  const data = read();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Content not found');
  const current = data.items[idx];
  const workflow = applyWorkflowAction(current.workflow ?? { status: current.status }, action, ctx);
  const updated: ContentItem = {
    ...current,
    status: workflow.status,
    workflow,
    publishedAt: workflow.publishedAt,
    version: (current.version ?? 1) + 1,
    updatedAt: new Date().toISOString(),
  };
  data.items[idx] = updated;
  data.versions[id] = [
    ...(data.versions[id] ?? []),
    makeSnapshot(updated, updated.version, ctx.authorName ?? 'system', `Workflow: ${action}`),
  ];

  write(data);
  return updated;
}

export function resetStore(): void {
  write(emptyData());
}
