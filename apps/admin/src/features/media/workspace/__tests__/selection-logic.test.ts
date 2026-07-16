import { describe, expect, it } from 'vitest';

describe('media workspace selection logic', () => {
  function createSelectionState() {
    let selected = new Set<string>();
    return {
      toggle: (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        selected = next;
        return next;
      },
      selectAll: (ids: string[]) => {
        selected = new Set(ids);
        return selected;
      },
      clear: () => {
        selected = new Set<string>();
        return selected;
      },
      count: () => selected.size,
    };
  }

  it('toggles selection on and off', () => {
    const state = createSelectionState();
    expect(state.count()).toBe(0);
    state.toggle('a');
    expect(state.count()).toBe(1);
    state.toggle('a');
    expect(state.count()).toBe(0);
  });

  it('supports multi-select', () => {
    const state = createSelectionState();
    state.toggle('a');
    state.toggle('b');
    state.toggle('c');
    expect(state.count()).toBe(3);
  });

  it('clears selection', () => {
    const state = createSelectionState();
    state.toggle('a');
    state.toggle('b');
    state.clear();
    expect(state.count()).toBe(0);
  });

  it('selects all', () => {
    const state = createSelectionState();
    state.selectAll(['1', '2', '3', '4']);
    expect(state.count()).toBe(4);
  });
});
