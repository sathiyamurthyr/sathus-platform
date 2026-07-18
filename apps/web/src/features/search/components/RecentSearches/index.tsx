interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Recent Searches
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search}
            type="button"
            onClick={() => onSelect(search)}
            className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}