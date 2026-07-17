import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'AI Engineering',
  description: 'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls.',
  alternates: {
    canonical: '/solutions/ai-engineering',
  },
  openGraph: {
    title: 'AI Engineering — Sathus Technology',
    description: 'Production-grade agentic systems with evaluation harnesses and enterprise-grade governance.',
    url: `${SITE_URL}/solutions/ai-engineering`,
  },
};

export default function AIEngineeringPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">AI Engineering</h1>
      <p className="mt-4 text-muted-foreground">
        Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}