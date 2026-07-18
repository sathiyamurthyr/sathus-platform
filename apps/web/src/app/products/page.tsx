import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { memomesCloud } from '@/features/products/data/memomes-cloud';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Enterprise software products built for regulated industries.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Products — Sathus Technology',
    description: 'Enterprise software products built for regulated industries.',
    url: `${SITE_URL}/products`,
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
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Products"
        title="Enterprise Software"
        description="Built for regulated industries with security, compliance, and scale."
      />

      <div className="mt-16">
        <div className="rounded-lg border border-border p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase text-primary">New</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{memomesCloud.name}</h2>
          <p className="text-muted-foreground mb-4">{memomesCloud.tagline}</p>
          <p className="mb-6">{memomesCloud.description}</p>
          <Link
            href={`/products/${memomesCloud.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Learn more
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}