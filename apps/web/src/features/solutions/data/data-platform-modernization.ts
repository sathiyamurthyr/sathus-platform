import type { Solution } from '../types';

export const dataPlatformModernizationSolution: Solution = {
  slug: 'data-platform-modernization',
  title: 'Data Platform Modernization & Lakehouses',
  description: 'Migrate legacy data warehouses (Oracle, Teradata, SQL Server) to open lakehouse platforms on Databricks, Snowflake, and Apache Iceberg.',
  icon: 'Server',
  hero: {
    title: 'Data Platform & Lakehouse Modernization',
    description: 'Decommission costly legacy enterprise data warehouses. Transition to open, governed lakehouse architectures on Databricks and Snowflake with zero data loss.',
    primaryCta: { text: 'Talk to Data Architects', href: '/contact' },
    secondaryCta: { text: 'Explore Case Studies', href: '/case-studies' },
    stats: [
      { value: '70%', valueLabel: 'Storage & Compute Cost Savings', label: 'TCO Impact' },
      { value: '10x', valueLabel: 'Faster Analytical Queries', label: 'Performance' },
      { value: 'Zero', valueLabel: 'Vendor Lock-in', label: 'Apache Iceberg' },
    ],
  },
  challenges: [
    { id: 'legacy-costs', title: 'Exorbitant Data Warehouse Licensing', description: 'Proprietary appliances (Teradata, Exadata) drain IT budgets with slow scaling capabilities.' },
  ],
  capabilities: [
    { id: 'iceberg-lakehouse', title: 'Apache Iceberg & Delta Lake Platforms', description: 'Open table formats providing ACID transactions, time travel, and unified streaming/batch SQL.', icon: 'Layers' },
    { id: 'data-governance', title: 'Unity Catalog Governance', description: 'Centralized data lineage, column-level masking, and automated data quality validation.', icon: 'ShieldCheck' },
  ],
  architecture: {
    title: 'Modern Open Lakehouse Architecture',
    description: 'Bronze raw ingestion, Silver cleansed tables, Gold analytical marts, Apache Iceberg, Unity Catalog governance, and dbt transformation pipelines.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Open Lakehouse Data Architecture Diagram',
  },
  technologies: [
    { id: 'databricks', name: 'Databricks', category: 'data' },
    { id: 'snowflake', name: 'Snowflake', category: 'database' },
    { id: 'iceberg', name: 'Apache Iceberg', category: 'data' },
    { id: 'dbt', name: 'dbt Core', category: 'data' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Data platform modernization stages.',
    stages: [
      { name: 'Schema & Query Migration', description: 'Automate translation of legacy PL/SQL scripts to PySpark and dbt SQL.' },
      { name: 'Dual-Run Validation', description: 'Replicate data pipelines in parallel, verifying 100% financial and metric alignment.' },
      { name: 'Legacy Cutover', description: 'Execute zero-downtime cutover and decommission legacy hardware.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '70% TCO Reduction', description: 'Lowered infrastructure and licensing costs following cloud lakehouse migration.', metric: '70%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Global Insurance Lakehouse Migration',
      client: 'Insurance Corp',
      industry: 'Financial Services',
      challenge: 'Legacy SQL Server warehouse failed to handle peak actuarial workload queries.',
      solution: 'Databricks lakehouse migration using Apache Iceberg table formats.',
      outcome: '70% cost reduction and 10x faster actuarial risk report generation.',
      technologies: ['Databricks', 'Apache Iceberg', 'PySpark', 'dbt'],
      duration: '7 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do you prevent data loss during warehouse migration?', answer: 'We run parallel dual-execution validation pipelines comparing row-by-row checksums before decommissioning any legacy source systems.' },
  ],
};
