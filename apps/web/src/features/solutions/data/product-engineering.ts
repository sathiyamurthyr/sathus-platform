import type { Solution } from '../types';

export const productEngineeringSolution: Solution = {
  slug: 'product-engineering',
  title: 'Product Engineering',
  description: 'End-to-end software product delivery — from architecture to launch and continuous optimization.',
  icon: 'Rocket',
  hero: {
    title: 'Product Engineering',
    description: 'Embedded engineering squads that turn complex product visions into high-performance web, mobile, and SaaS platforms.',
    primaryCta: { text: 'Book Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore Products', href: '/products' },
    stats: [
      { value: '3x', valueLabel: 'Faster Delivery', label: 'Squad Acceleration' },
      { value: '100%', valueLabel: 'Code Coverage', label: 'Quality Assurance' },
    ],
  },
  challenges: [
    { id: 'velocity', title: 'Slow Development Velocity', description: 'In-house teams struggling to deliver complex SaaS features on schedule.' },
  ],
  capabilities: [
    { id: 'fullstack', title: 'Full-Stack Modern Web', description: 'Next.js, React, and TypeScript web applications with rich UX.', icon: 'Globe' },
    { id: 'design-system', title: 'Enterprise Design Systems', description: 'Scalable component libraries built with Tailwind and Radix primitives.', icon: 'Component' },
  ],
  architecture: {
    title: 'Modern SaaS Product Stack',
    description: 'Next.js App Router, edge API routes, serverless databases, and global CDN caching.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Product Engineering Stack Diagram',
  },
  technologies: [
    { id: 'next', name: 'Next.js 15', category: 'framework' },
    { id: 'react', name: 'React 19', category: 'framework' },
    { id: 'ts', name: 'TypeScript', category: 'framework' },
    { id: 'tw', name: 'Tailwind CSS', category: 'framework' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Agile squad embedding process.',
    stages: [
      { name: 'Product Discovery', description: 'Define user journeys and technical architecture.' },
      { name: 'Squad Embedding', description: 'Deploy dedicated senior engineering teams.' },
      { name: 'Continuous Delivery', description: 'Automated CI/CD with instant preview deployments.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '50% Time-to-Market Reduction', description: 'Reduction in time-to-market for new SaaS features.', metric: '50%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Enterprise SaaS Engineering',
      client: 'SaaS Global',
      industry: 'Enterprise Software',
      challenge: 'Scaling UI/UX design system.',
      solution: 'Next.js shared component platform.',
      outcome: '3x feature release speed.',
      technologies: ['Next.js', 'React', 'Tailwind'],
      duration: '6 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do embedded squads work?', answer: 'Our engineers integrate directly into your Jira/Slack workflow as a cohesive, high-output delivery team.' },
  ],
};
