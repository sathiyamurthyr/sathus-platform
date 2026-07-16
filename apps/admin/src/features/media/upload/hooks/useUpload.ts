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

      setActiveSession(session);
      await uploadChunks(session, file, chunkSize);
      return session;
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    }
  }

  async function uploadChunks(session: UploadSession, file: File, chunkSize: number) {
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
    setActiveSession((prev) => prev ? { ...prev, status: 'Completed', storageKey: completed.storageKey } : null);
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
