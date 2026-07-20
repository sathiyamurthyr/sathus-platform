import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FAQPageJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs)',
  description: 'Common questions about Sathus Technology AI engineering, data lakehouses, cloud modernization, and security.',
  alternates: {
    canonical: '/resources/faqs',
  },
  openGraph: {
    title: 'Frequently Asked Questions — Sathus Technology',
    description: 'Common questions about Sathus Technology AI engineering, data lakehouses, cloud modernization, and security.',
    url: `${siteConfig.url}/resources/faqs`,
  },
};

const faqCategories = [
  {
    category: 'AI Platform & Agentic Engineering',
    faqs: [
      {
        question: 'Does Sathus AI retain or train on enterprise client data?',
        answer: 'No. Sathus AI operates under strict zero-retention policies. Customer data is processed in-memory, never stored, and never used to train third-party or foundational LLM models.',
      },
      {
        question: 'What is Model Context Protocol (MCP)?',
        answer: 'Model Context Protocol (MCP) is an open standard created by Anthropic that standardizes how AI agents communicate with external APIs, tools, and databases with secure authorization.',
      },
      {
        question: 'How do evaluation harnesses prevent AI hallucinations in production?',
        answer: 'Our evaluation harnesses continuously benchmark LLM outputs against curated ground-truth datasets, measuring factual accuracy, Toxicity, PII leakage, and rule adherence before responses reach end users.',
      },
    ],
  },
  {
    category: 'Data Platform & Lakehouse Engineering',
    faqs: [
      {
        question: 'What is an Apache Iceberg lakehouse?',
        answer: 'An Apache Iceberg lakehouse is an open table format that brings SQL ACID transactions, time travel, schema evolution, and high performance to cloud object storage (S3/Azure Data Lake), eliminating proprietary warehouse lock-in.',
      },
      {
        question: 'How do you guarantee zero downtime during legacy warehouse migration?',
        answer: 'We deploy dual-execution streaming pipelines running parallel row-level checksum comparisons for 30+ days before cutting over traffic from legacy systems.',
      },
    ],
  },
  {
    category: 'Security, Compliance & Engagement',
    faqs: [
      {
        question: 'Are Sathus products SOC 2 Type II and HIPAA compliant?',
        answer: 'Yes. Sathus Technology maintains a audited SOC 2 Type II control environment and executes Business Associate Agreements (BAAs) with all healthcare clients.',
      },
      {
        question: 'How do embedded engineering squads work?',
        answer: 'Our senior principal engineers, data architects, and product leads integrate directly into your Jira, GitHub, and Slack workflows as a cohesive, high-output delivery squad.',
      },
    ],
  },
];

export default function FaqsPage() {
  const allFaqs = faqCategories.flatMap((cat) => cat.faqs);

  return (
    <>
      <FAQPageJsonLd faqs={allFaqs} />
      <div className="container mx-auto px-4 py-12 space-y-16 max-w-4xl">
        <div>
          <Breadcrumb items={[{ label: 'Resources', href: '/resources' }, { label: 'FAQs' }]} />
          <SectionIntro
            eyebrow="Knowledge Base"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our AI platform, data lakehouse architectures, cloud security, and embedded engineering squads."
          />
        </div>

        <div className="space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.category} className="space-y-6">
              <h2 className="text-xl font-bold text-primary border-b border-border pb-2 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-base font-bold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Have a Question Not Listed Here?</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
            Speak directly with our engineering team or schedule a dedicated strategy consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
          >
            Ask Engineering Team
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
