import SolutionPage, { generateMetadata as getMeta } from '../[slug]/page';

export async function generateMetadata() {
  return getMeta({ params: Promise.resolve({ slug: 'product-engineering' }) });
}

export default async function ProductEngineeringPage() {
  return SolutionPage({ params: Promise.resolve({ slug: 'product-engineering' }) });
}