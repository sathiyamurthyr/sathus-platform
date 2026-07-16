import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionIntroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  tone?: 'light' | 'dark';
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  tone = 'light',
}: SectionIntroProps) {
  const isDark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]',
            isDark ? 'text-white/60' : 'text-primary'
          )}
        >
          <span className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl',
          isDark ? 'text-white' : 'text-foreground'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed sm:text-lg',
            isDark ? 'text-white/60' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
