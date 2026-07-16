'use client';

import * as React from 'react';
import { uploadChunk } from '@/lib/upload-client';
import type { UploadChunk } from '@/types/upload';

interface UseChunkUploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (chunk: UploadChunk) => void;
  onError?: (error: Error) => void;
}

export function useChunkUpload(options: UseChunkUploadOptions = {}) {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  async function upload(sessionId: string, chunkIndex: number, data: ArrayBuffer, checksum?: string) {
    setUploading(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const result = await uploadChunk(sessionId, chunkIndex, data, checksum);
      setProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    } finally {
      setUploading(false);
    }
  }

  function cancel() {
    abortControllerRef.current?.abort();
    setUploading(false);
  }

  return {
    upload,
    cancel,
    uploading,
    progress,
  };
}
