import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  getContentItems,
  getContentItem,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  publishContentItem,
  workflowAction,
  getContentVersions,
  restoreVersion,
  addVersionComment,
  addRedirect,
  listRedirects,
} from '../content-client';
import type { ContentItem } from '@/types/content';

function mockResponse(body: unknown, status = 200): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as Response;
}

describe('content-client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getContentItems parses the wrapped items array and query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ items: [{ id: '1' }] }));
    vi.stubGlobal('fetch', fetchMock);
    const items = await getContentItems({ status: 'Draft', page: 2 });
    expect(items).toHaveLength(1);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('status=Draft');
    expect(url).toContain('page=2');
  });

  it('createContentItem posts the payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ id: 'new' } as ContentItem));
    vi.stubGlobal('fetch', fetchMock);
    await createContentItem({ title: 'T', slug: 't', body: 'b', contentType: 'Page', status: 'Draft', noIndex: false, featured: false, deprecated: false, categoryNames: [], tagNames: [], description: undefined } as never);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST' });
  });

  it('updateContentItem uses PUT', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ id: '1' } as ContentItem));
    vi.stubGlobal('fetch', fetchMock);
    await updateContentItem('1', { title: 'T', slug: 't', body: 'b', contentType: 'Page', status: 'Draft', noIndex: false, featured: false, deprecated: false, categoryNames: [], tagNames: [] } as never);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/content/items/1');
    expect(init.method).toBe('PUT');
  });

  it('deleteContentItem uses DELETE', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(null, 204));
    vi.stubGlobal('fetch', fetchMock);
    await deleteContentItem('1');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'DELETE' });
  });

  it('publishContentItem posts to the publish endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(null, 204));
    vi.stubGlobal('fetch', fetchMock);
    await publishContentItem('1');
    expect((fetchMock.mock.calls[0][0] as string).endsWith('/publish')).toBe(true);
  });

  it('workflowAction posts action and payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ id: '1' } as ContentItem));
    vi.stubGlobal('fetch', fetchMock);
    await workflowAction('1', 'schedule', { scheduledAt: '2026-01-01T00:00:00.000Z' });
    const init = fetchMock.mock.calls[0][1];
    expect((fetchMock.mock.calls[0][0] as string).endsWith('/workflow')).toBe(true);
    expect(JSON.parse(init.body as string)).toMatchObject({ action: 'schedule' });
  });

  it('getContentVersions requests versions endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse([{ id: 'v1' }]));
    vi.stubGlobal('fetch', fetchMock);
    await getContentVersions('1');
    expect((fetchMock.mock.calls[0][0] as string).endsWith('/versions')).toBe(true);
  });

  it('restoreVersion posts to the version restore endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ id: '1' } as ContentItem));
    vi.stubGlobal('fetch', fetchMock);
    await restoreVersion('1', 'v1');
    expect((fetchMock.mock.calls[0][0] as string).endsWith('/versions/v1/restore')).toBe(true);
  });

  it('addVersionComment posts the comment body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(null, 204));
    vi.stubGlobal('fetch', fetchMock);
    await addVersionComment('1', 'v1', 'nice');
    const init = fetchMock.mock.calls[0][1];
    expect(JSON.parse(init.body as string)).toEqual({ body: 'nice' });
  });

  it('addRedirect and listRedirects hit the redirects endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse([{ source: '/old', targetId: '1' }]));
    vi.stubGlobal('fetch', fetchMock);
    await addRedirect('/old', '1');
    expect((fetchMock.mock.calls[0][0] as string).endsWith('/redirects')).toBe(true);
    await listRedirects();
    expect((fetchMock.mock.calls[1][0] as string).endsWith('/redirects')).toBe(true);
  });

  it('throws on non-ok responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse({ message: 'boom' }, 500));
    vi.stubGlobal('fetch', fetchMock);
    await expect(getContentItem('1')).rejects.toThrow('boom');
  });
});
