export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getMediaTypeFromMime(mimeType: string): 'Image' | 'Video' | 'Audio' | 'Document' | 'Archive' | 'Other' {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType.includes('text/') ||
    mimeType.includes('json') ||
    mimeType.includes('xml')
  ) {
    return 'Document';
  }
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar') || mimeType.includes('7z')) {
    return 'Archive';
  }
  return 'Other';
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? '' : '';
}

export function generatePreviewUrl(storageKey: string, mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    return `/api/v1/media/preview/${storageKey}`;
  }
  if (mimeType.startsWith('video/')) {
    return `/api/v1/media/preview/${storageKey}`;
  }
  if (mimeType.startsWith('audio/')) {
    return `/api/v1/media/preview/${storageKey}`;
  }
  return `/api/v1/media/download/${storageKey}`;
}

export function getMimeTypeCategory(mimeType: string): string {
  const category = mimeType.split('/')[0];
  const map: Record<string, string> = {
    image: 'Image',
    video: 'Video',
    audio: 'Audio',
    application: 'Document',
    text: 'Text',
  };
  return map[category] ?? 'Other';
}

import * as React from 'react';

export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
