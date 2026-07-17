import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Data Engineering',
  description: 'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
  alternates: {
    canonical: '/solutions/data-engineering',
  },
  openGraph: {
    title: 'Data Engineering — Sathus Technology',
    description: 'Governed lakehouses and streaming pipelines for enterprise data platforms.',
    url: `${SITE_URL}/solutions/data-engineering`,
  },
};

export default function DataEngineeringPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Data Engineering</h1>
      <p className="mt-4 text-muted-foreground">
        Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}