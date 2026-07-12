'use client';

import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import { UploadDropzone } from './UploadDropzone';
import { UploadQueue } from './UploadQueue';

export function UploadManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Upload Manager</h2>
      </div>
      <UploadDropzone />
      <UploadQueue />
    </div>
  );
}
