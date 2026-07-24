'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, Megaphone, Briefcase, Sparkles, CalendarDays, Newspaper, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAnnouncementDismiss } from '@/hooks/use-announcement-dismiss';
import { announcements } from '@/constants';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ElementType> = {
  Megaphone,
  Briefcase,
  Sparkles,
  CalendarDays,
  Newspaper,
};

export function AnnouncementBar() {
  const { isVisible, index, dismiss, setIndex } = useAnnouncementDismiss(announcements.length);

  if (!isVisible) return null;

  const current = announcements[index];
  const Icon = iconMap[current.icon] || Megaphone;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 40, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative z-50 overflow-hidden bg-gradient-to-r from-[#94003A] via-[#B5004A] to-[#4F7CFF] text-white border-b border-[#40202C]"
      role="banner"
      aria-label="Announcements"
    >
      <div className="flex h-10 items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#E7B631]" aria-hidden="true" />
            <span className="hidden rounded-full bg-[rgba(231,182,49,0.2)] border border-[rgba(231,182,49,0.3)] text-[#E7B631] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider sm:inline">
              {current.tag}
            </span>
          </div>
          <p className="text-sm font-medium truncate max-w-[600px] text-white">
            {current.text}{' '}
            <Link
              href={current.href}
              className="font-semibold text-[#E7B631] underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E7B631] rounded"
            >
              Explore <ArrowRight className="inline h-3 w-3 ml-0.5 text-[#E7B631]" aria-hidden="true" />
            </Link>
          </p>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1 mr-2">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground',
                  i === index ? 'w-4 bg-white' : 'w-1 bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Show announcement ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={dismiss}
            className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
