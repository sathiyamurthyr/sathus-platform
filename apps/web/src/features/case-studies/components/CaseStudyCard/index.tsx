import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Reveal className="group">
      <Link href={`/case-studies/${caseStudy.slug}`} className="block">
        <article className="rounded-2xl border border-border bg-background p-6 transition-colors duration-300 hover:bg-muted/40">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {caseStudy.industry}
            </span>
            <span className="text-xs text-muted-foreground">{caseStudy.timeline.duration}</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">{caseStudy.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{caseStudy.challenge}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {caseStudy.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech.id}
                className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                {tech.name}
              </span>
            ))}
            {caseStudy.technologies.length > 3 && (
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                +{caseStudy.technologies.length - 3} more
              </span>
            )}
          </div>
        </article>
      </Link>
    </Reveal>
  );
}