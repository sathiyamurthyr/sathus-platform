'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-[#625B60] hover:text-[#A20A3A]"
      onClick={() => setTheme('light')}
      aria-label="Sathus brand theme"
      title="Sathus brand theme"
    >
      <motion.span
        initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
        key={resolvedTheme}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        )}
      </motion.span>
    </Button>
  );
}
