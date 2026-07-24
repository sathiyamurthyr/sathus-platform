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
        "group relative w-full text-left bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm transition-all duration-200 hover:-translate-y-[6px] hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] cursor-pointer",
        "h-[440px] grid grid-cols-1 grid-rows-[64px_120px_1px_120px_1px_48px]"
      )}
    >
      {/* CardHeader (Row 1 - 64px) */}
      <div className="h-16 flex items-center justify-between gap-2 w-full m-0 p-0">
        <div className="flex items-center gap-3 min-w-0 m-0 p-0">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold leading-snug line-clamp-2 text-foreground tracking-tight m-0 p-0">
            {title}
          </h3>
        </div>
        <span className="font-display text-xl font-bold text-muted-foreground/30 select-none shrink-0">
          {number}
        </span>
      </div>

      {/* ProblemSection (Row 2 - 120px) */}
      <div className="h-[120px] overflow-hidden flex flex-col justify-start items-start m-0 p-0 pt-2">
        <h4 className="font-bold text-xs text-[#0066cc] uppercase tracking-wider m-0 p-0">The problem.</h4>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-1 m-0 p-0">
          {problem}
        </p>
      </div>

      {/* Divider (Row 3 - 1px) */}
      <div className="h-px bg-[#E5E7EB] w-full m-0 p-0" />

      {/* OutcomeSection (Row 4 - 120px) */}
      <div className="h-[120px] overflow-hidden flex flex-col justify-start items-start m-0 p-0 pt-2">
        <h4 className="font-bold text-xs text-[#0066cc] uppercase tracking-wider m-0 p-0">The outcome.</h4>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-1 m-0 p-0">
          {outcome}
        </p>
      </div>

      {/* Divider (Row 5 - 1px) */}
      <div className="h-px bg-[#E5E7EB]/70 w-full m-0 p-0" />

      {/* CardFooter (Row 6 - 48px) */}
      <div className="h-12 flex items-center justify-start m-0 p-0">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded whitespace-nowrap"
          aria-label={`Learn more about ${title}`}
        >
          Learn more
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </Link>
      </div>
    </Reveal>
  );
}
