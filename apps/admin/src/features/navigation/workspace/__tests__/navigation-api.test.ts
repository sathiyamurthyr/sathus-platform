import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getTrees, createTree, archiveTree, schedulePublish } from '../../lib/navigation-api';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('navigation-api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('builds get trees request', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });

    await getTrees('desktop');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/navigation?platform=desktop',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('builds create tree request', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: '1' }),
    });

    await createTree({ platform: 'mobile', name: 'Main', defaultLocale: 'en' });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/navigation',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('builds archive tree request', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => undefined,
    });

    await archiveTree('tree-1');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/navigation/tree-1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('serializes scheduledAt as ISO string in schedulePublish', async () => {
    (globalThis.fetch as unknown as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'v-1' }),
    });

    const date = new Date('2025-01-01T00:00:00.000Z');
    await schedulePublish('menu-1', 'v-1', { scheduledAt: date });

    const [, init] = (globalThis.fetch as unknown as any).mock.calls[0];
    const body = JSON.parse((init as { body: string }).body);
    expect(body.scheduledAt).toBe('2025-01-01T00:00:00.000Z');
  });
});
