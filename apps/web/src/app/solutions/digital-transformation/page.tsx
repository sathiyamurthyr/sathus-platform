import SolutionPage, { generateMetadata as getMeta } from '../[slug]/page';

export async function generateMetadata() {
  return getMeta({ params: Promise.resolve({ slug: 'digital-transformation' }) });
}

export default async function DigitalTransformationPage() {
  return SolutionPage({ params: Promise.resolve({ slug: 'digital-transformation' }) });
}