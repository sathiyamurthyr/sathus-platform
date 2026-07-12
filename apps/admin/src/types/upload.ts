export interface UploadSession {
  id: string;
  sessionId: string;
  fileName: string;
  fileExtension: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
  checksum?: string;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number;
  progress: number;
  status: 'Pending' | 'Uploading' | 'Paused' | 'Completed' | 'Failed' | 'Cancelled';
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdBy?: string;
  tenantId?: string;
  folderId?: string;
  parentSessionId?: string;
  isFolder: boolean;
  folderPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgress {
  sessionId: string;
  sessionIdentifier: string;
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
  status: string;
  bytesUploaded: number;
  bytesTotal: number;
  speedBytesPerSecond: number;
  estimatedRemaining?: number;
}

export interface UploadChunk {
  chunkIndex: number;
  status: string;
  storageKey?: string;
  completedAt?: string;
}

export interface UploadResult {
  sessionId: string;
  sessionIdentifier: string;
  status: string;
  storageKey?: string;
  errorMessage?: string;
  completedAt?: string;
}

export interface UploadError {
  code: string;
  message: string;
}

export type UploadStatus = UploadSession['status'];
