import * as React from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
