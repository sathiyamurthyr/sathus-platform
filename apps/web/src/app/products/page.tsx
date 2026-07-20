import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { allProducts } from '@/features/products/data';
import { siteConfig } from '@/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Enterprise software products built for regulated industries.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Products — Sathus Technology',
    description: 'Enterprise software products built for regulated industries.',
    url: `${siteConfig.url}/products`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products — Sathus Technology',
    description: 'Enterprise software products built for regulated industries.',
  },
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Products' }]} />
      <SectionIntro
        eyebrow="Products"
        title="Enterprise Software Portfolio"
        description="Built for regulated industries with security, compliance, and enterprise scale."
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {allProducts.map((product) => (
          <div key={product.id} className="rounded-xl border border-border bg-card p-8 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  {product.hero.badge || 'Enterprise'}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">{product.name}</h2>
              <p className="text-sm font-medium text-primary mb-3">{product.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Explore {product.name}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}