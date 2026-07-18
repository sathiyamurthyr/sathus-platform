import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <span className="font-medium uppercase">{resource.category}</span>
        {resource.difficulty && (
          <>
            <span>•</span>
            <span>{resource.difficulty}</span>
          </>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">
        <Link href={`/resources/${resource.category}/${resource.slug}`} className="hover:text-primary">
          {resource.title}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground mb-4">{resource.excerpt || resource.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(resource.publishedAt).toLocaleDateString()}</span>
          </div>
          {resource.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{resource.readingTime} min read</span>
            </div>
          )}
        </div>
        <span>{resource.author.name}</span>
      </div>
    </article>
  );
}