import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import type { FeaturedContent } from '../../types';

interface FeaturedContentProps {
  featured: FeaturedContent[];
}

export function FeaturedContent({ featured }: FeaturedContentProps) {
  const heroFeatured = featured.find(f => f.variant === 'hero');
  const cardFeatured = featured.filter(f => f.variant === 'card');

  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Featured Resources</h2>

        {heroFeatured && (
          <div className="rounded-lg border border-border bg-background p-8 mb-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="font-medium uppercase">{heroFeatured.resource.category}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">
              <Link href={`/resources/${heroFeatured.resource.category}/${heroFeatured.resource.slug}`} className="hover:text-primary">
                {heroFeatured.resource.title}
              </Link>
            </h3>
            <p className="text-muted-foreground mb-4">{heroFeatured.resource.excerpt || heroFeatured.resource.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(heroFeatured.resource.publishedAt).toLocaleDateString()}</span>
              </div>
              {heroFeatured.resource.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{heroFeatured.resource.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>
        )}

        {cardFeatured.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cardFeatured.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-background p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="font-medium uppercase">{item.resource.category}</span>
                </div>
                <h4 className="font-semibold mb-2">
                  <Link href={`/resources/${item.resource.category}/${item.resource.slug}`} className="hover:text-primary">
                    {item.resource.title}
                  </Link>
                </h4>
                <p className="text-sm text-muted-foreground">{item.resource.excerpt || item.resource.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}