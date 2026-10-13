import type { Industry } from '../types';

export const healthcareIndustry: Industry = {
  slug: 'healthcare',
  name: 'Healthcare',
  description:
    'Engineering platforms for healthcare providers, payers, and health tech companies with patient data privacy and clinical interoperability.',
  hero: {
    title: 'Healthcare',
    description:
      'Engineering platforms for healthcare providers, payers, and health tech companies with patient data privacy and clinical interoperability.',
    primaryCta: {
      text: 'Talk to an Expert',
      href: '/contact',
    },
    secondaryCta: {
      text: 'View Case Studies',
      href: '#case-studies',
    },
  },
  overview: {
    title: 'Industry Overview',
    description:
      'Healthcare organizations need platforms that ensure patient data privacy, regulatory compliance, and improve outcomes while reducing costs.',
  },
  challenges: [
    {
      id: 'data-privacy',
      title: 'Data Privacy & Security',
      description:
        'Ensuring patient data confidentiality, consent governance, and security across all systems.',
    },
    {
      id: 'interoperability',
      title: 'Interoperability',
      description:
        'Integrating with EHRs, claims systems, and other healthcare data sources.',
    },
    {
      id: 'patient-outcomes',
      title: 'Patient Outcomes',
      description:
        'Improving care quality and reducing costs through data-driven insights.',
    },
  ],
  solutions: [
    {
      id: 'ai-engineering',
      title: 'AI Engineering',
      description:
        'AI-powered clinical decision support and patient risk stratification.',
      href: '/solutions/ai-engineering',
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'FHIR-native data platforms for clinical and claims data.',
      href: '/solutions/data-engineering',
    },
    {
      id: 'enterprise-applications',
      title: 'Enterprise Applications',
      description:
        'Custom healthcare applications built for scale and compliance.',
      href: '/solutions/enterprise-applications',
    },
  ],
  architecture: {
    title: 'Reference Architecture',
    description:
      'Our healthcare reference architecture provides a secure, FHIR-native foundation for clinical and operational systems.',
    imageUrl: '/images/industries/healthcare/architecture.png',
    imageAlt: 'Healthcare reference architecture diagram',
  },
  technologies: [
    { id: 'dotnet', name: '.NET', category: 'framework' },
    { id: 'python', name: 'Python', category: 'framework' },
    { id: 'fhir', name: 'FHIR', category: 'other' },
    { id: 'azure', name: 'Azure', category: 'cloud' },
    { id: 'aws', name: 'AWS', category: 'cloud' },
  ],
  outcomes: [
    {
      id: 'improved-outcomes',
      title: 'Improved Outcomes',
      description:
        'Better patient care through data-driven insights and AI.',
      metric: '25% improvement in outcomes',
    },
    {
      id: 'cost-reduction',
      title: 'Cost Reduction',
      description:
        'Reduced operational costs through automation and efficiency.',
      metric: '20% cost savings',
    },
  ],
  caseStudies: [
    {
      id: 'healthcare-data-platform',
      title: 'Clinical Data Platform',
      slug: 'clinical-data-platform',
      industry: 'Healthcare',
    },
  ],
  faqs: [
    {
      id: 'compliance',
      question: 'How do you ensure data security in healthcare solutions?',
      answer:
        'We implement zero-trust architectures with column-level encryption, role-based access controls, structured JSON audit trails, and strict patient consent governance.',
    },
  ],
};