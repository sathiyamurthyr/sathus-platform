import type { ContentItem, ContentVersion } from '@/types/content';
import { diffLines, diffStats, type DiffSegment } from './diff';

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

export function createVersion(item: ContentItem, author: string, note?: string): ContentVersion {
  return {
    id: uid('ver'),
    contentItemId: item.id,
    version: (item.version ?? 0) + 1,
    title: item.title,
    slug: item.slug,
    body: item.body,
    description: item.description,
    contentType: item.contentType,
    status: item.status,
    author,
    note,
    createdAt: new Date().toISOString(),
    comments: [],
  };
}

export function itemFromVersion(version: ContentVersion, base: ContentItem): ContentItem {
  return {
    ...base,
    title: version.title,
    slug: version.slug,
    body: version.body,
    description: version.description,
    contentType: version.contentType,
    status: version.status,
    version: version.version,
    updatedAt: new Date().toISOString(),
  };
}

export function compareBodies(oldBody: string, newBody: string): { segments: DiffSegment[]; stats: ReturnType<typeof diffStats> } {
  const segments = diffLines(oldBody, newBody);
  return { segments, stats: diffStats(segments) };
}

export function addComment(
  version: ContentVersion,
  author: string,
  body: string
): ContentVersion {
  return {
    ...version,
    comments: [
      ...version.comments,
      { id: uid('cmt'), author, body, createdAt: new Date().toISOString() },
    ],
  };
}

export function summarizeVersion(version: ContentVersion): string {
  const parts = [`v${version.version}`, version.status];
  if (version.note) parts.push(version.note);
  return parts.join(' · ');
}
