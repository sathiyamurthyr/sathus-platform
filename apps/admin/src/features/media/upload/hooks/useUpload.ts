'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { computeFileChecksum, completeUpload, getUploadProgress, getUploadSession, resumeUpload, startUpload, uploadChunk } from '@/lib/upload-client';
import type { UploadSession } from '@/types/upload';

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

interface UseUploadOptions {
  onComplete?: (session: UploadSession) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = React.useState<UploadSession | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const startMutation = useMutation({
    mutationFn: startUpload,
    onSuccess: (session) => {
      setActiveSession(session);
      queryClient.setQueryData(['upload', session.id], session);
    },
  });

  const resumeMutation = useMutation({
    mutationFn: resumeUpload,
    onSuccess: (session) => {
      setActiveSession(session);
      queryClient.setQueryData(['upload', session.id], session);
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeUpload,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['upload', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['upload-progress', sessionId] });
    },
  });

  const sessionQuery = useQuery({
    queryKey: ['upload', activeSession?.id],
    queryFn: () => getUploadSession(activeSession!.id),
    enabled: false,
  });

  const progressQuery = useQuery({
    queryKey: ['upload-progress', activeSession?.id],
    queryFn: () => getUploadProgress(activeSession!.id),
    enabled: !!activeSession?.id && (activeSession.status === 'Uploading' || activeSession.status === 'Paused'),
    refetchInterval: 1000,
  });

  async function uploadFile(file: File, overrides?: { chunkSize?: number; folderId?: string; parentSessionId?: string; isFolder?: boolean; folderPath?: string }) {
    abortControllerRef.current = new AbortController();

    try {
      const checksum = await computeFileChecksum(file);
      const chunkSize = overrides?.chunkSize ?? DEFAULT_CHUNK_SIZE;

      // Generate preview data URL for image files
      let previewUrl = '';
      if (file.type.startsWith('image/')) {
        try {
          previewUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        } catch {
          // Ignore
        }
      }

      const session = await startMutation.mutateAsync({
        fileName: file.name,
        fileExtension: file.name.split('.').pop() || 'bin',
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        checksum,
        chunkSize,
        folderId: overrides?.folderId,
        parentSessionId: overrides?.parentSessionId,
        isFolder: overrides?.isFolder ?? false,
        folderPath: overrides?.folderPath,
      });

      if (previewUrl) {
        session.storageKey = previewUrl;
      }

      setActiveSession(session);
      await uploadChunks(session, file, chunkSize, previewUrl);
      return session;
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    }
  }

  async function uploadChunks(session: UploadSession, file: File, chunkSize: number, previewUrl?: string) {
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Upload aborted');
      }

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const buffer = await chunk.arrayBuffer();

      try {
        await uploadChunk(session.id, i, buffer);
        queryClient.setQueryData(['upload', session.id], (old: UploadSession | undefined) => {
          if (!old) return old;
          return { ...old, uploadedChunks: i + 1, progress: ((i + 1) / totalChunks) * 100 };
        });
      } catch (error) {
        queryClient.setQueryData(['upload', session.id], (old: UploadSession | undefined) => {
          if (!old) return old;
          return { ...old, status: 'Failed' as const, errorMessage: (error as Error).message };
        });
        throw error;
      }
    }

    const completed = await completeMutation.mutateAsync(session.id);
    const storageKey = previewUrl || completed.storageKey || `local/${file.name}`;
    setActiveSession((prev) => prev ? { ...prev, status: 'Completed', storageKey } : null);

    // Save newly uploaded asset into local media store so it immediately shows in the grid
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('sathus_media_assets') : null;
      const list = stored ? JSON.parse(stored) : [];
      const newAsset = {
        id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        fileName: file.name,
        fileExtension: file.name.split('.').pop() || 'bin',
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        checksum: session.checksum || `sha256:${Date.now()}`,
        storageKey,
        title: file.name.replace(/\.[^/.]+$/, ''),
        altText: file.name,
        type: file.type.startsWith('image/')
          ? 'Image'
          : file.type.startsWith('video/')
          ? 'Video'
          : file.type.startsWith('audio/')
          ? 'Audio'
          : 'Document',
        status: 'Ready',
        language: 'en',
        tags: [{ id: 'user_upload', name: 'Uploaded', slug: 'uploaded' }],
        usageCount: 0,
        versionCount: 1,
        metadataCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newAsset);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sathus_media_assets', JSON.stringify(list));
      }
    } catch {
      // Ignore
    }

    queryClient.invalidateQueries({ queryKey: ['media-assets'] });
    options.onComplete?.(session);
  }

  function cancel() {
    abortControllerRef.current?.abort();
    if (activeSession) {
      setActiveSession((prev) => prev ? { ...prev, status: 'Cancelled' } : null);
    }
  }

  function reset() {
    setActiveSession(null);
    queryClient.removeQueries({ queryKey: ['upload'] });
    queryClient.removeQueries({ queryKey: ['upload-progress'] });
  }

  return {
    activeSession,
    startUpload: startMutation.mutateAsync,
    resumeUpload: resumeMutation.mutateAsync,
    uploadFile,
    cancelUpload: cancel,
    reset,
    isUploading: startMutation.isPending || resumeMutation.isPending,
    progress: progressQuery.data,
  };
}
