import type { NavigationItem, FooterSection } from '../types';

export const mainNavigation: NavigationItem[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    href: '/solutions',
    description: 'Enterprise solutions for your business',
    children: [
      { id: 'ai-engineering', label: 'AI Engineering', href: '/solutions/ai-engineering' },
      { id: 'data-engineering', label: 'Data Engineering', href: '/solutions/data-engineering' },
      { id: 'enterprise-applications', label: 'Enterprise Applications', href: '/solutions/enterprise-applications' },
      { id: 'cloud-modernization', label: 'Cloud Modernization', href: '/solutions/cloud-modernization' },
      { id: 'product-engineering', label: 'Product Engineering', href: '/solutions/product-engineering' },
      { id: 'digital-transformation', label: 'Digital Transformation', href: '/solutions/digital-transformation' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    description: 'Software products for enterprise',
    children: [
      { id: 'memomes-cloud', label: 'Memomes Cloud', href: '/products/memomes-cloud' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    description: 'Guides, tutorials, and insights',
    children: [
      { id: 'blog', label: 'Blog', href: '/resources/blog' },
      { id: 'docs', label: 'Documentation', href: '/resources/docs' },
      { id: 'learning', label: 'Learning Center', href: '/resources/learning' },
      { id: 'whitepapers', label: 'Whitepapers', href: '/resources/whitepapers' },
    ],
  },
  {
    id: 'engineering-hub',
    label: 'Engineering Hub',
    href: '/engineering-hub',
    description: 'Architecture blueprints, lakehouse standards, and benchmarks',
    children: [
      { id: 'hub-data-engineering', label: 'Data Engineering & Lakehouses', href: '/engineering-hub/data-engineering' },
      { id: 'hub-big-data', label: 'Big Data & Spark Systems', href: '/engineering-hub/big-data' },
      { id: 'hub-data-analytics', label: 'Data Analytics & Warehouses', href: '/engineering-hub/data-analytics' },
      { id: 'hub-cloud-data', label: 'Cloud Data Engineering', href: '/engineering-hub/cloud-data-engineering' },
      { id: 'hub-healthcare', label: 'Healthcare & FHIR Platforms', href: '/engineering-hub/healthcare-life-sciences' },
      { id: 'hub-doc-ai', label: 'Document Intelligence & AI', href: '/engineering-hub/document-intelligence' },
      { id: 'hub-ontology', label: 'Ontologies & Knowledge Graphs', href: '/engineering-hub/ontology-knowledge-graph' },
      { id: 'hub-tools', label: 'Interactive Engineering Tools', href: '/engineering-hub/tools' },
    ],
  },
  {
    id: 'trust',
    label: 'Trust',
    href: '/trust',
    description: 'Security and compliance',
    children: [
      { id: 'security', label: 'Security', href: '/trust/security' },
      { id: 'privacy', label: 'Privacy', href: '/trust/privacy' },
      { id: 'compliance', label: 'Compliance', href: '/trust/compliance' },
      { id: 'responsible-ai', label: 'Responsible AI', href: '/trust/responsible-ai' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch',
  },
];

export const footerNavigation: FooterSection[] = [
  {
    id: 'product',
    label: 'Product',
    links: [
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'solutions', label: 'Solutions', href: '/solutions' },
    ],
  },
  {
    id: 'engineering-hub',
    label: 'Engineering Hub',
    links: [
      { id: 'hub-main', label: 'Architecture Library', href: '/engineering-hub' },
      { id: 'hub-de', label: 'Data Engineering', href: '/engineering-hub/data-engineering' },
      { id: 'hub-health', label: 'Healthcare & Life Sciences', href: '/engineering-hub/healthcare-life-sciences' },
      { id: 'hub-doc', label: 'Document Intelligence', href: '/engineering-hub/document-intelligence' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    links: [
      { id: 'blog', label: 'Blog', href: '/resources/blog' },
      { id: 'docs', label: 'Documentation', href: '/resources/docs' },
      { id: 'learning', label: 'Learning', href: '/resources/learning' },
    ],
  },
  {
    id: 'trust',
    label: 'Trust',
    links: [
      { id: 'security', label: 'Security', href: '/trust/security' },
      { id: 'privacy', label: 'Privacy', href: '/trust/privacy' },
      { id: 'compliance', label: 'Compliance', href: '/trust/compliance' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    links: [
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
];