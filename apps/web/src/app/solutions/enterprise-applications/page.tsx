import SolutionPage, { generateMetadata as getMeta } from '../[slug]/page';

export async function generateMetadata() {
  return getMeta({ params: Promise.resolve({ slug: 'enterprise-applications' }) });
}

export default async function EnterpriseApplicationsPage() {
  return SolutionPage({ params: Promise.resolve({ slug: 'enterprise-applications' }) });
}