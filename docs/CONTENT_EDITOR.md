# Content Editor — Editor, Workflow, Versioning & SEO

The admin `ContentEditor` (`apps/admin/src/components/content/ContentEditor.tsx`)
provides a full content authoring experience. This document covers the
capabilities delivered for features **10.4.5 – 10.4.9**.

## 10.4.5 — Editor

- **Rich Text** (`RichTextEditor.tsx`): a `contentEditable` editor with a
  formatting toolbar (bold, italic, underline, lists, headings, blockquote,
  code block, links, undo/redo). Keyboard shortcuts (`Ctrl/Cmd+B/I/U/K`) are
  handled natively by the editable region.
- **Autosave** (`hooks/use-autosave.ts`): the editor snapshot is debounced
  (1.5s) and persisted automatically. Status is surfaced in the header
  (`Saving…`, `All changes saved`, `Unsaved changes`, `Autosave failed`).
- **Preview** (`ContentPreview.tsx`): renders the body (markdown or sanitized
  HTML) with a live word count and a social/OG card preview.
- **Keyboard** (`hooks/use-keyboard-shortcuts.ts`): global shortcuts —
  `Ctrl/Cmd+S` saves, `Ctrl/Cmd+P` toggles preview. The hook ignores
  `contentEditable`/`input`/`textarea` targets unless `allowInInput` is set.
- **Unsaved Changes** (`hooks/use-unsaved-changes.ts`): registers a
  `beforeunload` guard whenever the editor is dirty.

## 10.4.6 — Workflow

State machine in `lib/content-workflow.ts` with explicit transitions
(Draft → InReview → Approved → Scheduled → Published, plus Archive/Restore).

- **Approval**: reviewers approve or request changes with a note.
- **Publishing**: publish/unpublish with `publishedAt` bookkeeping.
- **Scheduling**: schedule a publish date/time; `isPublishDue` detects when a
  scheduled item should go live.
- **Archiving**: archive and restore published/archived items.

The `ContentWorkflow.tsx` panel exposes available actions for the current
status and shows audit metadata (reviewer, timestamps).

## 10.4.7 — Version History

`VersionHistory.tsx` + `lib/versioning.ts` + `lib/diff.ts`:

- **Compare**: line-level diff (`diffLines`, LCS based) between any two
  versions or the current body.
- **Restore**: restores a prior version and records a new snapshot.
- **Diff**: added/removed/unchanged line counts and color-coded diff view.
- **Comments**: per-version comments thread.

## 10.4.8 — SEO

`SeoPanel.tsx` manages:

- **OpenGraph**: `ogTitle`, `ogDescription`, `ogImage`, `ogType` with a live
  social preview.
- **Schema**: raw JSON-LD with inline validation.
- **Canonical**: canonical URL field.
- **Robots**: `robots` directive + `noIndex` toggle.
- **Redirects**: 301 legacy-path redirects (tag-style input).

## 10.4.9 — Quality

- **Unit tests**: `slug`, `markdown`/`sanitizeHtml`, `diff`, `content-workflow`,
  `versioning`, `content-store`, and `content-client` (mocked `fetch`).
- **Integration tests**: content store CRUD + workflow + version restore via an
  in-memory `localStorage` mock; content client contract via mocked `fetch`.
- **Performance**: `React.memo` on the preview, `useCallback`/`useMemo` on
  handlers and derived values, debounced autosave.
- **Accessibility**: `role="toolbar"`/`role="tablist"`, `aria-selected`,
  `aria-label`s, `aria-live` status regions, and visible focus rings.
- **Documentation**: this file.

## Persistence note

With no content API backend present, the editor persists through a
localStorage-backed store (`lib/content-store.ts`). The API contract is also
exposed via `lib/content-client.ts` (`/api/content/...` endpoints) for when a
backend is wired up.
