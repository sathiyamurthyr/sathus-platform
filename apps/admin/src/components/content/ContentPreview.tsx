'use client';

import * as React from 'react';
import type { SeoSettings } from '@/types/content';
import { renderRichText, toPlainText } from '@/lib/markdown';

export interface ContentPreviewProps {
  title: string;
  body: string;
  description?: string;
  seo?: SeoSettings;
  navigationTitle?: string;
}

const Preview = React.memo(function Preview({ title, body, description, seo, navigationTitle }: ContentPreviewProps) {
  const html = React.useMemo(() => renderRichText(body), [body]);
  const plain = React.useMemo(() => toPlainText(body), [body]);

  return (
    <div className="space-y-6">
      <article className="rounded-lg border p-6">
        <header className="mb-4 space-y-1">
          <h1 className="text-2xl font-semibold">{title || 'Untitled'}</h1>
          {navigationTitle && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Nav: {navigationTitle}</p>
          )}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
        <div
          className="space-y-3 text-sm leading-relaxed [&_a]:text-primary [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_pre]:overflow-auto [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <p className="mt-4 text-xs text-muted-foreground">
          {plain.split(/\s+/).filter(Boolean).length} words
        </p>
      </article>

      {seo && (
        <div className="rounded-lg border p-6">
          <h3 className="mb-3 text-sm font-medium">Social preview</h3>
          <div className="overflow-hidden rounded-md border">
            <div className="flex aspect-[1.91/1] items-center justify-center bg-muted text-xs text-muted-foreground">
              {seo.ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={seo.ogImage} alt="" className="h-full w-full object-cover" />
              ) : (
                'OG Image'
              )}
            </div>
            <div className="space-y-1 p-3">
              <p className="text-xs uppercase text-muted-foreground">sathus.example.com</p>
              <p className="text-sm font-medium">{seo.ogTitle || title || 'Untitled'}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {seo.ogDescription || description || plain.slice(0, 140)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const ContentPreview = Preview;
