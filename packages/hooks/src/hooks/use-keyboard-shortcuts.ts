import * as React from 'react';

export type KeyCombo = string;

export interface ShortcutHandler {
  combo: KeyCombo;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  allowInInput?: boolean;
}

function parseCombo(combo: KeyCombo): { mod: boolean; shift: boolean; alt: boolean; key: string } {
  const parts = combo.toLowerCase().split('+');
  const mod = parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd');
  const shift = parts.includes('shift');
  const alt = parts.includes('alt');
  const key = parts[parts.length - 1];
  return { mod, shift, alt, key };
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[], enabled = true): void {
  const ref = React.useRef(shortcuts);
  ref.current = shortcuts;

  React.useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const editable = isEditableTarget(event.target);
      for (const shortcut of ref.current) {
        const parsed = parseCombo(shortcut.combo);
        const modActive = event.ctrlKey || event.metaKey;
        const keyMatches =
          event.key.toLowerCase() === parsed.key ||
          event.code.toLowerCase() === `key${parsed.key}`;
        if (
          modActive === parsed.mod &&
          event.shiftKey === parsed.shift &&
          event.altKey === parsed.alt &&
          keyMatches
        ) {
          if (editable && !shortcut.allowInInput) continue;
          if (shortcut.preventDefault !== false) event.preventDefault();
          shortcut.handler(event);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}

export const EDITOR_SHORTCUTS = {
  save: 'mod+s',
  bold: 'mod+b',
  italic: 'mod+i',
  preview: 'mod+p',
  publish: 'mod+shift+p',
} as const;
