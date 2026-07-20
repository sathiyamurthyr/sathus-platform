import SolutionPage, { generateMetadata as getMeta } from '../[slug]/page';

export async function generateMetadata() {
  return getMeta({ params: Promise.resolve({ slug: 'cloud-modernization' }) });
}

export default async function CloudModernizationPage() {
  return SolutionPage({ params: Promise.resolve({ slug: 'cloud-modernization' }) });
}