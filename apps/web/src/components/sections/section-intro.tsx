import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionIntroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  tone?: 'light' | 'dark';
  headingLevel?: 'h1' | 'h2';
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  tone = 'light',
  headingLevel = 'h2',
}: SectionIntroProps) {
  const isDark = tone === 'dark';
  const Heading = headingLevel;

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
      <Heading
        className={cn(
          'max-w-3xl text-balance font-display text-3xl leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl',
          isDark ? 'text-white' : 'text-foreground'
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            'max-w-2xl text-pretty text-base leading-relaxed sm:text-lg',
            isDark ? 'text-white/60' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
