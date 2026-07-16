'use client';

import { ThemeToggle } from '@/components/admin/theme-toggle';

function ThemeSwitcher() {
  return (
    <span aria-label="Toggle theme">
      <ThemeToggle />
    </span>
  );
}

export { ThemeSwitcher };
