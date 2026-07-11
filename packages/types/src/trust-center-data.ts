export const trustSecurityPillars = [
  {
    id: 'identity',
    title: 'Identity',
    description:
      'Strong identity verification with multi-factor authentication ensures only authorized users access systems.',
  },
  {
    id: 'authentication',
    title: 'Authentication',
    description:
      'Secure login systems with SSO, MFA, and session management protect against unauthorized access.',
  },
  {
    id: 'authorization',
    title: 'Authorization',
    description:
      'Role-based access control with least-privilege principles ensures users access only what they need.',
  },
  {
    id: 'encryption',
    title: 'Encryption',
    description:
      'End-to-end encryption protects data at rest and in transit using industry-standard algorithms.',
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description:
      '24/7 security monitoring with real-time alerting and anomaly detection across all systems.',
  },
  {
    id: 'backup',
    title: 'Backup',
    description:
      'Automated, geographically distributed backups with verified restoration procedures.',
  },
  {
    id: 'disaster-recovery',
    title: 'Disaster Recovery',
    description:
      'Comprehensive disaster recovery plans with tested failover and business continuity protocols.',
  },
];

export const trustPrivacyRights = [
  {
    id: 'data-collection',
    title: 'Data Collection',
    description:
      'We collect only the minimum data necessary to provide our services, with clear transparency about what we collect and why.',
    rights: ['Transparent policies', 'Minimal data collection', 'Purpose limitation'],
  },
  {
    id: 'data-usage',
    title: 'Data Usage',
    description:
      'Your data is used solely to provide and improve services, never sold to third parties without consent.',
    rights: ['Purpose-bound processing', 'No unauthorized selling', 'Consent management'],
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    description:
      'We retain data only as long as required by law or legitimate business needs, then securely delete it.',
    rights: ['Clear retention periods', 'Secure deletion', 'No permanent storage'],
  },
  {
    id: 'data-ownership',
    title: 'Data Ownership',
    description:
      'You maintain full ownership of your data. We are stewards, not owners.',
    rights: ['Your data remains yours', 'Export anytime', 'Portability guaranteed'],
  },
  {
    id: 'customer-rights',
    title: 'Customer Rights',
    description:
      'Full rights to access, correct, delete, and export your personal data.',
    rights: ['Right to access', 'Right to rectification', 'Right to erasure', 'Right to portability'],
  },
  {
    id: 'privacy-requests',
    title: 'Privacy Requests',
    description:
      'Dedicated channel for submitting and tracking privacy-related requests.',
    rights: ['Dedicated channel', '30-day response SLA', 'Transparent tracking'],
  },
];

export const trustResponsibleAI = [
  {
    id: 'human-oversight',
    title: 'Human Oversight',
    description:
      'Every AI decision is subject to human review. No automated decision is final without human verification.',
  },
  {
    id: 'bias-awareness',
    title: 'Bias Awareness',
    description:
      'Continuous monitoring and mitigation of algorithmic bias using diverse datasets and fairness metrics.',
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description:
      'Clear documentation of AI capabilities, limitations, and decision-making processes.',
  },
  {
    id: 'ai-privacy',
    title: 'Privacy',
    description:
      'Your data is never used to train models without explicit, informed consent.',
  },
  {
    id: 'safety',
    title: 'Safety',
    description:
      'AI systems are designed with built-in safety guardrails, fallback mechanisms, and kill switches.',
  },
  {
    id: 'ethical-ai',
    title: 'Ethical AI',
    description:
      'Our AI principles are governed by an independent ethics board with external advisors.',
  },
];

export const trustEncryptionLayers = [
  {
    id: 'application',
    title: 'Application Layer',
    description:
      'Customer-facing applications with field-level encryption for sensitive data before it ever reaches storage.',
  },
  {
    id: 'transit',
    title: 'Encryption in Transit',
    description:
      'TLS 1.3 enforced for all communications. Mutual TLS available for enterprise integrations.',
  },
  {
    id: 'rest',
    title: 'Encryption at Rest',
    description:
      'AES-256 encryption for all stored data. Database-level and filesystem-level encryption.',
  },
  {
    id: 'key-management',
    title: 'Key Management',
    description:
      'HSM-backed key generation, rotation, and lifecycle management with zero-knowledge architecture.',
  },
  {
    id: 'future-e2ee',
    title: 'Future: End-to-End Encryption',
    description:
      'Planned end-to-end encryption for select data types, giving customers full control over their keys.',
  },
];

export const trustComplianceRoadmap = [
  {
    id: 'iso-27001',
    title: 'ISO 27001',
    description: 'Information security management system certification for global enterprise trust.',
    date: 'Target: 2025 Q4',
    status: 'planning' as const,
  },
  {
    id: 'soc-2',
    title: 'SOC 2 Type II',
    description:
      'Trust services criteria audit covering security, availability, and confidentiality.',
    date: 'Target: 2025 Q3',
    status: 'in-progress' as const,
  },
  {
    id: 'gdpr',
    title: 'GDPR',
    description:
      'EU General Data Protection Regulation compliance for all EU-based customers and operations.',
    date: 'In Progress',
    status: 'in-progress' as const,
  },
  {
    id: 'hipaa',
    title: 'HIPAA',
    description:
      'Health Insurance Portability and Accountability Act for healthcare customers in the United States.',
    date: 'Target: 2026 Q1',
    status: 'planning' as const,
  },
  {
    id: 'abdm',
    title: 'ABDM',
    description:
      'Ayushman Bharat Digital Mission compliance for India national health stack integration.',
    date: 'Target: 2026 Q2',
    status: 'planning' as const,
  },
  {
    id: 'dndp',
    title: 'DPDP (India)',
    description:
      'Digital Personal Data Protection Act compliance for customers and operations in India.',
    date: 'Target: 2026 Q2',
    status: 'planning' as const,
  },
];

export const trustInfrastructure = [
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture',
    description:
      'Multi-region cloud deployment with zero-trust network architecture and microservices isolation.',
  },
  {
    id: 'availability',
    title: 'Availability',
    description:
      '99.95% uptime SLA with automatic failover across multiple availability zones.',
  },
  {
    id: 'scalability',
    title: 'Scalability',
    description:
      'Auto-scaling infrastructure handles traffic spikes seamlessly without service degradation.',
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description:
      'End-to-end observability with real-time metrics, logs, and distributed tracing across all services.',
  },
  {
    id: 'backups',
    title: 'Backups',
    description:
      'Continuous encrypted backups with cross-region replication and verified restoration procedures.',
  },
  {
    id: 'logging',
    title: 'Logging',
    description:
      'Immutable audit logs with 90-day retention and real-time anomaly detection.',
  },
];

export const trustDataProtection = [
  {
    id: 'data-classification',
    title: 'Data Classification',
    description:
      'All data is classified by sensitivity level with corresponding protection controls applied automatically.',
  },
  {
    id: 'access-controls',
    title: 'Access Controls',
    description:
      'Strict role-based access control (RBAC) with mandatory MFA for all administrative access.',
  },
  {
    id: 'data-minimization',
    title: 'Data Minimization',
    description:
      'We collect only what is necessary and delete the rest. No hoarding of unnecessary data.',
  },
  {
    id: 'third-party-risk',
    title: 'Third-Party Risk',
    description:
      'All vendors undergo rigorous security assessments with contractual security obligations.',
  },
];

export const trustIncidentResponse = [
  {
    id: 'detection',
    title: 'Detection',
    description:
      'Automated monitoring and AI-powered anomaly detection identify potential incidents within seconds.',
  },
  {
    id: 'containment',
    title: 'Containment',
    description:
      'Immediate isolation of affected systems prevents lateral movement and minimizes impact.',
  },
  {
    id: 'eradication',
    title: 'Eradication',
    description:
      'Root cause analysis and complete remediation of the threat vector.',
  },
  {
    id: 'recovery',
    title: 'Recovery',
    description:
      'Restored services with enhanced security controls to prevent recurrence.',
  },
  {
    id: 'communication',
    title: 'Communication',
    description:
      'Transparent communication with stakeholders within defined SLAs with regulatory timelines.',
  },
];

export const trustFAQ = [
  {
    id: 'data-stored',
    question: 'How is my data stored?',
    answer:
      'Your data is stored using AES-256 encryption at rest across geographically distributed data centers. All storage systems undergo regular security audits and penetration testing.',
    category: 'data' as const,
  },
  {
    id: 'data-encrypted',
    question: 'Is my data encrypted?',
    answer:
      'Yes. All data is encrypted both at rest (AES-256) and in transit (TLS 1.3). For enterprise customers, we offer additional encryption options including customer-managed keys.',
    category: 'encryption' as const,
  },
  {
    id: 'data-access',
    question: 'Who has access to my data?',
    answer:
      'Access is strictly controlled using role-based access control (RBAC) with mandatory MFA. All access is logged and audited. Employees access customer data only when required for support, and never without proper authorization.',
    category: 'privacy' as const,
  },
  {
    id: 'backup-frequency',
    question: 'How often are backups performed?',
    answer:
      'Continuous data protection with point-in-time recovery every 15 minutes. Cross-region redundant backups ensure no data loss even in catastrophic events.',
    category: 'backups' as const,
  },
  {
    id: 'data-breach',
    question: 'What happens if there is a security incident?',
    answer:
      'We follow a structured incident response plan. You will be notified within 72 hours of confirmed data impact. We work with leading forensic firms and regulatory bodies as required.',
    category: 'data' as const,
  },
  {
    id: 'export-data',
    question: 'Can I export my data?',
    answer:
      'Yes, you can export all your data at any time in standard formats (JSON, CSV). We support data portability as a fundamental right under GDPR and DPDP regulations.',
    category: 'privacy' as const,
  },
  {
    id: 'security-certifications',
    question: 'What security certifications do you have?',
    answer:
      'We are actively pursuing SOC 2 Type II, ISO 27001, GDPR, HIPAA, ABDM, and DPDP certifications. See our Compliance Roadmap for current status and projected timelines.',
    category: 'encryption' as const,
  },
  {
    id: 'third-party-vendors',
    question: 'Do you use third-party vendors?',
    answer:
      'We work with vetted third-party vendors who are contractually required to meet our security standards. All vendor access is restricted and monitored.',
    category: 'data' as const,
  },
  {
    id: 'security-incidents',
    question: 'How do you handle security incidents?',
    answer:
      'Our 24/7 security team follows a 5-phase incident response plan: Detection, Containment, Eradication, Recovery, and Communication. All incidents are documented and reviewed for continuous improvement.',
    category: 'support' as const,
  },
  {
    id: 'data-deletion',
    question: 'Can I request data deletion?',
    answer:
      'Yes. You can request complete deletion of your data at any time. We will process your request within 30 days and provide confirmation of deletion.',
    category: 'privacy' as const,
  },
];

export const trustAvailabilityServices = [
  { name: 'API Gateway', status: 'operational' as const },
  { name: 'Authentication Service', status: 'operational' as const },
  { name: 'Data Storage', status: 'operational' as const },
  { name: 'ML Pipeline', status: 'operational' as const },
  { name: 'Web Application', status: 'operational' as const },
  { name: 'Background Jobs', status: 'operational' as const },
];

export const trustContactInfo = {
  securityEmail: 'security@sathusplatform.com',
  responsibleDisclosure: {
    description:
      'We welcome responsible disclosure of security vulnerabilities. Please submit detailed reports through our security email and allow 90 days for remediation before public disclosure.',
  },
  bugReporting: {
    description:
      'Report security bugs directly to our engineering team. Include a clear description, steps to reproduce, and potential impact assessment.',
  },
  bugBounty: {
    active: false,
    description:
      'A public bug bounty program is planned for launch in 2025. In the meantime, we deeply appreciate and acknowledge responsible disclosures from security researchers.',
  },
};

export const trustBadges = [
  { text: 'Privacy First' },
  { text: 'AI Responsible' },
  { text: 'Secure by Design' },
  { text: 'Cloud Native' },
];
