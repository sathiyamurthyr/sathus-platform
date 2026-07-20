import type { Solution } from '../types';

export const enterpriseIntegrationSolution: Solution = {
  slug: 'enterprise-integration',
  title: 'Enterprise Integration & Event Mesh',
  description: 'Event-driven architectures, Kafka message buses, and composable integration gateways for legacy systems.',
  icon: 'Layers',
  hero: {
    title: 'Enterprise Integration & Event Mesh',
    description: 'Connect legacy mainframes, ERPs, CRMs, and modern microservices using high-throughput event buses, Apache Kafka, and standardized API gateways.',
    primaryCta: { text: 'Talk to Integration Engineers', href: '/contact' },
    secondaryCta: { text: 'Explore Architecture', href: '/solutions' },
    stats: [
      { value: '1M+', valueLabel: 'Events per Second', label: 'Kafka Throughput' },
      { value: '99.999%', valueLabel: 'Message Delivery Guarantee', label: 'Reliability' },
      { value: 'Sub-10ms', valueLabel: 'Event Latency', label: 'Speed' },
    ],
  },
  challenges: [
    { id: 'monolithic-coupling', title: 'Tightly Coupled Point-to-Point APIs', description: 'Direct API connections between legacy systems lead to cascading failures and downtime.' },
  ],
  capabilities: [
    { id: 'kafka-bus', title: 'Kafka Event Mesh', description: 'Distributed event streaming platforms with Schema Registry and dead-letter queues.', icon: 'Activity' },
    { id: 'api-gateways', title: 'Enterprise API Gateways', description: 'Centralized OAuth2 tokens, rate limiting, and request transformation.', icon: 'ShieldCheck' },
  ],
  architecture: {
    title: 'Event-Driven Enterprise Architecture',
    description: 'Apache Kafka event backbone, Schema Registry, event-driven microservices, and CDC (Change Data Capture) connectors.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Enterprise Integration Event Mesh Architecture Diagram',
  },
  technologies: [
    { id: 'kafka', name: 'Apache Kafka', category: 'devops' },
    { id: 'rabbitmq', name: 'RabbitMQ', category: 'devops' },
    { id: 'debezium', name: 'Debezium CDC', category: 'data' },
    { id: 'kong', name: 'Kong API Gateway', category: 'cloud' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Integration framework.',
    stages: [
      { name: 'Domain Event Mapping', description: 'Catalog enterprise domain events and message schemas.' },
      { name: 'Event Mesh Setup', description: 'Deploy Kafka clusters with automated schema validation.' },
      { name: 'Legacy Connector Migration', description: 'Implement Change Data Capture (CDC) pipelines from legacy databases.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: 'Sub-10ms Event Latency', description: 'Real-time message routing across enterprise microservices.', metric: '<10ms' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Core Banking Event Mesh Transformation',
      client: 'Global Bank',
      industry: 'Financial Services',
      challenge: 'Batch processing delays prevented instant transaction notifications.',
      solution: 'Kafka-based event mesh with Debezium Change Data Capture.',
      outcome: 'Sub-second real-time alert notifications for 14M+ active accounts.',
      technologies: ['Apache Kafka', 'Debezium', 'Go'],
      duration: '8 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do you handle legacy mainframes?', answer: 'We use Change Data Capture (CDC) and event wrapper microservices to stream mainframe transactions without heavy system refactoring.' },
  ],
};
