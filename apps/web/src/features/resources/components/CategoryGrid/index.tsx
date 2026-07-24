import Link from 'next/link';
import { Book, FileText, GraduationCap, File, BookOpen, Zap, Code } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

const ICONS: Record<string, React.ReactNode> = {
  blog: <Book className="h-5 w-5" />,
  docs: <FileText className="h-5 w-5" />,
  learning: <GraduationCap className="h-5 w-5" />,
  whitepapers: <File className="h-5 w-5" />,
  tutorials: <BookOpen className="h-5 w-5" />,
  releases: <Zap className="h-5 w-5" />,
  engineering: <Code className="h-5 w-5" />,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/resources/${category.slug}`}
              className="rounded-lg border border-border p-6 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {ICONS[category.id] || <Book className="h-5 w-5" />}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}