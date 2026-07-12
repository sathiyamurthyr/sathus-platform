import { describe, expect, it } from 'vitest';
import { diffLines, diffWords, diffStats, diffToHtml } from '../diff';

describe('diffLines', () => {
  it('marks equal, added, and removed segments', () => {
    const segments = diffLines('a\nb\nc', 'a\nx\nc');
    const types = segments.map((s) => s.type);
    expect(types).toContain('equal');
    expect(types).toContain('removed');
    expect(types).toContain('added');
  });

  it('produces no diff for identical input', () => {
    const segments = diffLines('same\ntext', 'same\ntext');
    expect(segments.every((s) => s.type === 'equal')).toBe(true);
  });

  it('stats count correctly', () => {
    const stats = diffStats(diffLines('one\ntwo', 'one\ntwo\nthree'));
    expect(stats.unchanged).toBe(2);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(0);
  });
});

describe('diffWords', () => {
  it('detects word-level changes', () => {
    const segments = diffWords('the quick brown fox', 'the slow brown fox');
    expect(segments.some((s) => s.type === 'removed' && s.value === 'quick')).toBe(true);
    expect(segments.some((s) => s.type === 'added' && s.value === 'slow')).toBe(true);
  });
});

describe('diffToHtml', () => {
  it('prefixes lines with + and -', () => {
    const html = diffToHtml(diffLines('a\nb', 'a\nc'));
    expect(html).toContain('diff-added');
    expect(html).toContain('diff-removed');
    expect(html).toContain('-b');
    expect(html).toContain('+c');
  });
});
