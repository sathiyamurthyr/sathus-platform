export function SearchLoading() {
  return (
    <div className="p-6 text-center">
      <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
    </div>
  );
}