interface SearchEmptyProps {
  query: string;
}

export function SearchEmpty({ query }: SearchEmptyProps) {
  return (
    <div className="p-6 text-center">
      <p className="text-sm text-muted-foreground">
        No results found for <span className="font-medium text-foreground">&quot;{query}&quot;</span>
      </p>
    </div>
  );
}
