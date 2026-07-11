'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'high-contrast' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark' | 'high-contrast';
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
);

function getSystemTheme(): 'light' | 'dark' | 'high-contrast' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'sathus-theme',
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<
    'light' | 'dark' | 'high-contrast'
  >(getSystemTheme());

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');

    if (theme === 'system') {
      const system = getSystemTheme();
      setResolvedTheme(system);
      root.classList.add(system);
    } else {
      setResolvedTheme(theme);
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (t: Theme) => {
      try {
        localStorage.setItem(storageKey, t);
      } catch {
        // localStorage unavailable
      }
      setTheme(t);
    },
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
