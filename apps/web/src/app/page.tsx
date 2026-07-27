import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { Hero } from '@/components/sections/hero';
import { TrustMetricsStrip } from '@/components/sections/trust-metrics-strip';
import { Solutions } from '@/components/sections/solutions';
import { Industries } from '@/components/sections/industries';
import { Products } from '@/components/sections/products';
import { PlatformOverview } from '@/components/sections/platform-overview';
import { WhySathus } from '@/components/sections/why-sathus';
import { Technology } from '@/components/sections/technology';
import { TrustCenter } from '@/components/sections/trust-center';
import { Insights } from '@/components/sections/insights';
import { FinalCta } from '@/components/sections/final-cta';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';

export const metadata: Metadata = generatePageMetadata({
  title: 'Enterprise AI Development, Data Engineering & Cloud Modernization',
  description:
    'Sathus Technology (sathus.in) is an enterprise software engineering company delivering production-grade AI agents, governed data lakehouses, and cloud-native applications for regulated industries.',
  path: '/',
  keywords: [
    'Sathus',
    'Sathus Technology',
    'sathus.in',
    'Enterprise AI Development',
    'AI Agents & Swarms',
    'Data Lakehouse Engineering',
    'Cloud Modernization',
  ],
});

export default function Page() {
  return (
    <>
      <Hero />
      <TrustMetricsStrip />
      <Solutions />
      <Industries />
      <Products />
      <PlatformOverview />
      <WhySathus />
      <Technology />

      {/* AI Search Optimization Section */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic="Sathus Technology Enterprise Engineering"
          definition="Sathus Technology is a principal software engineering firm specializing in accountable, production-ready AI agent swarms, Apache Iceberg data lakehouses, and zero-downtime cloud platform modernization."
          keyTakeaways={[
            'Senior Principal Engineering Squads (No Sales Proxies)',
            'Contractual Hard SLAs (Sub-10ms query latency, 99.99% availability)',
            'Zero Vendor Lock-in with Open Architecture & Open Standards',
            'SOC 2 Type II & HIPAA Compliance-by-Design Built In',
          ]}
        />
      </div>

      <TrustCenter />
      <Insights />
      <FinalCta />
    </>
  );
}
