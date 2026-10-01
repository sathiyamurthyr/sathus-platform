import type { Product } from '../types';

export const oneHealthId: Product = {
  id: 'onehealthid',
  name: 'OneHealthID',
  slug: 'onehealthid',
  tagline: 'Role-First Healthcare Operating Platform for Hospitals, Clinics & Patients',
  description: 'OneHealthID (OHID) is an enterprise healthcare operating platform that simplifies hospital and clinical operations through dedicated, role-first workspaces for administrators, doctors, nurses, staff, and patients.',
  hero: {
    title: 'OneHealthID Operating Platform',
    description: 'One platform. Different experiences for every healthcare role. Streamline clinical workflows, eliminate front-desk bottlenecks, and unify patient journeys across outpatient, inpatient, and diagnostic departments.',
    primaryCta: { text: 'Book Platform Demo', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore Architecture', href: '#features' },
    badge: 'Enterprise Healthcare Suite',
  },
  overview: {
    problem: 'Traditional hospital management systems (HMS) force every healthcare worker into cluttered, generic administrative interfaces. Doctors spend more time clicking than treating, nurses navigate disjointed screens for vitals and bed allocation, and patients wait in opaque, uncoordinated queues.',
    solution: 'OneHealthID replaces monolithic HMS software with role-first operating workspaces. Each user—whether a hospital administrator, attending physician, triage nurse, receptionist, or patient—interacts only with tools, workflows, and real-time data explicitly engineered for their operational role.',
    differentiator: 'Validated in production pilots including Kedar Hospital. Built with strict tenant isolation, sub-50ms database response times, ABDM/ABHA compatibility, HL7 FHIR R4 interoperability, and ISO 27001-aligned zero-trust security.',
  },
  features: [
    {
      id: 'role-workspaces',
      title: 'Dynamic Role-First Workspaces',
      description: 'Dedicated operational environments tailored for all 9 healthcare roles: System Admins, Hospital Admins, Doctors, Nurses, Receptionists, Pharmacists, Lab Technicians, Billing Staff, and Patients.',
    },
    {
      id: 'clinical-suite',
      title: 'Rapid Clinical Consultation Suite',
      description: 'Doctor-centric consultation flow with structured SOAP clinical notes, ICD-10 diagnosis coding, digital prescription dispatch, and instant longitudinal medical history.',
    },
    {
      id: 'smart-queue',
      title: 'Intelligent OPD Queue & Token Engine',
      description: 'Real-time queue tracking, priority token assignment, estimated wait-time calculation, and automated call displays minimizing clinic waiting times.',
    },
    {
      id: 'vitals-triage',
      title: 'Nurse Triage & Clinical Vitals Grid',
      description: 'Rapid-entry vitals logging (BP, SpO2, pulse, temperature, glucose, BMI) with auto-flagging of clinical warning signs and instant handoff to attending physicians.',
    },
    {
      id: 'fast-intake',
      title: 'Sub-30s Patient Registration & Deduplication',
      description: 'Instant patient intake with automated phone/demographic duplicate detection, doctor slot allocation, and printed or digital QR tokens.',
    },
    {
      id: 'patient-portal',
      title: 'Patient Digital Health Card & Portal',
      description: 'Personal health record (PHR) access, digital OHID card with secure QR code, appointment booking, digital prescriptions, and test report downloads.',
    },
    {
      id: 'hospital-telemetry',
      title: 'Hospital Operational & Revenue Telemetry',
      description: 'Executive dashboards showing real-time bed occupancy, department load, doctor consultation throughput, billing collections, and comprehensive audit trails.',
    },
    {
      id: 'abdm-fhir',
      title: 'ABDM (ABHA) & FHIR R4 Interoperability',
      description: 'Seamless integration with Ayushman Bharat Digital Mission (ABDM), ABHA creation, and native HL7 FHIR R4 health information exchange.',
    },
  ],
  benefits: [
    {
      id: 'consultation-speed',
      title: '2.4x Faster Consultation Logging',
      description: 'Streamlined doctor workspace reduces documentation time, allowing more focus on patient care.',
      metric: '2.4x',
    },
    {
      id: 'admin-efficiency',
      title: '65% Reduction in Administrative Overhead',
      description: 'Automated token routing, digital intake, and unified department billing eliminate paper handoffs.',
      metric: '65%',
    },
    {
      id: 'zero-duplicate',
      title: '99.9% Duplicate Prevention',
      description: 'Automated duplicate checking on registration prevents fragmented patient histories.',
      metric: '99.9%',
    },
    {
      id: 'registration-speed',
      title: '< 30s Front-Desk Patient Intake',
      description: 'Ultra-fast intake workflow designed for high-volume hospital outpatient departments.',
      metric: '< 30s',
    },
  ],
  useCases: [
    {
      id: 'hospital-chains',
      title: 'Multi-Specialty Hospital Networks',
      description: 'Unify OPD, IPD, emergency triage, pharmacy, and diagnostic lab operations across multiple hospital branches with role-based access control.',
      industry: 'Enterprise Hospitals',
    },
    {
      id: 'clinics-centers',
      title: 'Outpatient Polyclinics & Daycare Centers',
      description: 'Deploy fast patient intake, doctor scheduling, electronic prescription generation, and automated patient billing without complex infrastructure.',
      industry: 'Clinical Centers',
    },
    {
      id: 'pilot-deployment',
      title: 'Pilot-Proven Hospital Deployments',
      description: 'Turnkey operating slice deployed and battle-tested for regional healthcare institutions like Kedar Hospital.',
      industry: 'Regional Healthcare',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'fastapi', name: 'FastAPI / Python 3.12', category: 'Backend' },
    { id: 'nextjs', name: 'Next.js 15 / React 19', category: 'Frontend' },
    { id: 'postgres', name: 'PostgreSQL & Stored Procedures', category: 'Database' },
    { id: 'fhir', name: 'HL7 FHIR R4 & ABDM APIs', category: 'Standard' },
    { id: 'redis', name: 'Redis Caching & Rate Limiting', category: 'Infrastructure' },
    { id: 'tailwind', name: 'TailwindCSS & Design Tokens', category: 'UI Engine' },
  ],
  security: [
    { id: 'tenant-isolation', title: 'Strict Hospital Tenant Isolation', description: 'Guaranteed boundary separation preventing unauthorized cross-hospital data access.' },
    { id: 'bcrypt-auth', title: 'Zero-Trust Authentication', description: 'High-cost bcrypt password hashing, JWT session protection, and sliding-window rate limiting.' },
    { id: 'audit-logging', title: 'Structured Audit Logging', description: 'Every clinical access, prescription dispatch, and record query logged with structured JSON audit trails.' },
    { id: 'hipaa-abdm', title: 'HIPAA & ABDM Ready', description: 'End-to-end data encryption in transit and at rest, ISO 27001-aligned security program.' },
  ],
  roadmap: [
    { id: 'r1', quarter: 'Q1 2026', title: 'Kedar Hospital Pilot Vertical Slice', description: 'Responsive clinical workspace, doctor consultation, duplicate check, and SP/views architecture.', status: 'completed' },
    { id: 'r2', quarter: 'Q2 2026', title: 'Enterprise Role-First Workspaces', description: 'Full 9-role workspace engine, dynamic navigation, context switching, and bcrypt security hardening.', status: 'completed' },
    { id: 'r3', quarter: 'Q3 2026', title: 'ABDM M1/M2/M3 National Certification', description: 'Full national health network integration with ABHA linking and consent manager gateway.', status: 'in-progress' },
    { id: 'r4', quarter: 'Q4 2026', title: 'AI Clinical Documentation Assistant', description: 'Ambient clinical scribe integrating speech-to-text with auto-generated SOAP draft notes.', status: 'planned' },
  ],
  pricingPreview: {
    cta: { text: 'Contact Healthcare Team', href: '/contact?inquiry=healthcare' },
    plans: [
      {
        id: 'clinic-pilot',
        name: 'Hospital Pilot & Clinic Tier',
        price: 'Pilot / Annual',
        description: 'Ideal for single-facility clinics and regional hospitals deploying digital OPD and clinical operations.',
        features: [
          'Up to 50,000 Patient Registrations',
          'Full OPD Queue & Doctor Workspaces',
          'Nurse Triage & Clinical Vitals Grid',
          'Front-Desk Registration & Duplicate Check',
          'Digital Prescriptions & Patient QR Cards',
          'Standard Cloud or Hybrid Hospital Deployment',
        ],
      },
      {
        id: 'enterprise-network',
        name: 'Multi-Hospital Enterprise',
        price: 'Custom Enterprise SLA',
        description: 'For hospital networks, state healthcare registries, and healthcare systems requiring multi-tenant scalability.',
        features: [
          'Unlimited Patient Records & Hospital Branches',
          'All 9 Role-First Operating Workspaces',
          'IPD Ward & Bed Management Workflows',
          'ABDM (ABHA) Gateway & FHIR R4 Integration',
          'Hospital Operational & Revenue Analytics',
          'Dedicated Security Audit & 24/7 SLA Support',
          'On-Premises, Hybrid, or Dedicated VPC Hosting',
        ],
        popular: true,
      },
    ],
  },
  deploymentModels: [
    'Dedicated Healthcare VPC (AWS / Azure / GCP)',
    'On-Premises Hospital Datacenter Cluster',
    'HIPAA-Compliant Managed SaaS',
    'Hybrid Edge Clinic Sync Architecture',
  ],
  scalabilityMetrics: [
    { value: '< 50ms', label: 'Clinical Query Latency', description: 'Optimized stored procedures and views for instantaneous clinical screen transitions.' },
    { value: '99.95%', label: 'Platform Availability Target', description: 'Redundant, cloud-native architecture with multi-tenant data isolation.' },
    { value: '100%', label: 'Audit Trail Coverage', description: 'Complete structured JSON logging for all patient record queries, logins, and clinical entries.' },
  ],
  integrations: [
    { name: 'Ayushman Bharat Digital Mission (ABDM)', category: 'National Health', description: 'ABHA creation, verification, and Health Information Exchange' },
    { name: 'HL7 FHIR R4 & SMART-on-FHIR', category: 'Interoperability', description: 'Standardized clinical data exchange with international EHRs' },
    { name: 'PostgreSQL Enterprise / Cloud SQL', category: 'Clinical Storage', description: 'Row-level multi-tenant isolated relational medical record store' },
    { name: 'Redis Cache & Rate Limiter', category: 'Security & Speed', description: 'Sliding-window token rate limiting and high-speed session management' },
  ],
  relatedSolutions: [
    { title: 'Enterprise Integration & APIs', href: '/solutions/enterprise-integration' },
    { title: 'AI Engineering & Agents', href: '/solutions/ai-engineering' },
    { title: 'Data Platform Modernization', href: '/solutions/data-platform-modernization' },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'What makes OneHealthID different from a traditional Hospital Management System (HMS)?',
      answer: 'Most legacy HMS solutions are monolithic billing software masquerading as clinical tools. OneHealthID is role-first: it provides purpose-built, distraction-free workspaces tailored to doctors, nurses, receptionists, hospital administrators, and patients, speeding up workflows by up to 60%.',
    },
    {
      id: 'faq-2',
      question: 'Is OneHealthID compliant with ABDM and Indian healthcare regulations?',
      answer: 'Yes. OneHealthID is engineered to support the Ayushman Bharat Digital Mission (ABDM), ABHA ID creation, and Health Information Provider/User (HIP/HIU) protocols, alongside international HIPAA and HL7 FHIR R4 standards.',
    },
    {
      id: 'faq-3',
      question: 'Can OneHealthID run on-premises or does it require cloud hosting?',
      answer: 'OneHealthID supports flexible deployment models: HIPAA-compliant managed cloud SaaS, dedicated healthcare VPCs (AWS / Azure / GCP), and on-premises private datacenter clusters for hospitals with local data residency mandates.',
    },
    {
      id: 'faq-4',
      question: 'How does the Kedar Hospital pilot validate this platform?',
      answer: 'The Kedar Hospital deployment validated the end-to-end vertical slice under real-world clinical pressure: fast patient intake, queue tokens, doctor consultations with digital Rx, nurse vitals recording, and cross-hospital tenant isolation.',
    },
    {
      id: 'faq-5',
      question: 'How does OneHealthID prevent duplicate patient registrations?',
      answer: 'During patient intake, the front-desk workspace executes an instantaneous multi-field phonetic and demographic match on phone number, name, and government ID, preventing fragmented medical histories before a record is created.',
    },
  ],
};
