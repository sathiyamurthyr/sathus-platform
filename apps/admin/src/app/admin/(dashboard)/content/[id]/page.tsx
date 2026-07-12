'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/PageHeader';
import { ContentEditor, type ContentSaveData } from '@/components/content/ContentEditor';

import type { ContentItem, WorkflowActionValue } from '@/types/content';
import {
  getContentItem,
  createContentItem,
  updateContentItem,
  applyWorkflow,
} from '@/lib/content-store';

interface ContentFormPageProps {
  params: Promise<{ id: string }>;
}

export default function ContentFormPage({ params }: ContentFormPageProps) {
  const router = useRouter();
  const [id, setId] = React.useState<string>('');
  const [resolved, setResolved] = React.useState(false);

  React.useEffect(() => {
    params.then((p) => {
      setId(p.id);
      setResolved(true);
    });
  }, [params]);

  const isNew = id === 'new';
  const [initial, setInitial] = React.useState<ContentItem | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentUser] = React.useState<string>('admin');

  React.useEffect(() => {
    if (!resolved || isNew) return;
    let cancelled = false;
    setLoading(true);
    try {
      const data = getContentItem(id);
      if (!cancelled) {
        if (!data) {
          setError('Content not found.');
        } else {
          setInitial(data);
        }
        setLoading(false);
      }
    } catch {
      if (!cancelled) {
        setError('Content not found.');
        setLoading(false);
      }
    }
    return () => {
      cancelled = true;
    };
  }, [resolved, id, isNew]);

  const handleSave = async (data: ContentSaveData) => {
    setError(null);
    try {
      if (isNew) {
        const created = createContentItem(
          {
            title: data.title,
            slug: data.slug,
            body: data.body,
            description: data.description,
            contentType: data.contentType,
            status: data.status,
            noIndex: data.seo.noIndex,
            ogImage: data.seo.ogImage,
            seoCanonical: data.seo.seoCanonical,
            seoRobots: data.seo.seoRobots,
            ogTitle: data.seo.ogTitle,
            ogDescription: data.seo.ogDescription,
            ogType: data.seo.ogType,
            twitterCard: data.seo.twitterCard,
            focusKeyword: data.seo.focusKeyword,
            schemaJson: data.seo.schemaJson,
            redirectFrom: data.seo.redirectFrom,
            featured: data.featured,
            deprecated: data.deprecated,
            navigationTitle: data.navigationTitle,
            displayOrder: data.displayOrder,
            categoryNames: [],
            tagNames: [],
          },
          currentUser
        );
        router.replace(`/admin/content/${created.id}`);
      } else {
        const updated = updateContentItem(
          id,
          {
            title: data.title,
            slug: data.slug,
            body: data.body,
            description: data.description,
            contentType: data.contentType,
            status: data.status,
            noIndex: data.seo.noIndex,
            ogImage: data.seo.ogImage,
            seoCanonical: data.seo.seoCanonical,
            seoRobots: data.seo.seoRobots,
            ogTitle: data.seo.ogTitle,
            ogDescription: data.seo.ogDescription,
            ogType: data.seo.ogType,
            twitterCard: data.seo.twitterCard,
            focusKeyword: data.seo.focusKeyword,
            schemaJson: data.seo.schemaJson,
            redirectFrom: data.seo.redirectFrom,
            featured: data.featured,
            deprecated: data.deprecated,
            navigationTitle: data.navigationTitle,
            displayOrder: data.displayOrder,
          },
          currentUser
        );
        setInitial(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
      throw err;
    }
  };

  const handleWorkflowAction = async (
    action: WorkflowActionValue,
    payload?: { approvalNote?: string; scheduledAt?: string }
  ) => {
    if (isNew || !initial) return;
    setError(null);
    try {
      const updated = applyWorkflow(initial.id, action, {
        authorName: currentUser,
        approvalNote: payload?.approvalNote,
        scheduledAt: payload?.scheduledAt,
      });
      setInitial(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow action failed');
    }
  };

  const handleRestored = (item: ContentItem) => {
    setInitial(item);
  };

  if (!resolved) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title={isNew ? 'New Content' : 'Edit Content'}
        description={
          isNew
            ? 'Create a new page, article, product, or documentation.'
            : `Update ${initial?.title ?? 'content'}.`
        }
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ContentEditor
          id={id}
          initial={initial}
          currentUser={currentUser}
          onSave={handleSave}
          onWorkflowAction={handleWorkflowAction}
          onRestored={handleRestored}
        />
      )}
    </div>
  );
}
