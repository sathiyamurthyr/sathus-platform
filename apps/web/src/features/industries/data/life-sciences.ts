import type { Industry } from '../types';

export const lifeSciencesIndustry: Industry = {
  slug: 'life-sciences',
  name: 'Life Sciences',
  description:
    'Engineering platforms for pharmaceutical, biotech, and research organizations with compliance and data integrity.',
  hero: {
    title: 'Life Sciences',
    description:
      'Engineering platforms for pharmaceutical, biotech, and research organizations with compliance and data integrity.',
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
      'Life sciences organizations need platforms that ensure data integrity, regulatory compliance, and accelerate R&D while maintaining GxP standards.',
  },
  challenges: [
    {
      id: 'regulatory-compliance',
      title: 'Regulatory Compliance',
      description:
        'FDA 21 CFR Part 11, GxP, and other regulatory requirements for data integrity.',
    },
    {
      id: 'data-integrity',
      title: 'Data Integrity',
      description:
        'Ensuring data quality and traceability throughout the research lifecycle.',
    },
    {
      id: 'r-d-acceleration',
      title: 'R&D Acceleration',
      description:
        'Speeding up drug discovery and development with AI and automation.',
    },
  ],
  solutions: [
    {
      id: 'ai-engineering',
      title: 'AI Engineering',
      description:
        'AI-powered drug discovery and research optimization platforms.',
      href: '/solutions/ai-engineering',
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'Governed data platforms for clinical trials and research data.',
      href: '/solutions/data-engineering',
    },
    {
      id: 'cloud-modernization',
      title: 'Cloud Modernization',
      description:
        'Validated cloud environments for GxP-compliant operations.',
      href: '/solutions/cloud-modernization',
    },
  ],
  architecture: {
    title: 'Reference Architecture',
    description:
      'Our life sciences reference architecture provides a validated, compliant foundation for R&D and clinical operations.',
    imageUrl: '/images/industries/life-sciences/architecture.png',
    imageAlt: 'Life sciences reference architecture diagram',
  },
  technologies: [
    { id: 'python', name: 'Python', category: 'framework' },
    { id: 'r', name: 'R', category: 'framework' },
    { id: 'databricks', name: 'Databricks', category: 'data' },
    { id: 'azure', name: 'Azure', category: 'cloud' },
    { id: 'aws', name: 'AWS', category: 'cloud' },
  ],
  outcomes: [
    {
      id: 'faster-discovery',
      title: 'Faster Discovery',
      description:
        'Accelerated drug discovery with AI-powered research platforms.',
      metric: '30% faster discovery',
    },
    {
      id: 'compliance',
      title: 'Regulatory Compliance',
      description:
        'Built-in compliance controls for FDA and GxP requirements.',
      metric: '100% audit ready',
    },
  ],
  caseStudies: [
    {
      id: 'life-sciences-rd',
      title: 'AI-Powered Drug Discovery',
      slug: 'ai-drug-discovery',
      industry: 'Life Sciences',
    },
  ],
  faqs: [
    {
      id: 'compliance',
      question: 'How do you ensure GxP compliance in life sciences solutions?',
      answer:
        'We implement validation-ready architectures with audit trails, data integrity controls, and regulatory compliance frameworks built-in.',
    },
  ],
};