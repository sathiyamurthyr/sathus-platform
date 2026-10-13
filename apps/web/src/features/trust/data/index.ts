import type { SecurityControl, ComplianceFramework, PrivacyPrinciple, ResponsibleAIPrinciple, BusinessContinuityPlan, FAQ } from '../types';

export const securityControls: SecurityControl[] = [
  {
    id: 'sdls',
    title: 'Secure SDLC',
    description: 'Security integrated into every phase of development with code reviews, static analysis, and penetration testing.',
    category: 'sdls',
  },
  {
    id: 'iam',
    title: 'Identity & Access Management',
    description: 'Multi-factor authentication, role-based access control, and just-in-time access for all systems.',
    category: 'iam',
  },
  {
    id: 'encryption',
    title: 'Encryption',
    description: 'AES-256 encryption at rest and TLS 1.3 in transit. Client-side encryption for sensitive data.',
    category: 'encryption',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Security',
    description: 'Cloud-native security with network segmentation, container security, and zero-trust architecture.',
    category: 'infrastructure',
  },
  {
    id: 'secrets',
    title: 'Secrets Management',
    description: 'Automated secrets rotation, vault-based storage, and audit logging for all sensitive credentials.',
    category: 'secrets',
  },
  {
    id: 'dependencies',
    title: 'Dependency Management',
    description: 'Automated vulnerability scanning, dependency updates, and software bill of materials.',
    category: 'dependencies',
  },
  {
    id: 'monitoring',
    title: 'Logging & Monitoring',
    description: 'Centralized logging, real-time threat detection, and security event correlation.',
    category: 'monitoring',
  },
  {
    id: 'incident',
    title: 'Incident Response',
    description: 'Structured incident response playbooks, automated alerting, and customer notification procedures.',
    category: 'incident',
  },
];

export const complianceFrameworks: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'GDPR Alignment',
    status: 'achieved',
    description: 'Data protection and privacy controls aligned with GDPR requirements.',
  },
  {
    id: 'zero-trust',
    name: 'Zero-Trust Architecture',
    status: 'achieved',
    description: 'Least-privilege access, mTLS encrypted service mesh, and role-based permissions.',
  },
  {
    id: 'hl7-fhir',
    name: 'HL7 FHIR & ABDM Standards',
    status: 'achieved',
    description: 'Interoperable schemas and gateway compatibility for digital health ecosystems.',
  },
  {
    id: 'owasp',
    name: 'OWASP Top 10',
    status: 'achieved',
    description: 'Application security controls mapped to OWASP Top 10 risks.',
  },
  {
    id: 'secure-dev',
    name: 'Secure Development Practices',
    status: 'achieved',
    description: 'Security-first development with threat modeling and code review processes.',
  },
  {
    id: 'telemetry-governance',
    name: 'Automated Telemetry Governance',
    status: 'planned',
    description: 'Continuous audit evidence collection and automated compliance reporting roadmap.',
  },
];

export const privacyPrinciples: PrivacyPrinciple[] = [
  {
    id: 'collection',
    title: 'Data Collection',
    description: 'We collect only the data necessary to provide our services. No unnecessary personal data is collected.',
  },
  {
    id: 'usage',
    title: 'Data Usage',
    description: 'Your data is used solely to provide and improve our services. We never sell or rent your data.',
  },
  {
    id: 'retention',
    title: 'Data Retention',
    description: 'Data is retained only as long as necessary for business purposes or legal requirements.',
  },
  {
    id: 'rights',
    title: 'User Rights',
    description: 'You have the right to access, correct, delete, and export your personal data.',
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    description: 'We use essential cookies only. No tracking or advertising cookies without explicit consent.',
  },
  {
    id: 'residency',
    title: 'Data Residency',
    description: 'Data is stored in your chosen geographic region to meet data sovereignty requirements.',
  },
];

export const responsibleAIPrinciples: ResponsibleAIPrinciple[] = [
  {
    id: 'oversight',
    title: 'Human Oversight',
    description: 'AI systems operate under human supervision with clear escalation paths for critical decisions.',
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description: 'Clear documentation of AI capabilities, limitations, and decision-making processes.',
  },
  {
    id: 'bias',
    title: 'Bias Mitigation',
    description: 'Regular bias testing and diverse training data to ensure fair outcomes.',
  },
  {
    id: 'monitoring',
    title: 'Model Monitoring',
    description: 'Continuous monitoring for model drift, accuracy, and performance degradation.',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'AI systems follow the same security standards as all other infrastructure.',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'AI training respects user privacy with data minimization and anonymization.',
  },
];

export const businessContinuityPlans: BusinessContinuityPlan[] = [
  {
    id: 'backups',
    title: 'Backups',
    description: 'Daily encrypted backups with point-in-time recovery and cross-region replication.',
  },
  {
    id: 'disaster',
    title: 'Disaster Recovery',
    description: 'Multi-region deployment with automated failover and recovery procedures.',
  },
  {
    id: 'availability',
    title: 'Availability Targets',
    description: '99.95% availability target with continuous telemetry monitoring and rapid incident response.',
  },
  {
    id: 'communication',
    title: 'Incident Communication',
    description: 'Real-time status updates and direct customer communication during incidents.',
  },
];

export const trustFAQ: FAQ[] = [
  {
    id: 'security',
    question: 'How do you handle security vulnerabilities?',
    answer: 'We have a responsible disclosure program. Report vulnerabilities to security@sathus.in with details and we will respond within 24 hours.',
  },
  {
    id: 'compliance',
    question: 'What compliance and security standards do you follow?',
    answer: 'Our architectures implement Zero-Trust principles, GDPR-aligned data protection, OWASP Top 10 defenses, and HL7 FHIR / ABDM data standards for healthcare.',
  },
  {
    id: 'data',
    question: 'Where is my data stored?',
    answer: 'Data is stored in your chosen geographic region with encryption at rest and in transit.',
  },
];