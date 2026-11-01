import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { Hero } from '@/components/sections/hero';
import { CinematicUniverse } from '@/components/cinematic/cinematic-universe';
import { CinematicProducts } from '@/components/cinematic/cinematic-products';
import { CinematicIndustries } from '@/components/cinematic/cinematic-industries';
import { CinematicPositioning } from '@/components/cinematic/cinematic-positioning';
import { Insights } from '@/components/sections/insights';
import { CinematicConversion } from '@/components/cinematic/cinematic-conversion';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';

export const metadata: Metadata = generatePageMetadata({
  title: 'Enterprise AI, Data & Cloud Engineering',
  description:
    'Sathus Technology builds enterprise AI solutions, governed data platforms, cloud-native applications and intelligent software products for businesses operating in complex and regulated industries.',
  path: '/',
  keywords: [
    'Sathus',
    'Sathus Technology',
    'sathus.in',
    'Enterprise Software Development Company',
    'AI Engineering Company',
    'Enterprise AI Development',
    'AI Agents & Swarms',
    'Data Lakehouse Engineering',
    'Cloud Modernization',
    'OneHealthID',
    'Vmaila',
    'Memomes Cloud',
    'Svora',
  ],
});

export default function Page() {
  return (
    <>
      {/* 01: Cinematic Hero — Futuristic Sky Citadel & Executive Terrace */}
      <Hero />

      {/* 02-05: Engineering Worlds — AI Lab, Data Canyon, Cloud Hub & Enterprise Campus */}
      <CinematicUniverse />

      {/* 06: Our Products — Enterprise Products for a Connected World */}
      <CinematicProducts />

      {/* 07: Industries — Creating Impact Across Industries */}
      <CinematicIndustries />

      {/* 08: Methodology — The Sathus Engineering Approach (5-Step Framework) */}
      <CinematicPositioning />

      {/* 09: Insights — Ideas, Engineering & Innovation */}
      <Insights />

      {/* Semantic AI Summary for Discovery */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic="Sathus Technology Enterprise Engineering"
          definition="Sathus Technology is a principal software engineering firm specializing in accountable, production-ready AI agent swarms, Apache Iceberg data lakehouses, and zero-downtime cloud platform modernization."
          keyTakeaways={[
            'Senior Principal Engineering Squads (No Sales Proxies)',
            'Contractual Delivery SLAs (99.95% availability target & resilient query architecture)',
            'Zero Vendor Lock-in with Open Source Formats & Open Standards',
            'Zero-Trust Architecture & Data Sovereignty by Design',
          ]}
        />
      </div>

      {/* 10: Conversion CTA — Let's Build What's Next Together */}
      <CinematicConversion />
    </>
  );
}
