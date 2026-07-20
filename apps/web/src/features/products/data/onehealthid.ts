import type { Product } from '../types';

export const oneHealthId: Product = {
  id: 'onehealthid',
  name: 'OneHealthID',
  slug: 'onehealthid',
  tagline: 'Healthcare Identity, Consent Management & FHIR Data Exchange',
  description: 'OneHealthID provides unified patient identity resolution, granular consent management, and interoperable FHIR R4 integration for healthcare systems and life sciences.',
  hero: {
    title: 'OneHealthID Platform',
    description: 'HIPAA-ready patient identity resolution, consent tokenization, and seamless FHIR R4 interoperability for modern healthcare ecosystems.',
    primaryCta: { text: 'Book Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Products', href: '/products' },
    badge: 'Healthcare Suite',
  },
  overview: {
    problem: 'Healthcare organizations face fragmented patient identities across EHRs, strict HIPAA consent requirements, and complex interoperability mandates.',
    solution: 'OneHealthID provides probabilistic patient matching, smart contract-backed consent state tracking, and native HL7 FHIR API translation.',
    differentiator: 'Built for compliance officers and health system CIOs demanding zero-trust identity management and auditability.',
  },
  features: [
    {
      id: 'patient-matching',
      title: 'Probabilistic Master Patient Index (MPI)',
      description: 'High-precision identity resolution algorithm matching clinical records across disparate health systems.',
    },
    {
      id: 'consent-engine',
      title: 'Dynamic Consent Management',
      description: 'Granular patient consent tokens allowing opt-in/opt-out control down to individual health record attributes.',
    },
    {
      id: 'fhir-native',
      title: 'FHIR R4 Native API Engine',
      description: 'Turn legacy HL7 v2 and CDA messages into standardized RESTful FHIR JSON streams.',
    },
  ],
  benefits: [
    {
      id: 'interop',
      title: '100% ONC Interoperability Compliance',
      description: 'Meets 21st Century Cures Act information blocking mandates.',
      metric: '100%',
    },
  ],
  useCases: [
    {
      id: 'health-systems',
      title: 'Health System EHR Unification',
      description: 'Consolidate multiple hospital system patient records into a single longitudinal health history.',
      industry: 'Healthcare',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'fhir', name: 'HL7 FHIR R4', category: 'Standard' },
    { id: 'dotnet', name: '.NET 9', category: 'Backend' },
    { id: 'postgres', name: 'PostgreSQL', category: 'Database' },
  ],
  security: [
    { id: 'hipaa', title: 'HIPAA & BAA Ready', description: 'Complete Business Associate Agreement coverage.' },
  ],
  roadmap: [
    { id: 'r1', quarter: 'Q1 2026', title: 'FHIR Bulk Data v2 Support', description: 'High-throughput clinical export.', status: 'completed' },
  ],
  pricingPreview: {
    cta: { text: 'Contact Healthcare Team', href: '/contact?inquiry=healthcare' },
    plans: [
      {
        id: 'clinical-standard',
        name: 'Clinical Starter',
        price: 'Annual Tier',
        description: 'For regional clinics and health tech applications needing FHIR connectivity.',
        features: ['Up to 100,000 Patient MPI Records', 'FHIR R4 Standard Adapter', 'Standard BAA Agreement'],
      },
      {
        id: 'enterprise-health',
        name: 'Health System Enterprise',
        price: 'Custom SLA',
        description: 'For hospital networks, health insurance providers, and national health registries.',
        features: [
          'Unlimited Patient Records',
          'Real-time Consent Token Engine',
          'HL7 v2 / C-CDA to FHIR Converter',
          'Dedicated Healthcare Security Audit',
          '24/7 Priority Support & BAA',
        ],
        popular: true,
      },
    ],
  },
  deploymentModels: [
    'Dedicated Healthcare VPC (AWS / Azure Health)',
    'On-Premises Hospital Datacenter Cluster',
    'HIPAA-Compliant Managed SaaS',
  ],
  scalabilityMetrics: [
    { value: '99.99%', label: 'MPI Match Accuracy', description: 'Deterministic & probabilistic ML patient matching engine.' },
    { value: '< 50ms', label: 'Consent Enforcement Overhead', description: 'Sub-second permission filtering per FHIR request.' },
    { value: '10M+', label: 'Active Patient Identities', description: 'Benchmarked capacity across enterprise health networks.' },
  ],
  integrations: [
    { name: 'Epic / Cerner / Allscripts EHR', category: 'Health Systems', description: 'HL7 v2 & SMART-on-FHIR connectors' },
    { name: 'PostgreSQL / AWS HealthLake', category: 'Clinical Storage', description: 'Encrypted patient database backends' },
    { name: 'Okta for Healthcare / OAuth2', category: 'Identity', description: 'Patient & Practitioner SAML SSO' },
  ],
  relatedSolutions: [
    { title: 'Enterprise Integration & APIs', href: '/solutions/enterprise-integration' },
    { title: 'Data Engineering & Analytics', href: '/solutions/data-engineering' },
    { title: 'RAG Solutions & Knowledge Base', href: '/solutions/rag-solutions' },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'Is OneHealthID HIPAA compliant?',
      answer: 'Yes. OneHealthID is designed for full HIPAA compliance, and Sathus Technology signs Business Associate Agreements (BAAs) with all healthcare clients.',
    },
    {
      id: 'faq-2',
      question: 'Does OneHealthID support SMART-on-FHIR apps?',
      answer: 'Yes. OneHealthID includes native SMART-on-FHIR OAuth2 authorization flows, allowing third-party clinical decision apps to securely connect to patient records.',
    },
  ],
};
