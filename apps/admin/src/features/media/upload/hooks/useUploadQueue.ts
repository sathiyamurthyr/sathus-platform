'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelUpload, completeUpload, resumeUpload } from '@/lib/upload-client';
import type { UploadSession } from '@/types/upload';

export function useUploadQueue() {
  const queryClient = useQueryClient();
  const [queue, setQueue] = React.useState<UploadSession[]>([]);

  const addToQueue = React.useCallback((session: UploadSession) => {
    setQueue((prev) => [...prev, session]);
  }, []);

  const removeFromQueue = React.useCallback((sessionId: string) => {
    setQueue((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const cancelMutation = useMutation({
    mutationFn: cancelUpload,
    onSuccess: (_, sessionId) => {
      removeFromQueue(sessionId);
      queryClient.invalidateQueries({ queryKey: ['upload', sessionId] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeUpload,
    onSuccess: (_, sessionId) => {
      removeFromQueue(sessionId);
      queryClient.invalidateQueries({ queryKey: ['upload', sessionId] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: resumeUpload,
    onSuccess: (session) => {
      setQueue((prev) => prev.map((s) => s.id === session.id ? session : s));
    },
  });

  return {
    queue,
    addToQueue,
    removeFromQueue,
    cancel: cancelMutation.mutateAsync,
    complete: completeMutation.mutateAsync,
    retry: retryMutation.mutateAsync,
    isProcessing: cancelMutation.isPending || completeMutation.isPending || retryMutation.isPending,
  };
}
