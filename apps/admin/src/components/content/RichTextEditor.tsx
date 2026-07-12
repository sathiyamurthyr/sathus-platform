'use client';

import * as React from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2,
  Quote, Code, Link2, Undo2, Redo2,
} from 'lucide-react';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  ariaLabel?: string;
  placeholder?: string;
  minHeight?: number;
}

interface ToolbarButton {
  command: string;
  arg?: string;
  label: string;
  icon: React.ReactNode;
}

const BLOCK_TAGS: { tag: string; label: string; icon: React.ReactNode }[] = [
  { tag: 'h1', label: 'Heading 1', icon: <Heading1 className="h-4 w-4" /> },
  { tag: 'h2', label: 'Heading 2', icon: <Heading2 className="h-4 w-4" /> },
  { tag: 'blockquote', label: 'Quote', icon: <Quote className="h-4 w-4" /> },
  { tag: 'pre', label: 'Code block', icon: <Code className="h-4 w-4" /> },
];

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  function RichTextEditor({ value, onChange, ariaLabel = 'Content body', placeholder, minHeight = 280 }, ref) {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const [isEmpty, setIsEmpty] = React.useState(!value);

    React.useEffect(() => {
      const node = innerRef.current;
      if (node && value !== node.innerHTML) {
        node.innerHTML = value;
        setIsEmpty(!node.textContent?.trim());
      }
    }, [value]);

    const emit = React.useCallback(() => {
      const node = innerRef.current;
      if (!node) return;
      setIsEmpty(!node.textContent?.trim());
      onChange(node.innerHTML);
    }, [onChange]);

    const exec = React.useCallback(
      (command: string, arg?: string) => {
        const node = innerRef.current;
        if (!node) return;
        node.focus();
        document.execCommand(command, false, arg);
        emit();
      },
      [emit]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        exec('bold');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        exec('italic');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        exec('underline');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const url = window.prompt('Link URL');
        if (url) exec('createLink', url);
      }
    };

    const insertLink = () => {
      const url = window.prompt('Link URL');
      if (url) exec('createLink', url);
    };

    const buttons: ToolbarButton[] = [
      { command: 'bold', label: 'Bold (Ctrl+B)', icon: <Bold className="h-4 w-4" /> },
      { command: 'italic', label: 'Italic (Ctrl+I)', icon: <Italic className="h-4 w-4" /> },
      { command: 'underline', label: 'Underline (Ctrl+U)', icon: <Underline className="h-4 w-4" /> },
      { command: 'insertUnorderedList', label: 'Bullet list', icon: <List className="h-4 w-4" /> },
      { command: 'insertOrderedList', label: 'Numbered list', icon: <ListOrdered className="h-4 w-4" /> },
    ];

    return (
      <div className="rounded-md border border-input">
        <div
          role="toolbar"
          aria-label="Formatting"
          className="flex flex-wrap items-center gap-1 border-b border-input p-2"
        >
          {buttons.map((btn) => (
            <button
              key={btn.command}
              type="button"
              aria-label={btn.label}
              title={btn.label}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => exec(btn.command)}
            >
              {btn.icon}
            </button>
          ))}

          {BLOCK_TAGS.map((block) => (
            <button
              key={block.tag}
              type="button"
              aria-label={block.label}
              title={block.label}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => exec('formatBlock', block.tag)}
            >
              {block.icon}
              <span className="sr-only">{block.label}</span>
            </button>
          ))}

          <button
            type="button"
            aria-label="Insert link"
            title="Insert link"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={insertLink}
          >
            <Link2 className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

          <button
            type="button"
            aria-label="Undo"
            title="Undo"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => exec('undo')}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => exec('redo')}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          {isEmpty && placeholder && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground"
            >
              {placeholder}
            </div>
          )}
          <div
            ref={setRefs}
            role="textbox"
            aria-multiline="true"
            aria-label={ariaLabel}
            contentEditable
            suppressContentEditableWarning
            onInput={emit}
            onBlur={emit}
            onKeyDown={handleKeyDown}
            className="prose prose-sm max-w-none overflow-auto p-3 text-sm focus-visible:outline-none"
            style={{ minHeight }}
          />
        </div>
      </div>
    );
  }
);
