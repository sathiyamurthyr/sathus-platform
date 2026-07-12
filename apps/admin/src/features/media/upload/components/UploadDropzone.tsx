'use client';

import * as React from 'react';
import { UploadCloud, File, FolderOpen } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import { UploadCard } from './UploadCard';

interface UploadDropzoneProps {
  onUploadComplete?: (session: { id: string; fileName: string }) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const { uploadFile, activeSession, isUploading, cancelUpload, reset } = useUpload({
    onComplete: (session) => onUploadComplete?.({ id: session.id, fileName: session.fileName }),
  });
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      await uploadFile(file);
    } catch {
      // handled by hook
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  const handlePaste = React.useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/') || item.type.startsWith('video/') || item.type.startsWith('application/')) {
        const file = item.getAsFile();
        if (file) {
          uploadFile(file).catch(() => {});
          break;
        }
      }
    }
  }, [uploadFile]);

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const isActive = activeSession?.status === 'Uploading' || activeSession?.status === 'Paused';

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={isUploading}
      />
      <div className="flex flex-col items-center gap-3">
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Drop files here, paste from clipboard, or click to browse</p>
          <p className="text-xs text-muted-foreground">Supports single and folder uploads up to 10 GB</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <File className="h-4 w-4" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
          >
            <FolderOpen className="h-4 w-4" />
            Upload Folder
          </button>
        </div>
      </div>

      {isActive && activeSession && (
        <div className="mt-4">
          <UploadCard session={activeSession} onCancel={cancelUpload} onReset={reset} />
        </div>
      )}
    </div>
  );
}
