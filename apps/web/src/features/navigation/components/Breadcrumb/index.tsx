import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '../../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-muted-foreground hover:text-primary">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}