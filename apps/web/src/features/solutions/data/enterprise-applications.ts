import type { Solution } from '../types';

export const enterpriseApplicationsSolution: Solution = {
  slug: 'enterprise-applications',
  title: 'Enterprise Applications',
  description: 'Scalable, resilient line-of-business applications engineered for high-throughput enterprise operations.',
  icon: 'LayoutGrid',
  hero: {
    title: 'Enterprise Applications',
    description: 'Build mission-critical line-of-business applications with domain-driven design, event-driven integration, and strict security compliance.',
    primaryCta: { text: 'Talk to Engineers', href: '/contact' },
    secondaryCta: { text: 'View Products', href: '/products' },
    stats: [
      { value: '12M+', valueLabel: 'Active Users Served', label: 'Scalability' },
      { value: '99.99%', valueLabel: 'Uptime SLA', label: 'Reliability' },
    ],
  },
  challenges: [
    { id: 'integration', title: 'Complex Enterprise Integration', description: 'Connecting modern apps to legacy mainframes and third-party APIs seamlessly.' },
  ],
  capabilities: [
    { id: 'ddd', title: 'Domain-Driven Design', description: 'Clean architecture tailored to complex business domains.', icon: 'Layers' },
    { id: 'event-driven', title: 'Event-Driven Architecture', description: 'High-throughput event buses using Kafka and RabbitMQ.', icon: 'Activity' },
  ],
  architecture: {
    title: 'Enterprise Software Architecture',
    description: 'CQRS microservices with event sourcing and real-time state synchronization.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Enterprise Software Architecture Diagram',
  },
  technologies: [
    { id: 'dotnet', name: '.NET 9', category: 'framework' },
    { id: 'node', name: 'Node.js', category: 'framework' },
    { id: 'postgres', name: 'PostgreSQL', category: 'database' },
    { id: 'redis', name: 'Redis', category: 'database' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Agile enterprise delivery model.',
    stages: [
      { name: 'Domain Storytelling', description: 'Map domain events and bounded contexts.' },
      { name: 'API Specification', description: 'Design OpenAPI and GraphQL contracts.' },
      { name: 'Iterative Delivery', description: 'Deliver production modules in 2-week sprints.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '100% Audit Compliance', description: 'Audit compliance across regulated enterprise workflows.', metric: '100%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Core Banking Platform',
      client: 'Global FinTech',
      industry: 'Financial Services',
      challenge: 'Legacy system performance limits.',
      solution: 'Domain-driven microservices platform.',
      outcome: '5x throughput increase.',
      technologies: ['.NET 9', 'Kafka'],
      duration: '8 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'Do you build on existing .NET and Python stacks?', answer: 'Yes. We specialize in .NET, Python, and Node.js enterprise software architectures.' },
  ],
};
