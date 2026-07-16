import { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Shield,
  Activity,
  HardDrive,
  RefreshCw,
  Database,
  Clock,
  UserCheck,
  FileCheck,
  Send,
  Users,
  Scale,
  AlertTriangle,
  Heart,
  Globe,
  Gauge,
  TrendingUp,
  FileText,
  FileSearch,
  Scissors,
  Wrench,
  MessageSquare,
  Cloud,
  Radar,
  Eye,
  Download,
  CheckCircle,
} from 'lucide-react';
import {
  SecurityCard,
  PrivacyCard,
  ComplianceTimeline,
  TrustBadge,
  ArchitectureDiagram,
  StatusCard,
  ContactSecurityCard,
  FAQAccordion,
  Breadcrumb,
  SectionHeader,
  Container,
  Button,
} from '@sathus-platform/ui';
import {
  trustSecurityPillars,
  trustPrivacyRights,
  trustResponsibleAI,
  trustEncryptionLayers,
  trustComplianceRoadmap,
  trustInfrastructure,
  trustDataProtection,
  trustIncidentResponse,
  trustFAQ,
  trustAvailabilityServices,
  trustContactInfo,
  trustBadges,
} from '@sathus-platform/types';

const securityIcons: Record<string, React.ReactNode> = {
  identity: <ShieldCheck className="h-5 w-5" />,
  authentication: <Lock className="h-5 w-5" />,
  authorization: <KeyRound className="h-5 w-5" />,
  encryption: <Shield className="h-5 w-5" />,
  monitoring: <Radar className="h-5 w-5" />,
  backup: <HardDrive className="h-5 w-5" />,
  'disaster-recovery': <RefreshCw className="h-5 w-5" />,
};

const privacyIcons: Record<string, React.ReactNode> = {
  'data-collection': <Database className="h-5 w-5" />,
  'data-usage': <Eye className="h-5 w-5" />,
  'data-retention': <Clock className="h-5 w-5" />,
  'data-ownership': <UserCheck className="h-5 w-5" />,
  'customer-rights': <FileCheck className="h-5 w-5" />,
  'privacy-requests': <Send className="h-5 w-5" />,
};

const responsibleAIIcons: Record<string, React.ReactNode> = {
  'human-oversight': <Users className="h-5 w-5" />,
  'bias-awareness': <Scale className="h-5 w-5" />,
  transparency: <Eye className="h-5 w-5" />,
  'ai-privacy': <ShieldCheck className="h-5 w-5" />,
  safety: <AlertTriangle className="h-5 w-5" />,
  'ethical-ai': <Heart className="h-5 w-5" />,
};

const encryptionIcons: Record<string, React.ReactNode> = {
  application: <Globe className="h-5 w-5" />,
  transit: <Lock className="h-5 w-5" />,
  rest: <HardDrive className="h-5 w-5" />,
  'key-management': <KeyRound className="h-5 w-5" />,
  'future-e2ee': <Shield className="h-5 w-5" />,
};

const infrastructureIcons: Record<string, React.ReactNode> = {
  'cloud-architecture': <Cloud className="h-5 w-5" />,
  availability: <Activity className="h-5 w-5" />,
  scalability: <Gauge className="h-5 w-5" />,
  monitoring: <TrendingUp className="h-5 w-5" />,
  backups: <HardDrive className="h-5 w-5" />,
  logging: <FileText className="h-5 w-5" />,
};

const dataProtectionIcons: Record<string, React.ReactNode> = {
  'data-classification': <ShieldCheck className="h-5 w-5" />,
  'access-controls': <Users className="h-5 w-5" />,
  'data-minimization': <Scissors className="h-5 w-5" />,
  'third-party-risk': <FileSearch className="h-5 w-5" />,
};

const incidentResponseIcons: Record<string, React.ReactNode> = {
  detection: <Radar className="h-5 w-5" />,
  containment: <Shield className="h-5 w-5" />,
  eradication: <Wrench className="h-5 w-5" />,
  recovery: <RefreshCw className="h-5 w-5" />,
  communication: <MessageSquare className="h-5 w-5" />,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://sathusplatform.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Trust Center',
      item: 'https://sathusplatform.com/trust',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: trustFAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata: Metadata = {
  title: 'Trust Center | Sathus Platform',
  description:
    'How Sathus protects data, ensures privacy, and builds trust through security-first architecture, responsible AI, and compliance.',
  openGraph: {
    type: 'website',
    url: 'https://sathusplatform.com/trust',
    title: 'Trust Center | Sathus Platform',
    description:
      'How Sathus protects data, ensures privacy, and builds trust through security-first architecture.',
    siteName: 'Sathus Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sathus Platform Trust Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trust Center | Sathus Platform',
    description:
      'How Sathus protects data, ensures privacy, and builds trust through security-first architecture.',
    creator: '@sathusplatform',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/trust',
  },
};

export default function TrustCenterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <Container size="wide" padding="sm">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Trust Center', active: true },
            ]}
          />
        </Container>
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <Container size="narrow" padding="default">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              Security Built Into Everything.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              At Sathus, security, privacy and trust are not features. They are foundations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button asChild size="lg">
                <Link href="#security-overview">Read Security Principles</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#contact">Contact Security</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {trustBadges.map((badge) => (
                <TrustBadge key={badge.text} text={badge.text} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Security Overview */}
      <section id="security-overview" className="py-16 md:py-24">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Security Overview"
            description="Our multi-layered security architecture protects every touchpoint of your data."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trustSecurityPillars.map((pillar) => (
              <SecurityCard
                key={pillar.id}
                icon={securityIcons[pillar.id]}
                title={pillar.title}
                description={pillar.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Privacy Center */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Privacy Center"
            description="We believe privacy is a fundamental right. Here is how we honor yours."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trustPrivacyRights.map((item) => (
              <PrivacyCard
                key={item.id}
                icon={privacyIcons[item.id]}
                title={item.title}
                description={item.description}
                rights={item.rights}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Responsible AI */}
      <section className="py-16 md:py-24">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Responsible AI"
            description="We build artificial intelligence with humanity at the center."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trustResponsibleAI.map((item) => (
              <PrivacyCard
                key={item.id}
                icon={responsibleAIIcons[item.id]}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Encryption */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Encryption"
            description="Every byte is encrypted. Every key is protected. Every transmission is secured."
            align="center"
          />
          <div className="max-w-3xl mx-auto mt-12">
            <ArchitectureDiagram
              title="Encryption Architecture"
              description="Our multi-layered encryption approach protects your data at every stage of its lifecycle."
              layers={trustEncryptionLayers.map((layer) => ({
                ...layer,
                icon: encryptionIcons[layer.id],
              }))}
            />
          </div>
        </Container>
      </section>

      {/* Compliance Roadmap */}
      <section className="py-16 md:py-24">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Compliance Roadmap"
            description="We are actively pursuing the most rigorous global certifications. Here is where we stand."
            align="center"
          />
          <div className="max-w-3xl mx-auto mt-12">
            <ComplianceTimeline
              items={trustComplianceRoadmap.map((item) => ({
                ...item,
                icon: getComplianceIcon(item.id),
              }))}
            />
          </div>
        </Container>
      </section>

      {/* Infrastructure */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Infrastructure"
            description="Built on world-class cloud infrastructure with redundancy and resilience at every layer."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trustInfrastructure.map((item) => (
              <SecurityCard
                key={item.id}
                icon={infrastructureIcons[item.id]}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Data Protection */}
      <section className="py-16 md:py-24">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Data Protection"
            description="We treat your data as our most valuable asset. Here is how we protect it."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {trustDataProtection.map((item) => (
              <PrivacyCard
                key={item.id}
                icon={dataProtectionIcons[item.id]}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Availability */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="narrow" padding="default">
          <SectionHeader
            title="Availability"
            description="Reliable, always-on services you can depend on."
            align="center"
          />
          <div className="mt-12">
            <StatusCard
              status="operational"
              title="System Status"
              description="All systems are currently operational. We maintain a 99.95% uptime SLA with automatic failover across multiple availability zones."
              lastUpdated="2025-07-11T19:00:00Z"
              services={trustAvailabilityServices}
            />
          </div>
        </Container>
      </section>

      {/* Incident Response */}
      <section className="py-16 md:py-24">
        <Container size="wide" padding="default">
          <SectionHeader
            title="Incident Response"
            description="When issues arise, we respond fast, communicate clearly, and recover stronger."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {trustIncidentResponse.map((step) => (
              <SecurityCard
                key={step.id}
                icon={incidentResponseIcons[step.id]}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Security FAQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container size="narrow" padding="default">
          <SectionHeader
            title="Security FAQ"
            description="Quick answers to common questions about how Sathus handles security and privacy."
            align="center"
          />
          <div className="mt-12">
            <FAQAccordion items={trustFAQ} type="single" defaultValue="data-stored" />
          </div>
        </Container>
      </section>

      {/* Download Security Whitepaper */}
      <section className="py-16 md:py-24">
        <Container size="narrow" padding="default">
          <div className="relative rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent p-8 md:p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Download Security Whitepaper
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              A comprehensive overview of our security architecture, policies, and practices.
            </p>
            <Button asChild size="lg">
              <Link href="#">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Contact Security Team */}
      <section id="contact" className="py-16 md:py-24 bg-muted/30">
        <Container size="narrow" padding="default">
          <SectionHeader
            title="Contact Security Team"
            description="We take every report seriously. Reach out through any of the channels below."
            align="center"
          />
          <div className="mt-12">
            <ContactSecurityCard {...trustContactInfo} />
          </div>
        </Container>
      </section>
    </>
  );
}

function getComplianceIcon(id: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    'iso-27001': <ShieldCheck className="h-5 w-5" />,
    'soc-2': <CheckCircle className="h-5 w-5" />,
    gdpr: <FileCheck className="h-5 w-5" />,
    hipaa: <Shield className="h-5 w-5" />,
    abdm: <Cloud className="h-5 w-5" />,
    dndp: <Shield className="h-5 w-5" />,
  };
  return icons[id] || <Shield className="h-5 w-5" />;
}
