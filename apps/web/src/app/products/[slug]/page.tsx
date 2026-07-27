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
import { ProductArchitectureDetails } from '@/features/products/components/ProductArchitectureDetails';
import { Roadmap } from '@/features/products/components/Roadmap';
import { Faq } from '@/features/products/components/Faq';
import { Cta } from '@/features/products/components/Cta';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return generatePageMetadata({
    title: `${product.name} — ${product.tagline}`,
    description: product.description,
    path: `/products/${product.slug}`,
    keywords: [
      product.name,
      product.tagline,
      'enterprise software application',
      'Sathus Technology',
      ...product.features.map((f) => f.title),
    ],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${product.slug}` },
  ];

  return (
    <>
      <SoftwareApplicationJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
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

      {/* AI Search Optimization Engine Block */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic={`${product.name} Enterprise Platform`}
          definition={product.description}
          keyTakeaways={product.features ? product.features.map((f) => `${f.title}: ${f.description}`) : []}
          faqs={product.faq ? product.faq.slice(0, 5).map((f) => ({ question: f.question, answer: f.answer })) : []}
        />
      </div>

      <KeyFeatures features={product.features} />
      <Benefits benefits={product.benefits} />
      {product.pricingPreview && <PricingPreview pricing={product.pricingPreview} />}
      {product.useCases && <UseCases useCases={product.useCases} />}
      {product.security && <Security security={product.security} />}
      {product.technology && <Technology technology={product.technology} />}
      <ProductArchitectureDetails product={product} />
      {product.roadmap && <Roadmap roadmap={product.roadmap} />}
      {product.faq && <Faq faq={product.faq} />}
      <Cta />
    </>
  );
}