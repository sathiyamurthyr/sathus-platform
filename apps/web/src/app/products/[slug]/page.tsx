import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/features/products/data';
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
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SoftwareApplicationJsonLd, FAQPageJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/constants';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const canonicalUrl = `/products/${product.slug}`;

  return {
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      product.tagline,
      'enterprise software',
      'Sathus Technology',
      ...product.features.map((f) => f.title),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} — Sathus Technology`,
      description: product.description,
      url: `${siteConfig.url}${canonicalUrl}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Sathus Technology`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <SoftwareApplicationJsonLd product={product} />
      {product.faq && product.faq.length > 0 && (
        <FAQPageJsonLd faqs={product.faq.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />
      </div>
      <ProductHero hero={product.hero} />
      <ProductOverview overview={product.overview} />
      <KeyFeatures features={product.features} />
      <Benefits benefits={product.benefits} />
      {product.pricingPreview && <PricingPreview pricing={product.pricingPreview} />}
      {product.useCases && <UseCases useCases={product.useCases} />}
      {product.security && <Security security={product.security} />}
      {product.technology && <Technology technology={product.technology} />}
      {product.roadmap && <Roadmap roadmap={product.roadmap} />}
      {product.faq && <Faq faq={product.faq} />}
      <Cta />
    </>
  );
}