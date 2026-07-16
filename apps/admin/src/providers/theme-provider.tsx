'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ComponentProps } from 'react';

/**
 * Application theme provider.
 *
 * Wraps `next-themes` with Sathus defaults. It toggles a `class` on the
 * document root (`light` | `dark`) so the Tailwind `dark:` variant and the
 * design-token CSS variables stay in sync.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="sathus-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
