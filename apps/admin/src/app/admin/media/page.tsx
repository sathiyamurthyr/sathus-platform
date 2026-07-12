import { UploadManager } from '@/features/media/upload/components/UploadManager';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">Upload and manage your digital assets</p>
      </div>
      <UploadManager />
    </div>
  );
}
