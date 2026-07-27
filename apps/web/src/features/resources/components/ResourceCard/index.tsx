import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
            {resource.category}
          </span>
          {resource.difficulty && (
            <>
              <span>•</span>
              <span className="capitalize">{resource.difficulty}</span>
            </>
          )}
        </div>
        <h3 className="font-bold text-base mb-2 leading-snug">
          <Link href={`/resources/blog/${resource.slug}`} className="hover:text-primary transition-colors">
            {resource.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-3">{resource.excerpt || resource.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{resource.publishedAt}</span>
          </div>
          {resource.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{resource.readingTime} min</span>
            </div>
          )}
        </div>
        <Link
          href={`/resources/blog/${resource.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          Read
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}