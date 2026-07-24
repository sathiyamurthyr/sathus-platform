import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { cn } from '@/lib/utils';

interface EnterpriseCardProps {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  problem: string;
  outcome: string;
  href: string;
  delay?: number;
}

export function EnterpriseCard({
  icon: Icon,
  number,
  title,
  problem,
  outcome,
  href,
  delay = 0,
}: EnterpriseCardProps) {
  return (
    <Reveal
      delay={delay}
      y={0}
      className={cn(
        "group relative w-full text-left bg-[#1A1418] border border-[rgba(231,182,49,0.18)] rounded-[20px] p-6 shadow-sm transition-all duration-200 hover:-translate-y-[6px] hover:border-[#E7B631] hover:shadow-[0_0_30px_rgba(231,182,49,0.08)] cursor-pointer",
        "h-[440px] grid grid-cols-1 grid-rows-[64px_120px_1px_120px_1px_48px]"
      )}
    >
      {/* CardHeader (Row 1 - 64px) */}
      <div className="h-16 flex items-center justify-between gap-2 w-full m-0 p-0">
        <div className="flex items-center gap-3 min-w-0 m-0 p-0">
          <div className="h-12 w-12 rounded-xl bg-[#2A1620] border border-[rgba(237,193,30,0.35)] text-[#EDC11E] transition-all duration-200 group-hover:bg-[#E7B631] group-hover:text-[#94003A] group-hover:shadow-[0_0_20px_rgba(231,182,49,0.3)] shrink-0 flex items-center justify-center">
            <Icon className="h-6 w-6 text-[#EDC11E] group-hover:text-[#94003A] transition-colors" />
          </div>
          <h3 className="text-xl font-bold leading-snug line-clamp-2 text-[#FFFFFF] tracking-tight m-0 p-0">
            {title}
          </h3>
        </div>
        <span className="font-display text-xl font-bold text-[#E7B631] opacity-55 select-none shrink-0">
          {number}
        </span>
      </div>

      {/* ProblemSection (Row 2 - 120px) */}
      <div className="h-[120px] overflow-hidden flex flex-col justify-start items-start m-0 p-0 pt-2">
        <h4 className="font-bold text-xs text-[#EDC11E] uppercase tracking-[0.08em] m-0 p-0">The problem.</h4>
        <p className="text-sm text-[rgba(255,255,255,0.88)] line-clamp-3 leading-relaxed mt-1 m-0 p-0">
          {problem}
        </p>
      </div>

      {/* Divider (Row 3 - 1px) */}
      <div className="h-px bg-[rgba(231,182,49,0.18)] w-full m-0 p-0" />

      {/* OutcomeSection (Row 4 - 120px) */}
      <div className="h-[120px] overflow-hidden flex flex-col justify-start items-start m-0 p-0 pt-2">
        <h4 className="font-bold text-xs text-[#EDC11E] uppercase tracking-[0.08em] m-0 p-0">The outcome.</h4>
        <p className="text-sm text-[rgba(255,255,255,0.88)] line-clamp-3 leading-relaxed mt-1 m-0 p-0">
          {outcome}
        </p>
      </div>

      {/* Divider (Row 5 - 1px) */}
      <div className="h-px bg-[rgba(231,182,49,0.18)] w-full m-0 p-0" />

      {/* CardFooter (Row 6 - 48px) */}
      <div className="h-12 flex items-center justify-start m-0 p-0">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#E7B631] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7B631] focus-visible:ring-offset-2 rounded whitespace-nowrap"
          aria-label={`Learn more about ${title}`}
        >
          Learn more
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 text-[#E7B631]" />
        </Link>
      </div>
    </Reveal>
  );
}
