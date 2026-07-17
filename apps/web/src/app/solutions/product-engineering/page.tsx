import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Product Engineering',
  description: 'Embedded product squads that take concepts from discovery to GA with a real delivery cadence.',
  alternates: {
    canonical: '/solutions/product-engineering',
  },
  openGraph: {
    title: 'Product Engineering — Sathus Technology',
    description: 'Full-stack product engineering with discovery-to-GA delivery squads.',
    url: `${SITE_URL}/solutions/product-engineering`,
  },
};

export default function ProductEngineeringPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Product Engineering</h1>
      <p className="mt-4 text-muted-foreground">
        Embedded product squads that take concepts from discovery to GA with a real delivery cadence.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}