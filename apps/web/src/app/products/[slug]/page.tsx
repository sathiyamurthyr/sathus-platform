import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { memomesCloud } from '@/features/products/data/memomes-cloud';
import { ProductHero } from '@/features/products/components/ProductHero';
import { ProductOverview } from '@/features/products/components/ProductOverview';
import { KeyFeatures } from '@/features/products/components/KeyFeatures';
import { Benefits } from '@/features/products/components/Benefits';
import { PricingPreview } from '@/features/products/components/PricingPreview';
import { UseCases } from '@/features/products/components/UseCases';
import { Security } from '@/features/products/components/Security';
import { Technology } from '@/features/products/components/Technology';
import { Roadmap } from '@/features/products/components/Roadmap';
import { Faq } from '@/features/products/components/Faq';
import { Cta } from '@/features/products/components/Cta';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Memomes Cloud',
  description: 'Secure, encrypted file sharing for the enterprise with zero-knowledge architecture.',
  alternates: {
    canonical: '/products/memomes-cloud',
  },
  openGraph: {
    title: 'Memomes Cloud — Sathus Technology',
    description: 'Secure, encrypted file sharing for the enterprise.',
    url: `${SITE_URL}/products/memomes-cloud`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memomes Cloud — Sathus Technology',
    description: 'Secure, encrypted file sharing for the enterprise.',
  },
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Product registry - future products will be added here
  const products: Record<string, typeof memomesCloud> = {
    'memomes-cloud': memomesCloud,
  };

  const product = products[slug];

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductHero hero={product.hero} />
      <ProductOverview overview={product.overview} />
      <KeyFeatures features={product.features} />
      <Benefits benefits={product.benefits} />
      {product.pricingPreview && <PricingPreview pricing={product.pricingPreview} />}
      <UseCases useCases={product.useCases} />
      <Security security={product.security} />
      <Technology technology={product.technology} />
      <Roadmap roadmap={product.roadmap} />
      <Faq faq={product.faq} />
      <Cta />
    </>
  );
}