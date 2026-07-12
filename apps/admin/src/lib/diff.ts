export type DiffType = 'equal' | 'added' | 'removed';

export interface DiffSegment {
  type: DiffType;
  value: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

function tokenizeLines(text: string): string[] {
  return text.replace(/\r\n/g, '\n').split('\n');
}

function tokenizeWords(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

function lcsTable(a: string[], b: string[]): number[][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp;
}

function backtrack(dp: number[][], a: string[], b: string[], separator: string): DiffSegment[] {
  const result: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  const flush = (type: DiffType, buffer: string[]) => {
    if (buffer.length) {
      result.push({ type, value: buffer.join(separator) });
      buffer.length = 0;
    }
  };

  const removed: string[] = [];
  const added: string[] = [];
  const equal: string[] = [];

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      flush('removed', removed);
      flush('added', added);
      equal.push(a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      flush('equal', equal);
      flush('added', added);
      removed.push(a[i]);
      i++;
    } else {
      flush('equal', equal);
      flush('removed', removed);
      added.push(b[j]);
      j++;
    }
  }

  while (i < a.length) {
    flush('equal', equal);
    flush('added', added);
    removed.push(a[i]);
    i++;
  }
  while (j < b.length) {
    flush('equal', equal);
    flush('removed', removed);
    added.push(b[j]);
    j++;
  }

  flush('equal', equal);
  flush('added', added);
  flush('removed', removed);

  return result;
}

export function diffLines(oldText: string, newText: string): DiffSegment[] {
  const a = tokenizeLines(oldText);
  const b = tokenizeLines(newText);
  return backtrack(lcsTable(a, b), a, b, '\n');
}

export function diffWords(oldText: string, newText: string): DiffSegment[] {
  const a = tokenizeWords(oldText);
  const b = tokenizeWords(newText);
  return backtrack(lcsTable(a, b), a, b, '');
}

export function diffStats(segments: DiffSegment[]): DiffStats {
  const count = (value: string) => (value === '' ? 0 : value.split('\n').length);
  return segments.reduce<DiffStats>(
    (acc, seg) => {
      if (seg.type === 'added') acc.added += count(seg.value);
      else if (seg.type === 'removed') acc.removed += count(seg.value);
      else acc.unchanged += count(seg.value);
      return acc;
    },
    { added: 0, removed: 0, unchanged: 0 }
  );
}

export function diffToHtml(segments: DiffSegment[]): string {
  return segments
    .map((seg) => {
      const cls = seg.type === 'added' ? 'diff-added' : seg.type === 'removed' ? 'diff-removed' : 'diff-equal';
      const prefix = seg.type === 'added' ? '+' : seg.type === 'removed' ? '-' : ' ';
      const escaped = seg.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '\n');
      return `<span class="${cls}">${prefix}${escaped}</span>`;
    })
    .join('');
}
