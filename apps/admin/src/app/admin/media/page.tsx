import { MediaWorkspace } from '@/features/media/workspace/MediaWorkspace';

export default function MediaPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">Discover, organize, preview, and manage your digital assets</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <MediaWorkspace />
      </div>
    </div>
  );
}
