import { BookOpen } from 'lucide-react';

export function ResourcesHero() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Resources
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of guides, tutorials, and insights.
          </p>
        </div>
      </div>
    </div>
  );
}