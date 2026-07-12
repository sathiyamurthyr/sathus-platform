'use client';

import * as React from 'react';
import { Save, Eye, FileText, Search, GitBranch, ShieldCheck, Loader2 } from 'lucide-react';

import { CONTENT_TYPES, CONTENT_STATUSES } from '@/types/content';
import type {
  ContentItem,
  ContentTypeValue,
  ContentStatusValue,
  SeoSettings,
  WorkflowActionValue,
} from '@/types/content';

import { RichTextEditor } from './RichTextEditor';
import { ContentPreview } from './ContentPreview';
import { SeoPanel } from './SeoPanel';
import { ContentWorkflow } from './ContentWorkflow';
import { VersionHistory } from './VersionHistory';

import { useAutosave, type AutosaveStatus } from '@/hooks/use-autosave';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { useKeyboardShortcuts, EDITOR_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';
import { slugify } from '@/lib/slug';

export interface ContentSaveData {
  title: string;
  slug: string;
  body: string;
  description?: string;
  contentType: ContentTypeValue;
  status: ContentStatusValue;
  featured: boolean;
  deprecated: boolean;
  navigationTitle?: string;
  displayOrder?: number;
  seo: SeoSettings;
  categoryIds: string[];
  tagIds: string[];
}

export interface ContentEditorProps {
  id: string;
  initial: ContentItem | null;
  currentUser: string;
  onSave: (data: ContentSaveData) => Promise<void> | void;
  onWorkflowAction?: (action: WorkflowActionValue, payload?: { approvalNote?: string; scheduledAt?: string }) => Promise<void> | void;
  onRestored?: (item: ContentItem) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

type TabKey = 'write' | 'preview' | 'seo' | 'workflow' | 'history';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'write', label: 'Write', icon: <FileText className="h-4 w-4" /> },
  { key: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" /> },
  { key: 'seo', label: 'SEO', icon: <Search className="h-4 w-4" /> },
  { key: 'workflow', label: 'Workflow', icon: <ShieldCheck className="h-4 w-4" /> },
  { key: 'history', label: 'History', icon: <GitBranch className="h-4 w-4" /> },
];

function statusLabel(status: AutosaveStatus): string {
  switch (status) {
    case 'saving':
      return 'Saving…';
    case 'saved':
      return 'All changes saved';
    case 'dirty':
      return 'Unsaved changes';
    case 'error':
      return 'Autosave failed';
    default:
      return 'Saved';
  }
}

export function ContentEditor({
  initial,
  currentUser,
  onSave,
  onWorkflowAction,
  onRestored,
  onDirtyChange,
}: ContentEditorProps) {
  const [title, setTitle] = React.useState(initial?.title ?? '');
  const [slug, setSlug] = React.useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [body, setBody] = React.useState(initial?.body ?? '');
  const [description, setDescription] = React.useState(initial?.description ?? '');
  const [contentType, setContentType] = React.useState<ContentTypeValue>(initial?.contentType ?? 'Page');
  const [status, setStatus] = React.useState<ContentStatusValue>(initial?.status ?? 'Draft');
  const [featured, setFeatured] = React.useState(initial?.featured ?? false);
  const [deprecated, setDeprecated] = React.useState(initial?.deprecated ?? false);
  const [navigationTitle, setNavigationTitle] = React.useState(initial?.navigationTitle ?? '');
  const [displayOrder, setDisplayOrder] = React.useState(initial?.displayOrder?.toString() ?? '');

  const [seo, setSeo] = React.useState<SeoSettings>({
    seoCanonical: initial?.seoCanonical ?? '',
    seoRobots: initial?.seoRobots ?? '',
    noIndex: initial?.noIndex ?? false,
    ogTitle: initial?.ogTitle ?? '',
    ogDescription: initial?.ogDescription ?? '',
    ogImage: initial?.ogImage ?? '',
    ogType: initial?.ogType ?? 'website',
    twitterCard: initial?.twitterCard ?? 'summary_large_image',
    focusKeyword: initial?.focusKeyword ?? '',
    schemaJson: initial?.schemaJson ?? '',
    redirectFrom: initial?.redirectFrom ?? [],
  });

  const [tab, setTab] = React.useState<TabKey>('write');
  const [manualSaveError, setManualSaveError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const liveRef = React.useRef(initial);
  liveRef.current = initial;

  React.useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setSlug(initial.slug);
    setSlugTouched(true);
    setBody(initial.body);
    setDescription(initial.description ?? '');
    setContentType(initial.contentType);
    setStatus(initial.status);
    setFeatured(initial.featured);
    setDeprecated(initial.deprecated);
    setNavigationTitle(initial.navigationTitle ?? '');
    setDisplayOrder(initial.displayOrder?.toString() ?? '');
    setSeo({
      seoCanonical: initial.seoCanonical ?? '',
      seoRobots: initial.seoRobots ?? '',
      noIndex: initial.noIndex,
      ogTitle: initial.ogTitle ?? '',
      ogDescription: initial.ogDescription ?? '',
      ogImage: initial.ogImage ?? '',
      ogType: initial.ogType ?? 'website',
      twitterCard: initial.twitterCard ?? 'summary_large_image',
      focusKeyword: initial.focusKeyword ?? '',
      schemaJson: initial.schemaJson ?? '',
      redirectFrom: initial.redirectFrom ?? [],
    });
  }, [initial]);

  const snapshot = React.useMemo<ContentSaveData>(
    () => ({
      title,
      slug: slug || slugify(title),
      body,
      description: description || undefined,
      contentType,
      status,
      featured,
      deprecated,
      navigationTitle: navigationTitle || undefined,
      displayOrder: displayOrder ? Number(displayOrder) : undefined,
      seo,
      categoryIds: [],
      tagIds: [],
    }),
    [title, slug, body, description, contentType, status, featured, deprecated, navigationTitle, displayOrder, seo]
  );

  const persist = React.useCallback(
    async (data: ContentSaveData) => {
      await onSave(data);
    },
    [onSave]
  );

  const autosave = useAutosave<ContentSaveData>({
    value: snapshot,
    onSave: persist,
    delay: 1500,
  });

  const dirty = autosave.isDirty;
  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const unsaved = useUnsavedChanges({ dirty });

  const manualSave = React.useCallback(async () => {
    setSaving(true);
    setManualSaveError(null);
    try {
      const data = { ...snapshot, slug: snapshot.slug || slugify(snapshot.title) };
      await persist(data);
      autosave.flush();
    } catch (err) {
      setManualSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [snapshot, persist, autosave]);

  useKeyboardShortcuts(
    [
      { combo: EDITOR_SHORTCUTS.save, handler: () => void manualSave(), allowInInput: true, preventDefault: true },
      { combo: EDITOR_SHORTCUTS.preview, handler: () => setTab((t) => (t === 'preview' ? 'write' : 'preview')) },
    ],
    true
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const inputClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="tablist" aria-label="Editor sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                tab === t.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
            {autosave.status === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {statusLabel(autosave.status)}
          </span>
          <button
            type="button"
            onClick={() => void manualSave()}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {manualSaveError && <p className="text-sm text-destructive">{manualSaveError}</p>}
      {unsaved.dirty && (
        <p className="text-xs text-amber-600 dark:text-amber-400" role="status">
          You have unsaved changes. They autosave while you edit, or press Ctrl/Cmd+S.
        </p>
      )}

      {tab === 'write' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-title">Title</label>
                <input id="ce-title" className={inputClass} value={title} onChange={(e) => handleTitleChange(e.target.value)} required maxLength={256} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-slug">Slug</label>
                <input
                  id="ce-slug"
                  className={inputClass}
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value, { maxLength: 256 }));
                  }}
                  required
                  maxLength={256}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-desc">Description</label>
                <textarea id="ce-desc" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={512} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Body</label>
                <RichTextEditor value={body} onChange={setBody} placeholder="Write your content… Use Ctrl+B / Ctrl+I to format." />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <h3 className="text-sm font-medium">Settings</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-type">Type</label>
                <select id="ce-type" className={inputClass} value={contentType} onChange={(e) => setContentType(e.target.value as ContentTypeValue)}>
                  {CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-status">Status</label>
                <select id="ce-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as ContentStatusValue)}>
                  {CONTENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border border-input" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={deprecated} onChange={(e) => setDeprecated(e.target.checked)} className="h-4 w-4 rounded border border-input" /> Deprecated</label>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
              <h3 className="text-sm font-medium">Display</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-nav">Navigation Title</label>
                <input id="ce-nav" className={inputClass} value={navigationTitle} onChange={(e) => setNavigationTitle(e.target.value)} maxLength={256} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="ce-order">Display Order</label>
                <input id="ce-order" type="number" className={inputClass} value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div className="rounded-lg border p-6">
          <ContentPreview title={title} body={body} description={description} seo={seo} navigationTitle={navigationTitle} />
        </div>
      )}

      {tab === 'seo' && (
        <div className="rounded-lg border p-6">
          <SeoPanel seo={seo} title={title} slug={slug || slugify(title)} onChange={setSeo} />
        </div>
      )}

      {tab === 'workflow' && liveRef.current && (
        <div className="rounded-lg border p-6">
          <ContentWorkflow
            item={liveRef.current}
            currentUser={currentUser}
            onAction={async (action, payload) => {
              await onWorkflowAction?.(action, payload);
            }}
          />
        </div>
      )}

      {tab === 'history' && liveRef.current && (
        <div className="rounded-lg border p-6">
          <VersionHistory
            contentItemId={liveRef.current.id}
            currentUser={currentUser}
            currentBody={body}
            onRestore={(item) => onRestored?.(item as ContentItem)}
          />
        </div>
      )}
    </div>
  );
}
