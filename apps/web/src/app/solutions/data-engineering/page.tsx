import SolutionPage, { generateMetadata as getMeta } from '../[slug]/page';

export async function generateMetadata() {
  return getMeta({ params: Promise.resolve({ slug: 'data-engineering' }) });
}

export default async function DataEngineeringPage() {
  return SolutionPage({ params: Promise.resolve({ slug: 'data-engineering' }) });
}