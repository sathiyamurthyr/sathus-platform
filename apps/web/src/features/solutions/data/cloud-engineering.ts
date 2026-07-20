import type { Solution } from '../types';

export const cloudEngineeringSolution: Solution = {
  slug: 'cloud-engineering',
  title: 'Cloud Engineering & Infrastructure',
  description: 'Enterprise cloud infrastructure, Terraform IaC pipelines, Kubernetes orchestration, and automated SRE operations.',
  icon: 'Cloud',
  hero: {
    title: 'Cloud Engineering & Platform Infrastructure',
    description: 'Design and manage resilient, multi-region cloud foundations on AWS and Azure. Automate infrastructure with Terraform, Kubernetes, and GitOps CI/CD pipelines.',
    primaryCta: { text: 'Book Architecture Review', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Case Studies', href: '/case-studies' },
    stats: [
      { value: '99.99%', valueLabel: 'Uptime SLA', label: 'Availability' },
      { value: '100%', valueLabel: 'IaC Coverage', label: 'Terraform Automation' },
      { value: '40%', valueLabel: 'Cloud Savings', label: 'FinOps Impact' },
    ],
  },
  challenges: [
    { id: 'manual-ops', title: 'Manual Infrastructure Provisioning', description: 'Ad-hoc cloud changes create environment drift and security vulnerabilities.' },
    { id: 'cloud-sprawl', title: 'Ungoverned Cloud Sprawl', description: 'Unmonitored resources inflate monthly cloud bills without clear cost attribution.' },
  ],
  capabilities: [
    { id: 'iac', title: 'Terraform & OpenTofu IaC', description: 'Declarative infrastructure as code with policy enforcement using Sentinel and OPA.', icon: 'Code' },
    { id: 'k8s', title: 'Kubernetes Platform Engineering', description: 'Production-grade EKS and AKS cluster management with GitOps (ArgoCD).', icon: 'Container' },
  ],
  architecture: {
    title: 'Multi-Region Enterprise Cloud Architecture',
    description: 'VPC peering, transit gateways, Kubernetes ingress controllers, automated failover, and central SIEM logging.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Enterprise Cloud Platform Architecture Diagram',
  },
  technologies: [
    { id: 'aws', name: 'Amazon Web Services', category: 'cloud' },
    { id: 'azure', name: 'Microsoft Azure', category: 'cloud' },
    { id: 'tf', name: 'Terraform', category: 'devops' },
    { id: 'argo', name: 'ArgoCD', category: 'devops' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Cloud platform lifecycle.',
    stages: [
      { name: 'Landing Zone Architecture', description: 'Provision enterprise security, IAM, and networking baselines.' },
      { name: 'GitOps Pipeline Setup', description: 'Implement automated CI/CD deployment pipelines.' },
      { name: 'SRE & Observability', description: 'Integrate Prometheus, Grafana, and Datadog telemetry.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '99.99% Infrastructure Reliability', description: 'High availability SLA across multi-region deployments.', metric: '99.99%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'FinTech Multi-Region Cloud Deployment',
      client: 'Global FinTech',
      industry: 'Financial Services',
      challenge: 'Manual deployment delays and regulatory compliance requirements.',
      solution: 'Automated Terraform EKS landing zone with zero-trust networking.',
      outcome: '99.99% uptime achieved across 12M+ monthly transactions.',
      technologies: ['AWS', 'Terraform', 'Kubernetes'],
      duration: '6 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'Do you support multi-cloud architectures?', answer: 'Yes. We specialize in hybrid and multi-cloud environments combining AWS, Azure, and on-premises Kubernetes.' },
  ],
};
