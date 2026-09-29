import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd, TechArticleJsonLd } from '@/components/seo/json-ld';
import { DocumentAiCostEstimator } from '@/features/engineering-hub/components';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Document AI & Vision LLM Extraction TCO Cost Estimator — Sathus',
  description:
    'Free enterprise document extraction cost estimator. Calculate monthly API spend and compare monolithic Vision LLMs against Sathus 3-tier cascading extraction architecture.',
  path: '/engineering-hub/tools/document-ai-cost-estimator',
  keywords: [
    'document extraction cost estimator',
    'vision llm ocr cost calculator',
    'gpt-4o document processing pricing',
    'layoutlm vs vision llm tco',
    'intelligent document processing cost reduction',
  ],
});

export default function DocumentAiCostEstimatorPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
    { name: 'Interactive Tools', url: '/engineering-hub/tools' },
    { name: 'Document AI Cost Estimator', url: '/engineering-hub/tools/document-ai-cost-estimator' },
  ];

  return (
    <>
      <TechArticleJsonLd
        headline="Document AI & Vision LLM Extraction TCO Cost Estimator"
        description="Interactive financial modeling tool comparing monolithic multimodal LLM extraction against intelligent cascading router architectures."
        url="/engineering-hub/tools/document-ai-cost-estimator"
        datePublished="2026-09-29"
        authorName="Sathish Kumar"
        proficiencyLevel="Expert"
        dependencies="PyMuPDF, LayoutLMv3, Multimodal Vision LLMs"
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="container mx-auto px-4 py-8 space-y-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Engineering Hub', href: '/engineering-hub' },
              { label: 'Interactive Tools', href: '/engineering-hub/tools' },
              { label: 'Document AI Cost Estimator' },
            ]}
          />
          <Link
            href="/engineering-hub/document-intelligence/ocr-vs-native-pdf-vs-vision-llms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Read Full Benchmark: OCR vs Native PDF vs Vision LLMs
          </Link>
        </div>

        <DocumentAiCostEstimator />

        {/* Methodology & Unit Pricing Standards */}
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Reproducible Pricing Methodology &amp; Benchmarks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">Tier 1: Born-Digital ($0.01 / 1K)</h3>
              <p>
                Native text streams extracted via PyMuPDF in under 10ms per page with zero GPU overhead. Bypasses OCR entirely for digital documents.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">Tier 2: LayoutLMv3 ($1.50 / 1K)</h3>
              <p>
                Self-hosted ONNX/TensorRT inference on standard cloud GPUs. Achieves 97.4% F1 extraction score on structured clinical and billing forms in ~280ms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">Tier 3: Vision LLM ($25.00 / 1K)</h3>
              <p>
                Proprietary multimodal Vision LLMs (e.g. GPT-4o, Claude 3.5 Sonnet) reserved strictly for degraded scans, unconstrained handwriting, and complex borderless financial tables.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
