'use client';

import * as React from 'react';
import { FolderOpen, File } from 'lucide-react';

interface FolderUploaderProps {
  onFolderSelect: (files: File[]) => void;
  isUploading: boolean;
}

export function FolderUploader({ onFolderSelect, isUploading }: FolderUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    onFolderSelect(files);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:border-primary/50"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        {...{ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>}
        onChange={handleChange}
        disabled={isUploading}
      />
      <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">Select a folder to upload</p>
      <p className="text-xs text-muted-foreground">All files in the folder will be uploaded recursively</p>
    </div>
  );
}
