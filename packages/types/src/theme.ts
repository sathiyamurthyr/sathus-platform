export interface ThemeProviderState {
  theme: 'light' | 'dark' | 'high-contrast' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast' | 'system') => void;
  resolvedTheme: 'light' | 'dark' | 'high-contrast';
}

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'icon' | 'ghost';
}
