import { SearchWorkspace } from '@/features/search/workspace/SearchWorkspace';

export default function SearchPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-muted-foreground">
          Manage the global search index and run queries across all Sathus Platform content.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <SearchWorkspace />
      </div>
    </div>
  );
}
