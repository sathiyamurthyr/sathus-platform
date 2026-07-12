'use client';

import * as React from 'react';
import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ContentItem } from '@/types/content';

const contentTypeLabels: Record<string, string> = {
  Page: 'Page',
  Article: 'Article',
  DocPage: 'Doc',
  Product: 'Product',
};

const statusColors: Record<string, string> = {
  Draft: 'bg-muted text-muted-foreground',
  InReview: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Approved: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  Scheduled: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Archived: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export interface ContentTableProps {
  items: ContentItem[];
  onEdit: (id: string) => void;
  onDelete: (item: ContentItem) => void;
  onStatusToggle: (item: ContentItem) => void;
}

export function ContentTable({ items, onEdit, onDelete, onStatusToggle }: ContentTableProps) {
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                      {item.description && (
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="font-normal">
                    {contentTypeLabels[item.contentType] ?? item.contentType}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[item.status] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-muted-foreground">{item.slug}</code>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onStatusToggle(item)}>
                      {item.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
