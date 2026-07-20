import { SiteConfig, NavItem, MegaMenuSection, FooterSection, NotificationItem, SearchResult, CommandAction } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Sathus Technology',
  url: 'https://sathus.technology',
  description:
    'Sathus Technology engineers enterprise AI, data platforms, and cloud-native software for regulated industries.',
  links: {
    github: 'https://github.com/sathustechnology',
    twitter: 'https://twitter.com/sathustech',
    linkedin: 'https://linkedin.com/company/sathustechnology',
  },
};

export const navItems: NavItem[] = [
  { label: 'Solutions', href: '/solutions', hasMega: true },
  { label: 'Industries', href: '/industries', hasMega: false },
  { label: 'Products', href: '/products', hasMega: true },
  { label: 'Technology', href: '/solutions', hasMega: true },
  { label: 'Resources', href: '/resources', hasMega: true },
  { label: 'Company', href: '/company', hasMega: true },
  { label: 'Trust Center', href: '/trust', hasMega: false },
  { label: 'Legal', href: '/legal', hasMega: false },
];

export const megaMenuSections: Record<string, MegaMenuSection[]> = {
  Solutions: [
    {
      title: 'Solutions',
      description: 'Enterprise-grade capabilities for AI, data, and cloud modernization.',
      columns: [
        {
          title: 'AI Engineering',
          icon: 'Bot',
          description: 'Agentic systems, evaluation harnesses, and production guardrails.',
          items: [
            { title: 'Agent Platforms', description: 'Multi-agent orchestration', href: '/solutions/ai-engineering', icon: 'Bot' },
            { title: 'Evaluation Harnesses', description: 'Automated quality gates', href: '/solutions/ai-engineering', icon: 'CheckCircle' },
            { title: 'RAG Pipelines', description: 'Context-aware retrieval', href: '/solutions/ai-engineering', icon: 'Database' },
            { title: 'MLOps at Scale', description: 'Continuous training & deploy', href: '/solutions/ai-engineering', icon: 'GitMerge' },
          ],
          featured: {
            title: 'Sathus AI 2.0',
            description: 'Enterprise agent platform with built-in evaluation, guardrails, and observability.',
            href: '/products/sathus-ai',
            tag: 'New Release',
          },
        },
        {
          title: 'Data Engineering',
          icon: 'BarChart3',
          description: 'Governed lakehouses, streaming, and real-time analytics.',
          items: [
            { title: 'Lakehouse Architecture', description: 'Unified batch & streaming', href: '/solutions/data-engineering', icon: 'Layers' },
            { title: 'Stream Processing', description: 'Kafka, Flink, Spark', href: '/solutions/data-engineering', icon: 'Activity' },
            { title: 'Data Governance', description: 'Quality, lineage, privacy', href: '/trust/security', icon: 'ShieldCheck' },
            { title: 'Analytics Layer', description: 'BI, ML, and operational', href: '/solutions/data-engineering', icon: 'TrendingUp' },
          ],
        },
        {
          title: 'Enterprise Applications',
          icon: 'LayoutGrid',
          description: 'Domain-driven products built for scale and compliance.',
          items: [
            { title: 'Product Engineering', description: 'End-to-end delivery', href: '/solutions/product-engineering', icon: 'Rocket' },
            { title: 'Legacy Modernization', description: 'Re-platform without risk', href: '/solutions/cloud-modernization', icon: 'RefreshCw' },
            { title: 'API & Integration', description: 'Event-driven ecosystems', href: '/solutions/enterprise-applications', icon: 'Network' },
            { title: 'Generative AI', description: 'Custom LLM workflows', href: '/solutions/genai', icon: 'Zap' },
          ],
          featured: {
            title: 'Case Study: FinTech',
            description: 'How we modernized a core banking platform for 12M+ users.',
            href: '/case-studies/core-banking-modernization',
            tag: 'Case Study',
          },
        },
        {
          title: 'Recent Updates',
          icon: 'Newspaper',
          description: 'Latest insights and announcements.',
          items: [
            { title: 'Zero-Trust SaaS Architecture', description: 'Reference architecture', href: '/trust/security', icon: 'FileText' },
            { title: 'Enterprise AI Summit 2025', description: 'Bengaluru — 18 Sept', href: '/resources/blog', icon: 'Calendar' },
            { title: 'Sathus AI 2.0 GA', description: 'Evaluation harnesses included', href: '/products/sathus-ai', icon: 'Sparkles' },
            { title: 'We’re Hiring', description: 'Principal AI Engineers', href: '/company/careers', icon: 'Briefcase' },
          ],
        },
      ],
    },
  ],
  Products: [
    {
      title: 'Products',
      description: 'Platform and portfolio engineered for regulated industries.',
      columns: [
        {
          title: 'Platform & Portfolio',
          icon: 'Box',
          description: 'Core products powering enterprise AI and data.',
          items: [
            { title: 'Sathus AI', description: 'Enterprise agent platform', href: '/products/sathus-ai', icon: 'Bot', badge: 'GA' },
            { title: 'Memomes Cloud', description: 'Document intelligence', href: '/products/memomes-cloud', icon: 'FileSearch' },
            { title: 'SocialHub MCP', description: 'Agent connectivity gateway', href: '/products/socialhub-mcp', icon: 'Share2' },
            { title: 'OneHealthID', description: 'Healthcare identity & consent', href: '/products/onehealthid', icon: 'HeartPulse' },
          ],
          featured: {
            title: 'Sathus AI Platform',
            description: 'Deploy, evaluate, and govern AI agents with enterprise-grade reliability.',
            href: '/products/sathus-ai',
            tag: 'Featured',
          },
        },
        {
          title: 'Explore',
          icon: 'Compass',
          description: 'All products, research, and architecture.',
          items: [
            { title: 'All Products', description: 'GA, beta & research', href: '/products', icon: 'Grid3x3' },
            { title: 'Solutions Overview', description: 'AI & data platforms', href: '/solutions', icon: 'FlaskConical' },
            { title: 'Architecture', description: 'How it composes', href: '/solutions/ai-engineering', icon: 'Workflow' },
            { title: 'Trust Center', description: 'Security & compliance', href: '/trust', icon: 'ShieldCheck' },
          ],
        },
        {
          title: 'By Use Case',
          icon: 'Target',
          description: 'Solutions tailored to your domain.',
          items: [
            { title: 'Financial Services', description: 'Risk, compliance, trading', href: '/industries/financial-services', icon: 'Landmark' },
            { title: 'Healthcare', description: 'Clinical & operational', href: '/industries/healthcare', icon: 'Stethoscope' },
            { title: 'Life Sciences', description: 'R&D acceleration', href: '/industries/life-sciences', icon: 'Microscope' },
            { title: 'FinTech', description: 'Modern payment rails', href: '/industries/fintech', icon: 'Zap' },
          ],
        },
        {
          title: 'Case Studies',
          icon: 'BookOpen',
          description: 'Real-world impact and results.',
          items: [
            { title: 'Core Banking Modernization', description: '12M+ users migrated', href: '/case-studies/core-banking-modernization', icon: 'Building2' },
            { title: 'Clinical Data Platform', description: 'FHIR-native lakehouse', href: '/case-studies/fhir-clinical-data-platform', icon: 'HeartPulse' },
            { title: 'Supply Chain Resilience', description: 'Real-time visibility', href: '/case-studies/supply-chain-resilience', icon: 'Truck' },
            { title: 'AI Agent Deployment', description: 'Production at scale', href: '/case-studies/enterprise-ai-agent-platform', icon: 'Bot' },
          ],
        },
      ],
    },
  ],
  Technology: [
    {
      title: 'Technology',
      description: 'Languages, frameworks, and infrastructure we trust.',
      columns: [
        {
          title: 'Languages & Frameworks',
          icon: 'Code2',
          description: 'Polyglot engineering for every layer.',
          items: [
            { title: 'Python', description: 'ML, data & APIs', href: '/solutions/ai-engineering', icon: 'FileCode' },
            { title: '.NET', description: 'Enterprise line-of-business', href: '/solutions/enterprise-applications', icon: 'Server' },
            { title: 'React', description: 'Shared component systems', href: '/solutions/product-engineering', icon: 'Component' },
            { title: 'Next.js', description: 'Enterprise web platforms', href: '/solutions/product-engineering', icon: 'Globe' },
          ],
        },
        {
          title: 'Data, Cloud & Infra',
          icon: 'Cloud',
          description: 'Cloud-native foundations and data platforms.',
          items: [
            { title: 'Databricks & Spark', description: 'Lakehouse & processing', href: '/solutions/data-engineering', icon: 'Zap' },
            { title: 'Kafka & Snowflake', description: 'Streaming & analytics', href: '/solutions/data-engineering', icon: 'Share2' },
            { title: 'Azure & AWS', description: 'Cloud-native foundations', href: '/solutions/cloud-modernization', icon: 'Cloud' },
            { title: 'Kubernetes', description: 'Portable orchestration', href: '/solutions/cloud-modernization', icon: 'Container' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Guides, references, and patterns.',
          items: [
            { title: 'Architecture Patterns', description: 'Reference designs', href: '/solutions/ai-engineering', icon: 'Workflow' },
            { title: 'API Documentation', description: 'REST, GraphQL, gRPC', href: '/solutions/enterprise-applications', icon: 'FileText' },
            { title: 'Engineering Blog', description: 'Practices & postmortems', href: '/resources/blog', icon: 'PenTool' },
            { title: 'Open Source', description: 'GitHub & contributions', href: siteConfig.links.github!, icon: 'GitHub' },
          ],
          featured: {
            title: 'Platform Overview',
            description: 'How Sathus AI, Memomes, and SocialHub compose into a unified enterprise platform.',
            href: '/products',
            tag: 'Architecture',
          },
        },
        {
          title: 'Quick Links',
          icon: 'Link',
          description: 'Frequently referenced resources.',
          items: [
            { title: 'Trust Center', description: 'Security & compliance', href: '/trust', icon: 'ShieldCheck' },
            { title: 'Support Portal', description: 'Tickets & SLAs', href: '/contact', icon: 'LifeBuoy' },
            { title: 'About Us', description: 'Company & vision', href: '/company/about', icon: 'Users' },
            { title: 'Contact Engineering', description: 'Talk to the team', href: '/contact', icon: 'Mail' },
          ],
        },
      ],
    },
  ],
  Resources: [
    {
      title: 'Resources',
      description: 'Insights, documentation, and company news.',
      columns: [
        {
          title: 'Insights',
          icon: 'Lightbulb',
          description: 'Engineering, AI, and data perspectives.',
          items: [
            { title: 'Engineering', description: 'Practices & postmortems', href: '/resources/blog', icon: 'Code2' },
            { title: 'AI & Agents', description: 'Evaluation & guardrails', href: '/resources/insights', icon: 'Bot' },
            { title: 'Data Platforms', description: 'Lakehouse to decision', href: '/solutions/data-engineering', icon: 'BarChart3' },
            { title: 'Architecture', description: 'Reference designs', href: '/solutions/ai-engineering', icon: 'Workflow' },
          ],
        },
        {
          title: 'Case Studies',
          icon: 'Briefcase',
          description: 'Client success stories and impact.',
          items: [
            { title: 'FinTech Core Banking', description: '12M+ user migration', href: '/case-studies/core-banking-modernization', icon: 'Landmark' },
            { title: 'Healthcare Data Platform', description: 'FHIR-native lakehouse', href: '/case-studies/fhir-clinical-data-platform', icon: 'HeartPulse' },
            { title: 'Supply Chain Visibility', description: 'Real-time analytics', href: '/case-studies/supply-chain-resilience', icon: 'Truck' },
            { title: 'AI Agent Production', description: 'Enterprise deployment', href: '/case-studies/enterprise-ai-agent-platform', icon: 'Rocket' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Technical references and getting started.',
          items: [
            { title: 'Getting Started', description: 'Onboarding guides', href: '/resources', icon: 'PlayCircle' },
            { title: 'API Reference', description: 'REST & GraphQL', href: '/solutions/enterprise-applications', icon: 'FileCode' },
            { title: 'SDKs & Libraries', description: 'Client integrations', href: '/products', icon: 'Package' },
            { title: 'Release Notes', description: 'Changelog & updates', href: '/resources/blog', icon: 'Newspaper' },
          ],
          featured: {
            title: 'Trust Center',
            description: 'Security posture, compliance frameworks, and responsible AI principles.',
            href: '/trust',
            tag: 'Security',
          },
        },
        {
          title: 'Company',
          icon: 'Building2',
          description: 'About Sathus and how to engage.',
          items: [
            { title: 'Our Approach', description: 'Process & methodology', href: '/company/about', icon: 'Target' },
            { title: 'Careers', description: 'Open roles & culture', href: '/company/careers', icon: 'Users' },
            { title: 'Newsroom', description: 'Announcements', href: '/resources/blog', icon: 'Megaphone' },
            { title: 'Contact', description: 'Talk to engineering', href: '/company/contact', icon: 'Mail' },
          ],
        },
      ],
    },
  ],
  Company: [
    {
      title: 'Company',
      description: 'Our story, team, and how we work.',
      columns: [
        {
          title: 'About',
          icon: 'Building2',
          description: 'Who we are and why we exist.',
          items: [
            { title: 'Our Approach', description: 'Process & methodology', href: '/company/about', icon: 'Target' },
            { title: 'Industries', description: 'Who we serve', href: '/industries', icon: 'Factory' },
            { title: 'Why Sathus', description: 'Pillars & track record', href: '/company/about', icon: 'Award' },
            { title: 'Leadership', description: 'Executive team', href: '/company/leadership', icon: 'Users' },
          ],
        },
        {
          title: 'Engage',
          icon: 'Handshake',
          description: 'Ways to work with us.',
          items: [
            { title: 'Book a Strategy Call', description: 'Working session', href: '/book-strategy-session', icon: 'Calendar' },
            { title: 'Trust Center', description: 'Security posture', href: '/trust', icon: 'ShieldCheck' },
            { title: 'Newsroom', description: 'Latest updates', href: '/resources/blog', icon: 'Newspaper' },
            { title: 'Contact', description: 'Reach the team', href: '/company/contact', icon: 'Mail' },
          ],
        },
        {
          title: 'Careers',
          icon: 'Users',
          description: 'Join our embedded squads.',
          items: [
            { title: 'Open Roles', description: 'Principal AI Engineers', href: '/company/careers', icon: 'Briefcase' },
            { title: 'Engineering Culture', description: 'How we build', href: '/company/careers', icon: 'Heart' },
            { title: 'Benefits & Perks', description: 'What we offer', href: '/company/careers', icon: 'Gift' },
            { title: 'Diversity & Inclusion', description: 'Our commitment', href: '/company/about', icon: 'Users' },
          ],
          featured: {
            title: 'We’re Hiring',
            description: 'Principal AI Engineers and Data Platform Architects — join our embedded squads.',
            href: '/company/careers',
            tag: 'Careers',
          },
        },
        {
          title: 'Recent Updates',
          icon: 'Newspaper',
          description: 'Latest company news.',
          items: [
            { title: 'Enterprise AI Summit', description: 'Bengaluru — 18 Sept', href: '/resources/blog', icon: 'Calendar' },
            { title: 'Sathus AI 2.0 Launch', description: 'GA with evaluation harnesses', href: '/products/sathus-ai', icon: 'Sparkles' },
            { title: 'New Office: Bengaluru', description: 'Expanding our presence', href: '/company/about', icon: 'MapPin' },
            { title: 'Partner Ecosystem', description: 'Technology alliances', href: '/company/about', icon: 'Share2' },
          ],
        },
      ],
    },
  ],
};

export const footerSections: FooterSection[] = [
  {
    title: 'Solutions',
    links: [
      { title: 'AI Engineering', href: '/solutions/ai-engineering' },
      { title: 'Data Engineering', href: '/solutions/data-engineering' },
      { title: 'Enterprise Applications', href: '/solutions/enterprise-applications' },
      { title: 'Cloud Modernization', href: '/solutions/cloud-modernization' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { title: 'FinTech', href: '/industries/fintech' },
      { title: 'Financial Services', href: '/industries/financial-services' },
      { title: 'Life Sciences', href: '/industries/life-sciences' },
      { title: 'Healthcare', href: '/industries/healthcare' },
    ],
  },
  {
    title: 'Products',
    links: [
      { title: 'Sathus AI', href: '/products/sathus-ai' },
      { title: 'Memomes Cloud', href: '/products/memomes-cloud' },
      { title: 'SocialHub MCP', href: '/products/socialhub-mcp' },
      { title: 'OneHealthID', href: '/products/onehealthid' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/company/about' },
      { title: 'Leadership', href: '/company/leadership' },
      { title: 'Careers', href: '/company/careers' },
      { title: 'Contact', href: '/company/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Insights', href: '/resources/insights' },
      { title: 'Engineering Blog', href: '/resources/blog' },
      { title: 'Case Studies', href: '/case-studies' },
      { title: 'Trust Center', href: '/trust' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { title: 'Security', href: '/trust/security' },
      { title: 'Privacy', href: '/trust/privacy' },
      { title: 'Compliance', href: '/trust/compliance' },
      { title: 'Responsible AI', href: '/trust/responsible-ai' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/legal/privacy-policy' },
      { title: 'Terms of Service', href: '/legal/terms' },
      { title: 'Cookie Policy', href: '/legal/cookies' },
      { title: 'Accessibility', href: '/trust' },
    ],
  },
];

export const socialLinks = [
  { name: 'GitHub', href: siteConfig.links.github, icon: 'GitHub' },
  { name: 'Twitter', href: siteConfig.links.twitter, icon: 'Twitter' },
  { name: 'LinkedIn', href: siteConfig.links.linkedin, icon: 'LinkedIn' },
];

export const announcements = [
  {
    tag: 'Launch',
    icon: 'Sparkles',
    text: 'Sathus AI 2.0 is now generally available — evaluation harnesses and guardrails included.',
    href: '/products/sathus-ai',
  },
  {
    tag: 'Hiring',
    icon: 'Briefcase',
    text: 'Principal AI Engineers and Data Platform Architects — join our embedded squads.',
    href: '/company/careers',
  },
  {
    tag: 'Platform',
    icon: 'Megaphone',
    text: 'New reference architecture: zero-trust SaaS for regulated industries.',
    href: '/trust/security',
  },
  {
    tag: 'Event',
    icon: 'CalendarDays',
    text: 'Meet the team at the Enterprise AI Summit, Bengaluru — 18 September.',
    href: '/resources/blog',
  },
  {
    tag: 'Blog',
    icon: 'Newspaper',
    text: 'How we migrated a core banking platform to cloud-native with zero downtime.',
    href: '/case-studies/core-banking-modernization',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Sathus AI 2.0 Released',
    description: 'Enterprise agent platform with evaluation harnesses is now GA.',
    time: '2 hours ago',
    read: false,
    href: '/products/sathus-ai',
  },
  {
    id: '2',
    title: 'Enterprise AI Summit',
    description: 'Join us in Bengaluru on 18 September.',
    time: '1 day ago',
    read: false,
    href: '/resources/blog',
  },
  {
    id: '3',
    title: 'New Case Study',
    description: 'Core banking modernization for 12M+ users.',
    time: '3 days ago',
    read: true,
    href: '/case-studies/core-banking-modernization',
  },
];

export const searchResults: SearchResult[] = [
  { title: 'Sathus AI Platform', description: 'Enterprise agent platform', href: '/products/sathus-ai', category: 'Products' },
  { title: 'Memomes Cloud', description: 'Document intelligence', href: '/products/memomes-cloud', category: 'Products' },
  { title: 'Data Engineering', description: 'Governed lakehouses & streaming', href: '/solutions/data-engineering', category: 'Solutions' },
  { title: 'Cloud Modernization', description: 'Zero-downtime re-platforming', href: '/solutions/cloud-modernization', category: 'Solutions' },
  { title: 'Trust Center', description: 'Security & compliance', href: '/trust', category: 'Company' },
  { title: 'Careers', description: 'Join our team', href: '/company/careers', category: 'Company' },
  { title: 'Engineering Blog', description: 'Practices & postmortems', href: '/resources/blog', category: 'Resources' },
  { title: 'API Documentation', description: 'REST & GraphQL references', href: '/solutions/enterprise-applications', category: 'Resources' },
  { title: 'Case Studies', description: 'Client success stories', href: '/case-studies', category: 'Resources' },
  { title: 'Architecture Patterns', description: 'Reference designs', href: '/solutions/ai-engineering', category: 'Technology' },
];

export const commandActions: CommandAction[] = [
  {
    id: 'search',
    label: 'Search',
    description: 'Search documentation, products, and insights',
    icon: 'Search',
    shortcut: ['⌘', 'K'],
    action: () => {},
  },
  {
    id: 'products',
    label: 'Go to Products',
    description: 'View all Sathus products',
    icon: 'Box',
    shortcut: ['G', 'P'],
    action: () => {},
  },
  {
    id: 'solutions',
    label: 'Go to Solutions',
    description: 'Explore AI, data, and cloud solutions',
    icon: 'Target',
    shortcut: ['G', 'S'],
    action: () => {},
  },
  {
    id: 'trust',
    label: 'Go to Trust Center',
    description: 'Security, compliance, and responsible AI',
    icon: 'ShieldCheck',
    shortcut: ['G', 'T'],
    action: () => {},
  },
  {
    id: 'contact',
    label: 'Contact Sales',
    description: 'Request a consultation',
    icon: 'Mail',
    shortcut: ['G', 'C'],
    action: () => {},
  },
  {
    id: 'theme',
    label: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    icon: 'Sun',
    shortcut: ['⌘', 'D'],
    action: () => {},
  },
];
