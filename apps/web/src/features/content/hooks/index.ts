'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, ContentQuery, ContentType } from '../types';
import { ContentService } from '../services/content-service';
import { MockStorageProvider } from '../providers/storage-provider';

const storageProvider = new MockStorageProvider();
const contentService = new ContentService(storageProvider);

export function useContentItem(id: string) {
  const [item, setItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contentService.getContentItem(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { item, isLoading, error };
}

export function useContentItems(query: ContentQuery) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contentService.getContentItems(query)
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [query]);

  return { items, isLoading, error };
}

export function useContentType(id: string) {
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contentService.getContentType(id)
      .then(setContentType)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { contentType, isLoading, error };
}

export function useContentTypes() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contentService.getContentTypes()
      .then(setContentTypes)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { contentTypes, isLoading, error };
}