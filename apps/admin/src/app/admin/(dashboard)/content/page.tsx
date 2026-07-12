'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/admin/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ContentTable } from '@/components/content/ContentTable';
import { ContentFilters } from '@/components/content/ContentFilters';
import { DeleteContentDialog } from '@/components/content/DeleteContentDialog';

import type { ContentItem, ContentTypeValue, ContentStatusValue } from '@/types/content';
import { listContentItems, deleteContentItem, applyWorkflow } from '@/lib/content-store';

function useQueryState(key: string, defaultValue: string): [string, (value: string | undefined) => void] {
  const [value, setValue] = React.useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  });

  const update = React.useCallback((newValue: string | undefined) => {
    setValue(newValue || '');
  }, []);

  return [value, update];
}

export default function ContentPage() {
  const router = useRouter();

  const [page, _setPage] = useQueryState('page', '1');
  const [contentType, setContentType] = useQueryState('contentType', '');
  const [status, setStatus] = useQueryState('status', '');
  const [search, setSearch] = useQueryState('search', '');
  const [sortBy, setSortBy] = useQueryState('sortBy', 'createdAt');
  const [sortDescending, setSortDescending] = useQueryState('sortDescending', 'true');

  const pageNum = Number(page) || 1;

  const [items, setItems] = React.useState<ContentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ContentItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const updateParams = React.useCallback(
    (patch: Record<string, string | boolean | undefined>) => {
      const url = new URL(window.location.href);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '' || value === false) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, String(value));
        }
      }
      if (Number(url.searchParams.get('page')) <= 0) {
        url.searchParams.set('page', '1');
      }
      router.push(`${url.pathname}?${url.searchParams.toString()}`);
    },
    [router]
  );

  const loadItems = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = listContentItems({
        page: pageNum,
        pageSize: 20,
        contentType: contentType || undefined,
        status: status || undefined,
        search: search || undefined,
        sortBy: sortBy || undefined,
        sortDescending: sortDescending !== 'false',
      });
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [pageNum, contentType, status, search, sortBy, sortDescending]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      deleteContentItem(deleteTarget.id);
      setDeleteTarget(null);
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusToggle = async (item: ContentItem) => {
    try {
      applyWorkflow(item.id, item.status === 'Published' ? 'unpublish' : 'publish', { authorName: 'admin' });
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Content"
        description="Manage pages, articles, products, and documentation."
        actions={
          <Button size="sm" onClick={() => router.push('/admin/content/new')}>
            <Plus className="h-4 w-4" />
            New Content
          </Button>
        }
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              updateParams({ search: value || undefined, page: '1' });
            }}
          />
        </div>
        <ContentFilters
          contentType={contentType as ContentTypeValue | ''}
          status={status as ContentStatusValue | ''}
          sortBy={sortBy || 'createdAt'}
          sortDescending={sortDescending !== 'false'}
          onChange={(patch) => {
            if ('contentType' in patch) setContentType(patch.contentType as string || '');
            if ('status' in patch) setStatus(patch.status as string || '');
            if ('sortBy' in patch) setSortBy((patch.sortBy as string) || 'createdAt');
            if ('sortDescending' in patch) setSortDescending(patch.sortDescending ? 'true' : 'false');
            updateParams({ ...patch, page: '1' });
          }}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No content found"
          description="Get started by creating your first piece of content."
          action={
            <Button size="sm" onClick={() => router.push('/admin/content/new')}>
              <Plus className="h-4 w-4" />
              New Content
            </Button>
          }
        />
      ) : (
        <ContentTable
          items={items}
          onEdit={(itemId) => router.push(`/admin/content/${itemId}`)}
          onDelete={(item) => setDeleteTarget(item)}
          onStatusToggle={handleStatusToggle}
        />
      )}

      <DeleteContentDialog
        open={!!deleteTarget}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
