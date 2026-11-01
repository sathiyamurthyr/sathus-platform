import type { Product } from '../types';

export const vmaila: Product = {
  id: 'vmaila',
  name: 'Vmaila',
  slug: 'vmaila',
  tagline: 'Private, Encrypted Enterprise Business Email & Communication Platform',
  description:
    'Vmaila is a secure, high-concurrency business email platform engineered with end-to-end encryption, multi-tenant organization boundaries, automated scheduling, and strict corporate data sovereignty.',
  hero: {
    title: 'Vmaila Enterprise Email Suite',
    description:
      'Reclaim communication sovereignty. Private, encrypted enterprise email built for organizations operating under strict compliance, data residency, and confidentiality standards.',
    primaryCta: { text: 'Book Platform Demo', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore Architecture', href: '#features' },
    badge: 'Enterprise Email Platform',
  },
  overview: {
    problem:
      'Commercial public cloud email providers expose sensitive corporate communications to third-party data mining, opaque privacy terms, shared infrastructure vulnerabilities, and foreign jurisdiction subpoenas.',
    solution:
      'Vmaila delivers a private, sovereign business email suite with hardware-backed encryption, isolated organization tenancy, granular admin role delegation, zero external telemetry, and native calendar/scheduler integration.',
    differentiator:
      'Engineered with asynchronous high-throughput delivery engines, zero-trust remote image isolation, multi-tenant domain mapping, transactional role auditing, and strict data residency in India or on-premises enterprise VPCs.',
  },
  features: [
    {
      id: 'e2ee-encryption',
      title: 'End-to-End Cryptographic Envelope',
      description:
        'Client-side and transit encryption safeguarding email payloads, attachments, and metadata against interception or unauthorized server access.',
    },
    {
      id: 'org-tenant-isolation',
      title: 'Multi-Tenant Organization Boundaries',
      description:
        'Strict tenant compartmentalization preventing cross-organization user enumeration, unauthorized mailbox transfers, and domain spoofing.',
    },
    {
      id: 'scheduled-delivery',
      title: 'Fault-Tolerant Scheduled Delivery',
      description:
        'Asynchronous job workers with automatic retry mechanisms, outbox resilience, and guaranteed delivery timestamp validation.',
    },
    {
      id: 'image-privacy',
      title: 'Remote Tracking & Image Proxy Guard',
      description:
        'Automatic isolation of external tracking pixels and remote image proxies to prevent sender reconnaissance and IP address leakage.',
    },
    {
      id: 'admin-governance',
      title: 'Audited Role & Domain Administration',
      description:
        'Fine-grained role assignment with last-administrator lockout protection, custom domain verification, and immutable admin audit logs.',
    },
    {
      id: 'meeting-scheduler',
      title: 'Integrated Calendar & Meeting Scheduler',
      description:
        'Native calendar integration with availability slot detection, ICS calendar event generation, and multi-participant scheduling.',
    },
  ],
  benefits: [
    {
      id: 'data-sovereignty',
      title: 'Complete Data Sovereignty',
      description: 'Your corporate communications remain within your jurisdiction and control.',
      metric: '100% Sovereign',
    },
    {
      id: 'zero-mining',
      title: 'Zero Content Mining',
      description: 'Zero automated ad profiling, email scanning, or public model training on your communications.',
      metric: '0% Model Training',
    },
    {
      id: 'high-availability',
      title: 'Resilient Infrastructure',
      description: 'Clustered mail-transfer agents and queue workers built for 99.95% enterprise uptime.',
      metric: '99.95% Target SLA',
    },
  ],
  useCases: [
    {
      id: 'regulated-finance',
      title: 'Financial & Wealth Institutions',
      description: 'Securing confidential client portfolios, trade confirmations, and compliance audit archives.',
      industry: 'Financial Services',
    },
    {
      id: 'healthcare-consortiums',
      title: 'Hospitals & Medical Groups',
      description: 'Transmitting confidential patient histories, referral records, and clinical correspondence.',
      industry: 'Healthcare',
    },
    {
      id: 'legal-firms',
      title: 'Legal Counsel & Corporate Advisors',
      description: 'Privileged communication channels with verifiable delivery and client-side encryption.',
      industry: 'Legal & Professional Services',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'python', name: 'Python 3.12 (FastAPI / Asynchronous Queues)', category: 'Backend Engine' },
    { id: 'postgresql', name: 'PostgreSQL Multi-Tenant RDBMS', category: 'Database' },
    { id: 'redis', name: 'Redis Delivery Queues', category: 'Queue & Cache' },
    { id: 'smtp', name: 'Hardened Postfix / Dovecot Gateway', category: 'Mail Transfer' },
  ],
  security: [
    {
      id: 'tls-e2ee',
      title: 'TLS 1.3 & Encrypted Envelope',
      description: 'Enforced modern cipher suites and envelope encryption for stored messages.',
    },
    {
      id: 'audit-logging',
      title: 'Immutable Administrative Audit Logs',
      description: 'All role changes, domain additions, and administrative actions are permanently logged.',
    },
  ],
  roadmap: [
    {
      id: 'roadmap-domain-routing',
      quarter: 'Q1 2026',
      title: 'Multi-Tenant Domain Routing',
      description: 'Domain-level DKIM, SPF, and DMARC enforcement with tenant isolation.',
      status: 'completed',
    },
    {
      id: 'roadmap-image-privacy',
      quarter: 'Q2 2026',
      title: 'Remote Image Privacy & Tracking Shield',
      description: 'Zero-leakage remote image proxy and pixel blocking.',
      status: 'completed',
    },
    {
      id: 'roadmap-scheduled-send',
      quarter: 'Q3 2026',
      title: 'Scheduled Send & Distributed Queue Recovery',
      description: 'Fault-tolerant background job execution with automated retry resilience.',
      status: 'completed',
    },
    {
      id: 'roadmap-smime-integration',
      quarter: 'Q4 2026',
      title: 'Zero-Knowledge S/MIME Web Integration',
      description: 'Client-side certificate handling for hardware token signing.',
      status: 'in-progress',
    },
  ],
  faq: [
    {
      id: 'faq-data-sovereignty',
      question: 'How does Vmaila ensure data sovereignty for Indian and global enterprises?',
      answer:
        'Vmaila can be deployed within dedicated enterprise cloud instances in India or on-premises infrastructure, ensuring compliance with DPDP Act 2023, GDPR, and sector-specific financial/healthcare data localization mandates.',
    },
    {
      id: 'faq-custom-domains',
      question: 'Can organizations use their existing custom business domains?',
      answer:
        'Yes. Vmaila supports automated DNS verification (SPF, DKIM, DMARC, MX) with granular alias routing and multi-domain organizational hierarchies.',
    },
  ],
};
