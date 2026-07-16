import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  search,
  suggest,
  indexDocument,
  rebuildIndex,
  getStatus,
  deleteDocument,
} from '../../lib/search-api';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('search-api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('builds a search request with query params', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ query: 'cat', total: 0, page: 1, pageSize: 20, tookMs: 1, items: [], facets: [] }),
    });

    await search({ text: 'cat', page: 1, pageSize: 20, sourceTypes: ['page', 'doc'], sort: 'newest' });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/search?q=cat&page=1&pageSize=20&sort=newest&sourceTypes=page%2Cdoc',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('serializes facet filters with facet. prefix', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ query: 'x', total: 0, page: 1, pageSize: 20, tookMs: 1, items: [], facets: [] }),
    });

    await search({ text: 'x', facets: { language: ['en', 'es'], status: ['published'] } });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/search?q=x&facet.language=en%2Ces&facet.status=published',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('builds a suggest request', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ text: 'cats' }],
    });

    const data = await suggest('ca', { limit: 5 });
    expect(data).toEqual([{ text: 'cats' }]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/search/suggest?q=ca&limit=5',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('indexes a document with POST', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({ ok: true, status: 204, json: async () => undefined });

    await indexDocument({ id: 'd1', title: 'T', content: 'C', url: '/t', sourceType: 'page' });
    const [url, init] = (globalThis.fetch as unknown as any).mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/v1/search/index');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).id).toBe('d1');
  });

  it('rebuilds an index with POST', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({ ok: true, status: 204, json: async () => undefined });

    await rebuildIndex({ sourceTypes: ['article'] });
    const [url, init] = (globalThis.fetch as unknown as any).mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/v1/search/rebuild');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).sourceTypes).toEqual(['article']);
  });

  it('fetches index status', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ indexId: 'i1', documentCount: 3, status: 'healthy' }],
    });

    const data = await getStatus('i1');
    expect(data[0].indexId).toBe('i1');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/search/status?indexId=i1',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('deletes a document with DELETE', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({ ok: true, status: 204, json: async () => undefined });

    await deleteDocument('d1');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/search/index/d1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
