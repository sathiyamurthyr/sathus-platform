'use client';

import * as React from 'react';
import type { SeoSettings, TwitterCardType } from '@/types/content';

export interface SeoPanelProps {
  seo: SeoSettings;
  title: string;
  slug: string;
  onChange: (seo: SeoSettings) => void;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function SeoPanel({ seo, title, slug, onChange }: SeoPanelProps) {
  const update = React.useCallback(
    <K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) => {
      onChange({ ...seo, [key]: value });
    },
    [seo, onChange]
  );

  const toggleRedirect = (value: string) => {
    const list = seo.redirectFrom ?? [];
    onChange({ ...seo, redirectFrom: list.includes(value) ? list.filter((r) => r !== value) : [...list, value] });
  };

  const schemaError = React.useMemo(() => {
    if (!seo.schemaJson?.trim()) return null;
    try {
      JSON.parse(seo.schemaJson);
      return null;
    } catch {
      return 'Invalid JSON-LD';
    }
  }, [seo.schemaJson]);

  const serpUrl = `https://sathus.example.com/${slug || 'untitled'}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <h3 className="text-sm font-medium">Search &amp; crawlers</h3>
        <Field label="Canonical URL" hint="Absolute URL of the preferred version of this page.">
          <input className={inputClass} value={seo.seoCanonical ?? ''} onChange={(e) => update('seoCanonical', e.target.value)} maxLength={1024} />
        </Field>
        <Field label="Robots" hint="e.g. index, follow or noindex, nofollow">
          <input className={inputClass} value={seo.seoRobots ?? ''} onChange={(e) => update('seoRobots', e.target.value)} maxLength={128} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={seo.noIndex} onChange={(e) => update('noIndex', e.target.checked)} className="h-4 w-4 rounded border border-input" />
          Exclude from search engines (noindex)
        </label>
        <Field label="Focus keyword" hint="Primary keyword this content targets.">
          <input className={inputClass} value={seo.focusKeyword ?? ''} onChange={(e) => update('focusKeyword', e.target.value)} maxLength={256} />
        </Field>

        <h3 className="pt-2 text-sm font-medium">Open Graph</h3>
        <Field label="OG Title">
          <input className={inputClass} value={seo.ogTitle ?? ''} onChange={(e) => update('ogTitle', e.target.value)} maxLength={256} />
        </Field>
        <Field label="OG Description">
          <textarea className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={seo.ogDescription ?? ''} onChange={(e) => update('ogDescription', e.target.value)} maxLength={512} />
        </Field>
        <Field label="OG Image URL">
          <input className={inputClass} value={seo.ogImage ?? ''} onChange={(e) => update('ogImage', e.target.value)} maxLength={1024} />
        </Field>
        <Field label="OG Type">
          <select className={inputClass} value={seo.ogType ?? 'website'} onChange={(e) => update('ogType', e.target.value)}>
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
          </select>
        </Field>
        <Field label="Twitter Card">
          <select className={inputClass} value={seo.twitterCard ?? 'summary_large_image'} onChange={(e) => update('twitterCard', e.target.value as TwitterCardType)}>
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
            <option value="app">app</option>
            <option value="player">player</option>
          </select>
        </Field>

        <h3 className="pt-2 text-sm font-medium">Redirects</h3>
        <Field label="Legacy paths" hint="Old slugs that should 301-redirect to this page.">
          <input
            className={inputClass}
            placeholder="Add a path and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                e.preventDefault();
                toggleRedirect(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {(seo.redirectFrom ?? []).map((path) => (
            <span key={path} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
              {path}
              <button type="button" aria-label={`Remove ${path}`} className="text-muted-foreground hover:text-destructive" onClick={() => toggleRedirect(path)}>
                ×
              </button>
            </span>
          ))}
        </div>

        <h3 className="pt-2 text-sm font-medium">Structured data</h3>
        <Field label="JSON-LD Schema" hint="Raw schema.org JSON applied to the page. Validated automatically.">
          <textarea
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={seo.schemaJson ?? ''}
            onChange={(e) => update('schemaJson', e.target.value)}
            aria-invalid={!!schemaError}
          />
        </Field>
        {schemaError && <p className="text-xs text-destructive">{schemaError}</p>}
      </div>

      <div className="space-y-5">
        <h3 className="text-sm font-medium">Google preview</h3>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">{serpUrl}</p>
          <p className="truncate text-base text-[#1a0dab]">{seo.ogTitle || title || 'Untitled'}</p>
          <p className="line-clamp-2 text-xs text-[#4d5156]">
            {seo.ogDescription || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
