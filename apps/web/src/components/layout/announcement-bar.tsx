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
      className="relative z-50 overflow-hidden bg-[#FAF8F9] text-[#292329] border-b border-[#EDE1E6]"
      role="banner"
      aria-label="Announcements"
    >
      <div className="flex h-10 items-center justify-center px-3 pr-9 sm:px-4 sm:pr-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#FF9933]" aria-hidden="true" />
            <span className="hidden rounded-full bg-[#F9EEF2] border border-[#EDE1E6] text-[#A20A3A] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider sm:inline">
              {current.tag}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium truncate max-w-[250px] xs:max-w-[340px] sm:max-w-[600px] text-[#292329]">
            {current.text}{' '}
            <Link
              href={current.href}
              className="font-semibold text-[#A20A3A] underline underline-offset-4 hover:text-[#8C0832] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A] rounded"
            >
              Explore <ArrowRight className="inline h-3 w-3 ml-0.5 text-[#A20A3A]" aria-hidden="true" />
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
                  'h-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A]',
                  i === index ? 'w-4 bg-[#A20A3A]' : 'w-1 bg-[#635861]/40 hover:bg-[#635861]/60'
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
            className="h-6 w-6 text-[#635861] hover:text-[#292329] hover:bg-[#EDE1E6]/50"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
