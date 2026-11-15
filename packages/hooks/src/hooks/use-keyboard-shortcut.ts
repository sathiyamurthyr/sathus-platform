import * as React from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers?: { ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean }
) {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const ctrl = modifiers?.ctrl ?? false;
      const meta = modifiers?.meta ?? false;
      const shift = modifiers?.shift ?? false;
      const alt = modifiers?.alt ?? false;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.metaKey === meta &&
        event.shiftKey === shift &&
        event.altKey === alt
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}
