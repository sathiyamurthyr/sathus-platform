import type { Product } from '../types';

export const vmailachat: Product = {
  id: 'vmailachat',
  name: 'Vmailachat',
  slug: 'vmailachat',
  tagline: 'Secure Real-Time Enterprise Collaboration, Messaging & Team Hub',
  description:
    'Vmailachat is an enterprise messaging and real-time team collaboration platform designed for secure corporate environments with role-based channels, audited file sharing, and zero-knowledge communications.',
  hero: {
    title: 'Vmailachat Enterprise Messaging',
    description:
      'High-speed, confidential team messaging engineered for enterprises that cannot compromise on security, compliance, or message sovereignty.',
    primaryCta: { text: 'Schedule Team Demo', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Security Specs', href: '#features' },
    badge: 'Enterprise Messaging Suite',
  },
  overview: {
    problem:
      'Consumer and public cloud chat platforms leak internal enterprise discussions, lack verifiable audit trails, and store critical corporate decision logs on external third-party servers.',
    solution:
      'Vmailachat delivers an on-premises or private-cloud collaboration hub with end-to-end encrypted messaging, departmental channels, ephemeral message policies, and administrative compliance oversight.',
    differentiator:
      'Seamlessly integrated with Vmaila business email identities, sub-millisecond WebSocket delivery, cryptographic session security, and full export compliance for corporate governance.',
  },
  features: [
    {
      id: 'realtime-messaging',
      title: 'High-Concurrency Real-Time Channels',
      description:
        'Sub-millisecond messaging across 1-on-1 direct messages, departmental channels, and project-specific discussion threads.',
    },
    {
      id: 'integrated-identity',
      title: 'Unified Corporate Directory Integration',
      description:
        'Single sign-on and role-based directory mapping mirroring the organization’s verified structure with zero external accounts.',
    },
    {
      id: 'audited-file-sharing',
      title: 'Governed Document & Media Sharing',
      description:
        'Secure in-transit file transfer with automated malware scanning, file size policy controls, and granular download permissions.',
    },
    {
      id: 'ephemeral-controls',
      title: 'Configurable Message Retention Policies',
      description:
        'Granular channel-level retention controls with automated message expiration and compliance archiving.',
    },
    {
      id: 'admin-governance',
      title: 'Enterprise Moderation & Audit Logs',
      description:
        'Complete administrative visibility into channel memberships, access revocations, and system event audit logs.',
    },
  ],
  benefits: [
    {
      id: 'confidentiality',
      title: 'Strict Confidentiality',
      description: 'Your internal communications are never monitored, surfaced, or aggregated by third parties.',
      metric: 'Zero Third-Party Access',
    },
    {
      id: 'compliance-ready',
      title: 'Audit & Compliance Ready',
      description: 'Immutable logs and automated retention policies designed for regulated industries.',
      metric: 'Audit Ready',
    },
    {
      id: 'instant-productivity',
      title: 'Frictionless Team Collaboration',
      description: 'Clean, distraction-free interface built for focused engineering and operations teams.',
      metric: '<50ms Delivery',
    },
  ],
  useCases: [
    {
      id: 'engineering-squads',
      title: 'Engineering & DevOps Incident Response',
      description: 'War rooms with automated alerting bots, deployment notifications, and incident logging.',
      industry: 'Technology & Cloud Operations',
    },
    {
      id: 'clinical-coordination',
      title: 'Hospital Inter-Departmental Coordination',
      description: 'Real-time triage communication between ER, nursing stations, pharmacy, and attending doctors.',
      industry: 'Healthcare',
    },
    {
      id: 'banking-ops',
      title: 'Treasury & Trading Operations',
      description: 'Audited desk communications with strict compliance archives and non-repudiation guarantees.',
      industry: 'FinTech & Banking',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'websockets', name: 'Secure WebSockets (WSS)', category: 'Real-Time Protocol' },
    { id: 'fastapi', name: 'Python FastAPI Async Server', category: 'Backend Engine' },
    { id: 'redis', name: 'Redis Pub/Sub Message Broker', category: 'Message Bus' },
    { id: 'postgresql', name: 'PostgreSQL Relational Store', category: 'Storage' },
  ],
  security: [
    {
      id: 'channel-encryption',
      title: 'End-to-End Channel Encryption',
      description: 'All chat streams and uploaded attachments are encrypted in transit and at rest.',
    },
    {
      id: 'device-binding',
      title: 'Cryptographic Device Verification',
      description: 'Prevents unauthorized web session hijacking or ghost client connections.',
    },
  ],
  roadmap: [
    {
      id: 'roadmap-ws-engine',
      quarter: 'Q1 2026',
      title: 'Real-Time WebSocket Core Engine',
      description: 'Sub-millisecond persistent WebSocket connection cluster.',
      status: 'completed',
    },
    {
      id: 'roadmap-channel-permissions',
      quarter: 'Q2 2026',
      title: 'Departmental Channel Permissions',
      description: 'Role-gated channel access and automated invite workflows.',
      status: 'completed',
    },
    {
      id: 'roadmap-vmaila-sync',
      quarter: 'Q3 2026',
      title: 'Vmaila Unified Corporate Directory Sync',
      description: 'Single-source directory sync linking corporate email and chat.',
      status: 'completed',
    },
    {
      id: 'roadmap-mobile-e2ee',
      quarter: 'Q4 2026',
      title: 'E2EE Mobile Integration',
      description: 'Encrypted mobile push notifications and device key exchange.',
      status: 'in-progress',
    },
  ],
  faq: [
    {
      id: 'faq-vmaila-independence',
      question: 'Is Vmailachat tied to Vmaila or can it operate independently?',
      answer:
        'Vmailachat shares the unified organizational directory with Vmaila for seamless corporate communication, but can also be deployed as an independent private messaging cluster within enterprise VPCs.',
    },
  ],
};
