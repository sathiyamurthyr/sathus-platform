'use client';

import * as React from 'react';

/**
 * Reactively tracks a CSS media query.
 *
 * Returns `false` during the first client render so server and client markup
 * match, then updates after mount. Safe to use for progressive enhancement
 * (never block rendering on the result).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);

    const update = () => setMatches(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** True when the viewport is below the `md` breakpoint (mobile). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
