import type { Product } from '../types';

export const memomesCloud: Product = {
  id: 'memomes-cloud',
  name: 'Memomes Cloud',
  slug: 'memomes-cloud',
  tagline: 'Secure, encrypted file sharing for the enterprise',
  description: 'Memomes Cloud provides end-to-end encrypted file sharing with zero-knowledge architecture, designed for regulated industries that demand security and compliance.',
  hero: {
    title: 'Memomes Cloud',
    description: 'Secure, encrypted file sharing for the enterprise. Zero-knowledge architecture with password-protected sharing and expiring links.',
    primaryCta: { text: 'Get Started', href: '/contact' },
    secondaryCta: { text: 'View Documentation', href: '/documentation' },
    badge: 'New',
  },
  overview: {
    problem: 'Enterprises struggle with secure file sharing. Traditional solutions store unencrypted data and lack granular access controls, creating compliance risks.',
    solution: 'Memomes Cloud encrypts files client-side with AES-256 before they reach our servers. We never see your encryption keys, ensuring true zero-knowledge security.',
    differentiator: 'Built for regulated industries with audit logs, download controls, and compliance-ready infrastructure.',
  },
  features: [
    {
      id: 'encryption',
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption for all files, encrypted client-side before reaching our servers.',
    },
    {
      id: 'zero-knowledge',
      title: 'Zero Knowledge',
      description: 'We never see your encryption keys. Your data remains private to you and your organization.',
    },
    {
      id: 'password-sharing',
      title: 'Password Protected Sharing',
      description: 'Share files with password protection for an additional layer of security.',
    },
    {
      id: 'expiring-links',
      title: 'Expiring Links',
      description: 'Set expiration dates on shared links to automatically revoke access.',
    },
    {
      id: 'download-controls',
      title: 'Download Controls',
      description: 'Control whether recipients can download files or only view them in-browser.',
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'Comprehensive audit logging for compliance and security monitoring.',
    },
  ],
  benefits: [
    {
      id: 'compliance',
      title: 'Regulatory Compliance',
      description: 'Built for HIPAA, GDPR, and SOC 2 compliance requirements.',
      metric: '100%',
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Zero-knowledge architecture ensures your data remains private.',
      metric: 'AES-256',
    },
    {
      id: 'scalability',
      title: 'Unlimited Storage',
      description: 'Scale to petabytes with our cloud-native architecture.',
      metric: '∞',
    },
  ],
  pricingPreview: {
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        price: '$29',
        description: 'For small teams getting started',
        features: ['100GB storage', '5 users', 'Basic support'],
      },
      {
        id: 'business',
        name: 'Business',
        price: '$99',
        description: 'For growing businesses',
        features: ['1TB storage', '25 users', 'Priority support', 'API access'],
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations',
        features: ['Unlimited storage', 'Custom users', '24/7 support', 'SLA', 'Dedicated infrastructure'],
      },
    ],
    cta: { text: 'View Full Pricing', href: '/pricing' },
  },
  useCases: [
    {
      id: 'healthcare',
      title: 'Medical Records Sharing',
      description: 'Securely share patient records between healthcare providers with full HIPAA compliance.',
      industry: 'Healthcare',
    },
    {
      id: 'finance',
      title: 'Financial Document Exchange',
      description: 'Exchange sensitive financial documents with end-to-end encryption and audit trails.',
      industry: 'Financial Services',
    },
    {
      id: 'legal',
      title: 'Legal Document Management',
      description: 'Share confidential legal documents with password protection and expiration controls.',
      industry: 'Legal',
    },
  ],
  screenshots: [
    {
      id: 'dashboard',
      src: '/screenshots/memomes-dashboard.png',
      alt: 'Memomes Cloud Dashboard',
      caption: 'Intuitive dashboard for file management',
    },
    {
      id: 'sharing',
      src: '/screenshots/memomes-sharing.png',
      alt: 'File Sharing Interface',
      caption: 'Secure sharing with granular controls',
    },
  ],
  architecture: {
    title: 'Architecture',
    description: 'Built on a zero-knowledge architecture with client-side encryption and distributed storage.',
    diagram: '/diagrams/memomes-architecture.png',
  },
  technology: [
    { id: 'dotnet', name: '.NET', category: 'Backend' },
    { id: 'nextjs', name: 'Next.js', category: 'Frontend' },
    { id: 'postgresql', name: 'PostgreSQL', category: 'Database' },
    { id: 'backblaze', name: 'Backblaze B2', category: 'Storage' },
    { id: 'docker', name: 'Docker', category: 'Infrastructure' },
    { id: 'redis', name: 'Redis', category: 'Caching' },
  ],
  security: [
    {
      id: 'aes-256',
      title: 'AES-256 Encryption',
      description: 'All files are encrypted with AES-256 before leaving your device.',
    },
    {
      id: 'zero-knowledge',
      title: 'Zero Knowledge Architecture',
      description: 'We never see your encryption keys or unencrypted data.',
    },
    {
      id: 'password-sharing',
      title: 'Password Protected Sharing',
      description: 'Add password protection to any shared link for additional security.',
    },
    {
      id: 'expiring-links',
      title: 'Expiring Links',
      description: 'Set automatic expiration on shared links to control access duration.',
    },
    {
      id: 'download-controls',
      title: 'Download Controls',
      description: 'Prevent downloads and restrict to in-browser viewing only.',
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'Comprehensive logging of all file access and sharing activities.',
    },
  ],
  roadmap: [
    {
      id: 'q3-2024',
      quarter: 'Q3 2024',
      title: 'Advanced Collaboration',
      description: 'Real-time collaboration features and comments',
      status: 'completed',
    },
    {
      id: 'q4-2024',
      quarter: 'Q4 2024',
      title: 'Mobile Apps',
      description: 'Native iOS and Android applications',
      status: 'in-progress',
    },
    {
      id: 'q1-2025',
      quarter: 'Q1 2025',
      title: 'AI-Powered Search',
      description: 'Semantic search across all your files',
      status: 'planned',
    },
  ],
  deploymentModels: [
    'SaaS Multi-Tenant Cloud (US/EU Regions)',
    'Dedicated Enterprise Storage Node',
    'Self-Hosted Hybrid Storage Adapter',
  ],
  scalabilityMetrics: [
    { value: '10 Enterprise PB+', label: 'Storage Bandwidth Core', description: 'Zero-degradation object throughput.' },
    { value: '256-bit', label: 'Client-Side Key Encryption', description: 'End-to-end zero knowledge cryptographic vault.' },
    { value: '99.999%', label: 'Data Durability Guarantee', description: 'Multi-region erasure coding redundancy.' },
  ],
  integrations: [
    { name: 'Backblaze B2 / AWS S3 API', category: 'Object Storage', description: 'S3-compatible bucket backends' },
    { name: 'Azure Active Directory / Okta', category: 'Identity (SSO)', description: 'SAML 2.0 / OIDC enterprise identity syncing' },
    { name: 'SIEM Log Streamers (Splunk / Datadog)', category: 'Security Observability', description: 'Real-time audit log forwarding' },
  ],
  relatedSolutions: [
    { title: 'Cloud Engineering & Security', href: '/solutions/cloud-engineering' },
    { title: 'Enterprise Integration & APIs', href: '/solutions/enterprise-integration' },
    { title: 'Data Platform Modernization', href: '/solutions/data-platform-modernization' },
  ],
  faq: [
    {
      id: 'encryption',
      question: 'How is my data encrypted?',
      answer: 'All files are encrypted with AES-256 before leaving your device. Your encryption keys are never transmitted to our servers.',
    },
    {
      id: 'compliance',
      question: 'Is Memomes Cloud compliant?',
      answer: 'Yes, we are built for HIPAA, GDPR, and SOC 2 compliance readiness with audit logs and data residency controls.',
    },
    {
      id: 'storage',
      question: 'Where is my data stored?',
      answer: 'Files are stored in Backblaze B2 and S3-compatible backends with multiple geographic regions available for data residency requirements.',
    },
  ],
};