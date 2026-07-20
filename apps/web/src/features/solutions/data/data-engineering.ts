import type { Solution } from '../types';

export const dataEngineeringSolution: Solution = {
  slug: 'data-engineering',
  title: 'Data Engineering & Analytics',
  description: 'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
  icon: 'BarChart3',
  hero: {
    title: 'Data Engineering & Lakehouses',
    description: 'Governed lakehouses, real-time streaming pipelines, and analytics layers that transform distributed enterprise data into trusted operational intelligence.',
    primaryCta: {
      text: 'Talk to Data Architects',
      href: '/contact',
    },
    secondaryCta: {
      text: 'Explore Case Studies',
      href: '/case-studies',
    },
    stats: [
      { value: '10x', valueLabel: 'Faster query speeds', label: 'Performance Optimization' },
      { value: '99.99%', valueLabel: 'Pipeline Uptime', label: 'Streaming Availability' },
      { value: '100%', valueLabel: 'Data Lineage Tracked', label: 'Governance Coverage' },
    ],
  },
  challenges: [
    {
      id: 'data-silos',
      title: 'Enterprise Data Silos',
      description: 'Critical business data is trapped across legacy databases, legacy ERPs, and un-indexed cloud buckets.',
    },
    {
      id: 'latency',
      title: 'High Pipeline Latency',
      description: 'Batch processing leads to stale reports and delayed executive decision-making.',
    },
  ],
  capabilities: [
    {
      id: 'lakehouse',
      title: 'Governed Lakehouses',
      description: 'Unified batch and streaming data platforms built on Apache Iceberg and Delta Lake.',
      icon: 'Layers',
    },
    {
      id: 'streaming',
      title: 'Real-Time Streaming',
      description: 'Kafka and Flink event streaming for real-time analytics and instant fraud detection.',
      icon: 'Activity',
    },
  ],
  architecture: {
    title: 'Reference Lakehouse Architecture',
    description: 'End-to-end event ingestion, medallion lakehouse storage, automated data quality testing, and BI serving layers.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Data Engineering Lakehouse Reference Architecture Diagram',
  },
  technologies: [
    { id: 'dbx', name: 'Databricks', category: 'data' },
    { id: 'spark', name: 'Apache Spark', category: 'data' },
    { id: 'kafka', name: 'Apache Kafka', category: 'devops' },
    { id: 'sf', name: 'Snowflake', category: 'database' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Structured 3-phase delivery model.',
    stages: [
      { name: 'Data Audit & Schema Discovery', description: 'Catalog existing data stores and map lineage.' },
      { name: 'Lakehouse Foundation', description: 'Deploy cloud infrastructure and security policies.' },
      { name: 'Pipeline Migration', description: 'Migrate legacy ETL to modern Spark/Kafka pipelines.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '70% Cost Reduction', description: 'Reduction in data storage and infrastructure costs.', metric: '70%' },
    { id: 'o2', title: 'Sub-second Latency', description: 'Real-time event processing latency.', metric: '<1s' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'FHIR Clinical Data Lakehouse',
      client: 'HealthNet Global',
      industry: 'Healthcare',
      challenge: 'Siloed EHR patient databases across 14 hospital networks.',
      solution: 'FHIR-native streaming lakehouse with Delta Lake.',
      outcome: 'Real-time patient identity resolution and 100% ONC compliance.',
      technologies: ['Databricks', 'Apache Spark', 'FHIR R4'],
      duration: '6 Months',
    },
  ],
  faqs: [
    {
      id: 'f1',
      question: 'How do you ensure data security in cloud lakehouses?',
      answer: 'We implement column-level encryption, role-based access control (RBAC), and automated data quality checks with complete audit logging.',
    },
  ],
};
