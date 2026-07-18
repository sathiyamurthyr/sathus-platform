import type { Solution } from '../types';

export const aiEngineeringSolution: Solution = {
  slug: 'ai-engineering',
  title: 'AI Engineering',
  description:
    'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
  icon: 'Bot',
  hero: {
    title: 'AI Engineering',
    description:
      'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
    primaryCta: {
      text: 'Talk to an Expert',
      href: '/contact',
    },
    secondaryCta: {
      text: 'View Case Studies',
      href: '#case-studies',
    },
    stats: [
      { value: '40%', valueLabel: 'Average reduction in model drift', label: 'Model reliability improvement' },
      { value: '60%', valueLabel: 'Faster time to production', label: 'Deployment acceleration' },
      { value: '99.9%', valueLabel: 'Governance compliance', label: 'Audit readiness' },
    ],
  },
  challenges: [
    {
      id: 'pilot-stall',
      title: 'Pilot Paralysis',
      description:
        'AI pilots stall in production — models drift, outputs are not auditable, and teams cannot govern them effectively.',
    },
    {
      id: 'observability',
      title: 'Lack of Observability',
      description:
        'No visibility into model performance, data quality, or business impact after deployment.',
    },
    {
      id: 'governance',
      title: 'Governance Gaps',
      description:
        'Regulatory requirements and internal policies are not built into the AI development lifecycle.',
    },
    {
      id: 'scalability',
      title: 'Scaling Complexity',
      description:
        'Moving from prototype to production-scale systems introduces reliability and performance challenges.',
    },
  ],
  capabilities: [
    {
      id: 'agentic-systems',
      title: 'Agentic Systems',
      description:
        'Design and deploy autonomous AI agents that can reason, plan, and execute complex tasks with human oversight.',
      icon: 'Bot',
    },
    {
      id: 'rag-architecture',
      title: 'RAG Architecture',
      description:
        'Build retrieval-augmented generation systems that ground AI responses in your enterprise knowledge base.',
      icon: 'Database',
    },
    {
      id: 'mlops',
      title: 'MLOps Pipeline',
      description:
        'Implement CI/CD for machine learning with automated testing, validation, and deployment pipelines.',
      icon: 'GitBranch',
    },
    {
      id: 'evaluation',
      title: 'Evaluation Harness',
      description:
        'Create comprehensive testing frameworks for AI models including accuracy, bias, and performance metrics.',
      icon: 'TestTube',
    },
    {
      id: 'observability',
      title: 'AI Observability',
      description:
        'Monitor model performance, data drift, and business impact with real-time dashboards and alerts.',
      icon: 'Activity',
    },
    {
      id: 'human-in-loop',
      title: 'Human-in-the-Loop',
      description:
        'Implement review workflows and intervention points to ensure quality and compliance in AI decisions.',
      icon: 'Users',
    },
  ],
  architecture: {
    title: 'Reference Architecture',
    description:
      'Our AI Engineering reference architecture provides a production-ready foundation for enterprise AI systems.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'AI Engineering reference architecture diagram showing data flow, model training, and deployment pipeline',
  },
  technologies: [
    { id: 'llm', name: 'LLM Integration', category: 'ai' },
    { id: 'rag', name: 'RAG Architecture', category: 'ai' },
    { id: 'mlops', name: 'MLOps', category: 'devops' },
    { id: 'vector', name: 'Vector Databases', category: 'database' },
    { id: 'langchain', name: 'LangChain', category: 'framework' },
    { id: 'llamaindex', name: 'LlamaIndex', category: 'framework' },
    { id: 'pytorch', name: 'PyTorch', category: 'ai' },
    { id: 'tensorflow', name: 'TensorFlow', category: 'ai' },
    { id: 'kubeflow', name: 'Kubeflow', category: 'devops' },
    { id: 'mlflow', name: 'MLflow', category: 'devops' },
    { id: 'openai', name: 'OpenAI', category: 'ai' },
    { id: 'anthropic', name: 'Anthropic', category: 'ai' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description:
      'Our six-stage delivery process ensures predictable outcomes and continuous value delivery for AI initiatives.',
    stages: [
      {
        name: 'Discover',
        description: 'Understand your AI maturity, use cases, and governance requirements.',
      },
      {
        name: 'Architect',
        description: 'Design reference architectures aligned to your enterprise standards and compliance needs.',
      },
      {
        name: 'Build',
        description: 'Develop production-grade AI systems with automated testing and CI/CD pipelines.',
      },
      {
        name: 'Deploy',
        description: 'Execute zero-downtime rollouts with observability and monitoring in place.',
      },
      {
        name: 'Operate',
        description: 'Run and support your AI systems with SRE principles and continuous evaluation.',
      },
      {
        name: 'Optimize',
        description: 'Continuously improve based on model performance, business metrics, and feedback.',
      },
    ],
  },
  outcomes: [
    {
      id: 'roi',
      title: 'Measurable ROI',
      description:
        'Deploy AI with clear business impact metrics and return on investment tracking.',
      metric: '40% average cost reduction',
    },
    {
      id: 'governance',
      title: 'Enterprise Governance',
      description:
        'Built-in compliance, audit trails, and policy enforcement for regulated environments.',
      metric: '100% audit compliance',
    },
    {
      id: 'reliability',
      title: 'Production Reliability',
      description:
        'Robust systems with monitoring, alerting, and automated remediation capabilities.',
      metric: '99.9% uptime',
    },
    {
      id: 'scalability',
      title: 'Scalable Architecture',
      description:
        'Systems that grow with your business needs and handle increasing complexity.',
      metric: '10x performance at scale',
    },
  ],
  caseStudies: [
    {
      id: 'financial-services',
      title: 'AI-Powered Risk Assessment',
      client: 'Global Financial Services Firm',
      industry: 'Financial Services',
      challenge:
        'Manual risk assessment processes were slow, inconsistent, and unable to scale with regulatory changes.',
      solution:
        'Implemented an agentic AI system with RAG architecture for real-time risk analysis, integrated with existing compliance workflows.',
      outcome:
        'Reduced risk assessment time by 75% while improving accuracy and maintaining full audit compliance.',
      technologies: ['LLM Integration', 'RAG Architecture', 'MLOps', 'Vector Databases'],
      duration: '6 months',
    },
    {
      id: 'healthcare',
      title: 'Clinical Decision Support',
      client: 'Regional Healthcare Network',
      industry: 'Healthcare',
      challenge:
        'Clinicians needed real-time access to patient data insights while maintaining HIPAA compliance.',
      solution:
        'Built a secure, on-premise AI system with human-in-the-loop controls and comprehensive observability.',
      outcome:
        'Improved diagnostic accuracy by 30% and reduced documentation time by 50%.',
      technologies: ['LLM Integration', 'Human-in-the-Loop', 'AI Observability'],
      duration: '4 months',
    },
  ],
  faqs: [
    {
      id: 'compliance',
      question: 'How do you ensure AI compliance in regulated industries?',
      answer:
        'We embed compliance controls into the development lifecycle, including audit trails, model versioning, and policy enforcement. Our reference architectures are designed to meet ISO 27001, SOC 2, and industry-specific requirements.',
    },
    {
      id: 'timeline',
      question: 'What is the typical timeline for AI deployment?',
      answer:
        'Our accelerated delivery process typically delivers production-ready AI systems in 3-6 months, depending on complexity and data readiness. We focus on quick wins while building scalable foundations.',
    },
    {
      id: 'governance',
      question: 'How do you handle model governance and drift?',
      answer:
        'We implement comprehensive MLOps pipelines with automated monitoring for data drift, model performance, and business impact. Alerts and remediation workflows ensure issues are caught before they affect operations.',
    },
    {
      id: 'integration',
      question: 'Can you integrate with our existing systems?',
      answer:
        'Yes, our architectures are designed for seamless integration with existing enterprise systems, APIs, and data sources. We follow your security protocols and integration standards.',
    },
  ],
};