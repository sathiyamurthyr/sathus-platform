import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function BrandLogo({
  className,
  showWordmark = true,
  wordmarkClassName,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <motion.span
        className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-primary via-violet-500 to-cyan-400 shadow-sm ring-1 ring-inset ring-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          aria-hidden="true"
        >
          <path
            d="M7 8.5a4.5 4.5 0 0 1 9 0v7a3 3 0 0 1-6 0v-4.5a1.5 1.5 0 0 1 3 0V14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="8.5" r="1.6" fill="currentColor" />
          <circle cx="16" cy="8.5" r="1.6" fill="currentColor" />
          <circle cx="13" cy="14" r="1.6" fill="currentColor" />
        </svg>
      </motion.span>
      {showWordmark && (
        <span
          className={cn(
            'flex flex-col leading-none',
            wordmarkClassName
          )}
        >
          <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
            Sathus
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Technology
          </span>
        </span>
      )}
    </span>
  );
}
