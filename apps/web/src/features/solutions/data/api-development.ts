import type { Solution } from '../types';

export const apiDevelopmentSolution: Solution = {
  slug: 'api-development',
  title: 'API Engineering & FastAPI Microservices',
  description: 'High-performance, async-first REST and GraphQL APIs engineered with Python FastAPI, Pydantic v2, and OpenAPI specifications.',
  icon: 'Code2',
  hero: {
    title: 'High-Performance API & Microservices Engineering',
    description: 'Build robust, async-first backend microservices with Python FastAPI, Pydantic v2, and .NET 9. Strict OpenAPI 3.0 typing, RFC 7807 error envelopes, and enterprise security compliance.',
    primaryCta: { text: 'Talk to API Architects', href: '/contact' },
    secondaryCta: { text: 'Explore Documentation', href: '/resources/documentation' },
    stats: [
      { value: '50k+', valueLabel: 'RPS Throughput', label: 'Async Performance' },
      { value: '100%', valueLabel: 'OpenAPI 3.0 Strict', label: 'API Standards' },
      { value: '<5ms', valueLabel: 'Average P99 Latency', label: 'Response Time' },
    ],
  },
  challenges: [
    { id: 'monolithic-apis', title: 'Slow Monolithic API Gateways', description: 'Synchronous legacy frameworks block worker threads during heavy database or AI IO operations.' },
  ],
  capabilities: [
    { id: 'fastapi-async', title: 'FastAPI Async Microservices', description: 'Non-blocking Python 3.13+ async execution with Pydantic v2 validation models.', icon: 'Zap' },
    { id: 'rfc7807', title: 'Standardized Error & Rate Limits', description: 'RFC 7807 problem details envelopes, Redis rate limiters, and OAuth2 JWT authorization.', icon: 'ShieldCheck' },
  ],
  architecture: {
    title: 'Clean Architecture FastAPI Microservices Architecture',
    description: 'Domain-Driven Design (DDD), Repository Pattern, Dependency Injection, Async SQLAlchemy 2.0, Redis cache, and OpenAPI generation.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'FastAPI Microservices Architecture Diagram',
  },
  technologies: [
    { id: 'fastapi', name: 'FastAPI', category: 'ai' },
    { id: 'python', name: 'Python 3.13+', category: 'ai' },
    { id: 'pydantic', name: 'Pydantic v2', category: 'framework' },
    { id: 'sqlalchemy', name: 'Async SQLAlchemy 2.0', category: 'database' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'API design lifecycle.',
    stages: [
      { name: 'API Design-First Specification', description: 'Draft OpenAPI 3.0 schema specs before coding.' },
      { name: 'Clean Architecture Build', description: 'Implement Domain, Application, Infrastructure, and API layers.' },
      { name: 'Automated Test Suite', description: 'Pytest integration and load testing with Locust.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '50k+ RPS Capacity', description: 'High-concurrency async throughput under load.', metric: '50k+ RPS' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'High-Throughput Healthcare API Mesh',
      client: 'OneHealth Global',
      industry: 'Healthcare',
      challenge: 'Legacy synchronous API bottlenecked FHIR patient record access.',
      solution: 'Async FastAPI microservices with Redis response caching.',
      outcome: 'Sub-5ms response times and 100% FHIR R4 API compliance.',
      technologies: ['FastAPI', 'Python 3.13', 'Redis', 'PostgreSQL'],
      duration: '5 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'Why use FastAPI over traditional frameworks?', answer: 'FastAPI delivers near-Go speeds due to Starlette and Pydantic v2, with native async support and automatic OpenAPI specification generation.' },
  ],
};
