import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  addRecent,
  createSavedSearch,
  loadRecent,
  loadSaved,
  saveRecent,
  saveSaved,
  MAX_RECENT,
  RECENT_KEY,
  SAVED_KEY,
} from '../../lib/search-storage';

/* eslint-disable @typescript-eslint/no-explicit-any */

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
  } as unknown as Storage;
}

describe('use-search persistence (storage)', () => {
  beforeEach(() => {
    const ls = createLocalStorageMock();
    (globalThis as any).window = globalThis;
    (globalThis as any).localStorage = ls;
    vi.stubGlobal('localStorage', ls);
  });

  it('addRecent prepends and de-duplicates a term', () => {
    const base = ['b', 'c'];
    const next = addRecent(base, 'a');
    expect(next).toEqual(['a', 'b', 'c']);
  });

  it('addRecent moves an existing term to the front', () => {
    const next = addRecent(['a', 'b', 'c'], 'c');
    expect(next[0]).toBe('c');
    expect(next).toEqual(['c', 'a', 'b']);
  });

  it('addRecent ignores blank terms', () => {
    expect(addRecent(['a'], '   ')).toEqual(['a']);
  });

  it('addRecent caps the list at MAX_RECENT', () => {
    let list: string[] = [];
    for (let i = 0; i < MAX_RECENT + 5; i++) list = addRecent(list, `t${i}`);
    expect(list.length).toBe(MAX_RECENT);
    expect(list[0]).toBe(`t${MAX_RECENT + 4}`);
  });

  it('persists and reloads recent searches from localStorage', () => {
    saveRecent(['alpha', 'beta']);
    expect(loadRecent()).toEqual(['alpha', 'beta']);
    expect(JSON.parse((globalThis as any).localStorage.getItem(RECENT_KEY))).toEqual(['alpha', 'beta']);
  });

  it('returns empty array when nothing is stored', () => {
    expect(loadRecent()).toEqual([]);
  });

  it('creates a saved search with a generated id and timestamp', () => {
    const saved = createSavedSearch('My search', { text: 'hello', page: 1 });
    expect(saved.label).toBe('My search');
    expect(saved.query.text).toBe('hello');
    expect(saved.id).toBeTruthy();
    expect(new Date(saved.createdAt).getTime()).not.toBeNaN();
  });

  it('falls back to the query text as the label when blank', () => {
    const saved = createSavedSearch('', { text: 'world', page: 1 });
    expect(saved.label).toBe('world');
  });

  it('persists and reloads saved searches from localStorage', () => {
    const saved = createSavedSearch('Docs', { text: 'doc', page: 1 });
    saveSaved([saved]);
    const loaded = loadSaved();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].label).toBe('Docs');
    expect(loaded[0].id).toBe(saved.id);
    expect(JSON.parse((globalThis as any).localStorage.getItem(SAVED_KEY))[0].label).toBe('Docs');
  });
});
