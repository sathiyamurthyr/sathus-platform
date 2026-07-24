import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProductHero } from '../../types';

interface ProductHeroProps {
  hero: ProductHero;
}

export function ProductHero({ hero }: ProductHeroProps) {
  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            {hero.badge && (
              <Badge variant="secondary">{hero.badge}</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {hero.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {hero.description}
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href={hero.primaryCta.href}>{hero.primaryCta.text}</Link>
            </Button>
            {hero.secondaryCta && (
              <Button variant="outline" asChild>
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}