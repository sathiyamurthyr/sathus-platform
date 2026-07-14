import type { SearchQuery } from './search-api';

export const RECENT_KEY = 'sathus.search.recent';
export const SAVED_KEY = 'sathus.search.saved';
export const MAX_RECENT = 10;

export interface StoredSavedSearch {
  id: string;
  label: string;
  query: SearchQuery;
  createdAt: string;
}

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeRead<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function loadRecent(): string[] {
  return safeRead<string[]>(RECENT_KEY, []);
}

export function saveRecent(items: string[]): void {
  safeWrite(RECENT_KEY, items);
}

/** Returns a de-duplicated, recency-ordered copy with the term prepended. */
export function addRecent(list: string[], term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return list;
  return [trimmed, ...list.filter((t) => t !== trimmed)].slice(0, MAX_RECENT);
}

export function loadSaved(): StoredSavedSearch[] {
  return safeRead<StoredSavedSearch[]>(SAVED_KEY, []);
}

export function saveSaved(items: StoredSavedSearch[]): void {
  safeWrite(SAVED_KEY, items);
}

export function createSavedSearch(label: string, query: SearchQuery): StoredSavedSearch {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: label.trim() || query.text.trim() || 'Untitled search',
    query,
    createdAt: new Date().toISOString(),
  };
}
