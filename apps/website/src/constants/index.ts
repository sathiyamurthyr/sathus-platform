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
  { label: 'Solutions', href: '#solutions', hasMega: true },
  { label: 'Industries', href: '#industries', hasMega: false },
  { label: 'Products', href: '#products', hasMega: true },
  { label: 'Technology', href: '#technology', hasMega: true },
  { label: 'Resources', href: '#insights', hasMega: true },
  { label: 'Company', href: '#why', hasMega: true },
  { label: 'Trust Center', href: '#trust-center', hasMega: false },
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
            { title: 'Agent Platforms', description: 'Multi-agent orchestration', href: '#solutions', icon: 'Bot' },
            { title: 'Evaluation Harnesses', description: 'Automated quality gates', href: '#solutions', icon: 'CheckCircle' },
            { title: 'RAG Pipelines', description: 'Context-aware retrieval', href: '#solutions', icon: 'Database' },
            { title: 'MLOps at Scale', description: 'Continuous training & deploy', href: '#solutions', icon: 'GitMerge' },
          ],
          featured: {
            title: 'Sathus AI 2.0',
            description: 'Enterprise agent platform with built-in evaluation, guardrails, and observability.',
            href: '#products',
            tag: 'New Release',
          },
        },
        {
          title: 'Data Engineering',
          icon: 'BarChart3',
          description: 'Governed lakehouses, streaming, and real-time analytics.',
          items: [
            { title: 'Lakehouse Architecture', description: 'Unified batch & streaming', href: '#platform', icon: 'Layers' },
            { title: 'Stream Processing', description: 'Kafka, Flink, Spark', href: '#platform', icon: 'Activity' },
            { title: 'Data Governance', description: 'Quality, lineage, privacy', href: '#trust-center', icon: 'ShieldCheck' },
            { title: 'Analytics Layer', description: 'BI, ML, and operational', href: '#platform', icon: 'TrendingUp' },
          ],
        },
        {
          title: 'Enterprise Applications',
          icon: 'LayoutGrid',
          description: 'Domain-driven products built for scale and compliance.',
          items: [
            { title: 'Product Engineering', description: 'End-to-end delivery', href: '#products', icon: 'Rocket' },
            { title: 'Legacy Modernization', description: 'Re-platform without risk', href: '#technology', icon: 'RefreshCw' },
            { title: 'API & Integration', description: 'Event-driven ecosystems', href: '#technology', icon: 'Network' },
            { title: 'Low-Code Platforms', description: 'Accelerated delivery', href: '#products', icon: 'Zap' },
          ],
          featured: {
            title: 'Case Study: FinTech',
            description: 'How we modernized a core banking platform for 12M+ users.',
            href: '#insights',
            tag: 'Case Study',
          },
        },
        {
          title: 'Recent Updates',
          icon: 'Newspaper',
          description: 'Latest insights and announcements.',
          items: [
            { title: 'Zero-Trust SaaS Architecture', description: 'Reference architecture', href: '#trust-center', icon: 'FileText' },
            { title: 'Enterprise AI Summit 2025', description: 'Bengaluru — 18 Sept', href: '#insights', icon: 'Calendar' },
            { title: 'Sathus AI 2.0 GA', description: 'Evaluation harnesses included', href: '#products', icon: 'Sparkles' },
            { title: 'We’re Hiring', description: 'Principal AI Engineers', href: '#why', icon: 'Briefcase' },
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
            { title: 'Sathus AI', description: 'Enterprise agent platform', href: '#products', icon: 'Bot', badge: 'GA' },
            { title: 'Memomes Cloud', description: 'Document intelligence', href: '#products', icon: 'FileSearch' },
            { title: 'SocialHub MCP', description: 'Agent connectivity gateway', href: '#products', icon: 'Share2' },
            { title: 'OneHealthID', description: 'Healthcare identity & consent', href: '#products', icon: 'HeartPulse' },
          ],
          featured: {
            title: 'Sathus AI Platform',
            description: 'Deploy, evaluate, and govern AI agents with enterprise-grade reliability.',
            href: '#products',
            tag: 'Featured',
          },
        },
        {
          title: 'Explore',
          icon: 'Compass',
          description: 'All products, research, and architecture.',
          items: [
            { title: 'All Products', description: 'GA, beta & research', href: '#products', icon: 'Grid3x3' },
            { title: 'Future Products', description: 'Active research pipeline', href: '#products', icon: 'FlaskConical' },
            { title: 'Architecture', description: 'How it composes', href: '#platform', icon: 'Workflow' },
            { title: 'Trust Center', description: 'Security & compliance', href: '#trust-center', icon: 'ShieldCheck' },
          ],
        },
        {
          title: 'By Use Case',
          icon: 'Target',
          description: 'Solutions tailored to your domain.',
          items: [
            { title: 'Financial Services', description: 'Risk, compliance, trading', href: '#industries', icon: 'Landmark' },
            { title: 'Healthcare', description: 'Clinical & operational', href: '#industries', icon: 'Stethoscope' },
            { title: 'Life Sciences', description: 'R&D acceleration', href: '#industries', icon: 'Microscope' },
            { title: 'Manufacturing', description: 'Smart factories & IoT', href: '#industries', icon: 'Factory' },
          ],
        },
        {
          title: 'Case Studies',
          icon: 'BookOpen',
          description: 'Real-world impact and results.',
          items: [
            { title: 'Core Banking Modernization', description: '12M+ users migrated', href: '#insights', icon: 'Building2' },
            { title: 'Clinical Data Platform', description: 'FHIR-native lakehouse', href: '#insights', icon: 'HeartPulse' },
            { title: 'Supply Chain Resilience', description: 'Real-time visibility', href: '#insights', icon: 'Truck' },
            { title: 'AI Agent Deployment', description: 'Production at scale', href: '#insights', icon: 'Bot' },
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
            { title: 'Python', description: 'ML, data & APIs', href: '#technology', icon: 'FileCode' },
            { title: '.NET', description: 'Enterprise line-of-business', href: '#technology', icon: 'Server' },
            { title: 'React', description: 'Shared component systems', href: '#technology', icon: 'Component' },
            { title: 'Next.js', description: 'Enterprise web platforms', href: '#technology', icon: 'Globe' },
          ],
        },
        {
          title: 'Data, Cloud & Infra',
          icon: 'Cloud',
          description: 'Cloud-native foundations and data platforms.',
          items: [
            { title: 'Databricks & Spark', description: 'Lakehouse & processing', href: '#technology', icon: 'Zap' },
            { title: 'Kafka & Snowflake', description: 'Streaming & analytics', href: '#technology', icon: 'Share2' },
            { title: 'Azure & AWS', description: 'Cloud-native foundations', href: '#technology', icon: 'Cloud' },
            { title: 'Kubernetes', description: 'Portable orchestration', href: '#technology', icon: 'Container' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Guides, references, and patterns.',
          items: [
            { title: 'Architecture Patterns', description: 'Reference designs', href: '#platform', icon: 'Workflow' },
            { title: 'API Documentation', description: 'REST, GraphQL, gRPC', href: '#platform', icon: 'FileText' },
            { title: 'Engineering Blog', description: 'Practices & postmortems', href: '#insights', icon: 'PenTool' },
            { title: 'Open Source', description: 'GitHub & contributions', href: siteConfig.links.github!, icon: 'GitHub' },
          ],
          featured: {
            title: 'Platform Overview',
            description: 'How Sathus AI, Memomes, and SocialHub compose into a unified enterprise platform.',
            href: '#platform',
            tag: 'Architecture',
          },
        },
        {
          title: 'Quick Links',
          icon: 'Link',
          description: 'Frequently referenced resources.',
          items: [
            { title: 'Status Page', description: 'Platform health', href: '#', icon: 'Activity' },
            { title: 'Support Portal', description: 'Tickets & SLAs', href: '#', icon: 'LifeBuoy' },
            { title: 'Partner Network', description: 'Technology partners', href: '#why', icon: 'Users' },
            { title: 'Contact Engineering', description: 'Talk to the team', href: '#final-cta', icon: 'Mail' },
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
            { title: 'Engineering', description: 'Practices & postmortems', href: '#insights', icon: 'Code2' },
            { title: 'AI & Agents', description: 'Evaluation & guardrails', href: '#insights', icon: 'Bot' },
            { title: 'Data Platforms', description: 'Lakehouse to decision', href: '#insights', icon: 'BarChart3' },
            { title: 'Architecture', description: 'Reference designs', href: '#insights', icon: 'Workflow' },
          ],
        },
        {
          title: 'Case Studies',
          icon: 'Briefcase',
          description: 'Client success stories and impact.',
          items: [
            { title: 'FinTech Core Banking', description: '12M+ user migration', href: '#insights', icon: 'Landmark' },
            { title: 'Healthcare Data Platform', description: 'FHIR-native lakehouse', href: '#insights', icon: 'HeartPulse' },
            { title: 'Supply Chain Visibility', description: 'Real-time analytics', href: '#insights', icon: 'Truck' },
            { title: 'AI Agent Production', description: 'Enterprise deployment', href: '#insights', icon: 'Rocket' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Technical references and getting started.',
          items: [
            { title: 'Getting Started', description: 'Onboarding guides', href: '#platform', icon: 'PlayCircle' },
            { title: 'API Reference', description: 'REST & GraphQL', href: '#platform', icon: 'FileCode' },
            { title: 'SDKs & Libraries', description: 'Client integrations', href: '#platform', icon: 'Package' },
            { title: 'Release Notes', description: 'Changelog & updates', href: '#insights', icon: 'Newspaper' },
          ],
          featured: {
            title: 'Trust Center',
            description: 'Security posture, compliance frameworks, and responsible AI principles.',
            href: '#trust-center',
            tag: 'Security',
          },
        },
        {
          title: 'Company',
          icon: 'Building2',
          description: 'About Sathus and how to engage.',
          items: [
            { title: 'Our Approach', description: 'Process & methodology', href: '#why', icon: 'Target' },
            { title: 'Careers', description: 'Open roles & culture', href: '#why', icon: 'Users' },
            { title: 'Newsroom', description: 'Announcements', href: '#insights', icon: 'Megaphone' },
            { title: 'Contact', description: 'Talk to engineering', href: '#final-cta', icon: 'Mail' },
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
            { title: 'Our Approach', description: 'Process & methodology', href: '#why', icon: 'Target' },
            { title: 'Industries', description: 'Who we serve', href: '#industries', icon: 'Factory' },
            { title: 'Why Sathus', description: 'Pillars & track record', href: '#why', icon: 'Award' },
            { title: 'Leadership', description: 'Executive team', href: '#why', icon: 'Users' },
          ],
        },
        {
          title: 'Engage',
          icon: 'Handshake',
          description: 'Ways to work with us.',
          items: [
            { title: 'Book a Strategy Call', description: 'Working session', href: '#final-cta', icon: 'Calendar' },
            { title: 'Trust Center', description: 'Security posture', href: '#trust-center', icon: 'ShieldCheck' },
            { title: 'Newsroom', description: 'Latest updates', href: '#insights', icon: 'Newspaper' },
            { title: 'Contact', description: 'Reach the team', href: '#final-cta', icon: 'Mail' },
          ],
        },
        {
          title: 'Careers',
          icon: 'Users',
          description: 'Join our embedded squads.',
          items: [
            { title: 'Open Roles', description: 'Principal AI Engineers', href: '#why', icon: 'Briefcase' },
            { title: 'Engineering Culture', description: 'How we build', href: '#why', icon: 'Heart' },
            { title: 'Benefits & Perks', description: 'What we offer', href: '#why', icon: 'Gift' },
            { title: 'Diversity & Inclusion', description: 'Our commitment', href: '#why', icon: 'Users' },
          ],
          featured: {
            title: 'We’re Hiring',
            description: 'Principal AI Engineers and Data Platform Architects — join our embedded squads.',
            href: '#why',
            tag: 'Careers',
          },
        },
        {
          title: 'Recent Updates',
          icon: 'Newspaper',
          description: 'Latest company news.',
          items: [
            { title: 'Enterprise AI Summit', description: 'Bengaluru — 18 Sept', href: '#insights', icon: 'Calendar' },
            { title: 'Sathus AI 2.0 Launch', description: 'GA with evaluation harnesses', href: '#products', icon: 'Sparkles' },
            { title: 'New Office: Bengaluru', description: 'Expanding our presence', href: '#why', icon: 'MapPin' },
            { title: 'Partner Ecosystem', description: 'Technology alliances', href: '#why', icon: 'Share2' },
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
      { title: 'AI Engineering', href: '#solutions' },
      { title: 'Data Engineering', href: '#platform' },
      { title: 'Enterprise Applications', href: '#products' },
      { title: 'Cloud Modernization', href: '#technology' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { title: 'FinTech', href: '#industries' },
      { title: 'Financial Services', href: '#industries' },
      { title: 'Life Sciences', href: '#industries' },
      { title: 'Healthcare', href: '#industries' },
    ],
  },
  {
    title: 'Products',
    links: [
      { title: 'Sathus AI', href: '#products' },
      { title: 'Memomes Cloud', href: '#products' },
      { title: 'SocialHub MCP', href: '#products' },
      { title: 'OneHealthID', href: '#products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'Our Approach', href: '#why' },
      { title: 'Careers', href: '#why' },
      { title: 'Newsroom', href: '#insights' },
      { title: 'Contact', href: '#final-cta' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Insights', href: '#insights' },
      { title: 'Engineering', href: '#insights' },
      { title: 'Architecture', href: '#insights' },
      { title: 'Trust Center', href: '#trust-center' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { title: 'Security', href: '#trust-center' },
      { title: 'Privacy', href: '#trust-center' },
      { title: 'Compliance', href: '#trust-center' },
      { title: 'Responsible AI', href: '#trust-center' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '#' },
      { title: 'Terms of Service', href: '#' },
      { title: 'Cookie Policy', href: '#' },
      { title: 'Accessibility', href: '#' },
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
    href: '#products',
  },
  {
    tag: 'Hiring',
    icon: 'Briefcase',
    text: 'Principal AI Engineers and Data Platform Architects — join our embedded squads.',
    href: '#why',
  },
  {
    tag: 'Platform',
    icon: 'Megaphone',
    text: 'New reference architecture: zero-trust SaaS for regulated industries.',
    href: '#trust-center',
  },
  {
    tag: 'Event',
    icon: 'CalendarDays',
    text: 'Meet the team at the Enterprise AI Summit, Bengaluru — 18 September.',
    href: '#insights',
  },
  {
    tag: 'Blog',
    icon: 'Newspaper',
    text: 'How we migrated a core banking platform to cloud-native with zero downtime.',
    href: '#insights',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Sathus AI 2.0 Released',
    description: 'Enterprise agent platform with evaluation harnesses is now GA.',
    time: '2 hours ago',
    read: false,
    href: '#products',
  },
  {
    id: '2',
    title: 'Enterprise AI Summit',
    description: 'Join us in Bengaluru on 18 September.',
    time: '1 day ago',
    read: false,
    href: '#insights',
  },
  {
    id: '3',
    title: 'New Case Study',
    description: 'Core banking modernization for 12M+ users.',
    time: '3 days ago',
    read: true,
    href: '#insights',
  },
];

export const searchResults: SearchResult[] = [
  { title: 'Sathus AI Platform', description: 'Enterprise agent platform', href: '#products', category: 'Products' },
  { title: 'Memomes Cloud', description: 'Document intelligence', href: '#products', category: 'Products' },
  { title: 'Data Engineering', description: 'Governed lakehouses & streaming', href: '#platform', category: 'Solutions' },
  { title: 'Cloud Modernization', description: 'Zero-downtime re-platforming', href: '#technology', category: 'Technology' },
  { title: 'Trust Center', description: 'Security & compliance', href: '#trust-center', category: 'Company' },
  { title: 'Careers', description: 'Join our team', href: '#why', category: 'Company' },
  { title: 'Engineering Blog', description: 'Practices & postmortems', href: '#insights', category: 'Resources' },
  { title: 'API Documentation', description: 'REST & GraphQL references', href: '#platform', category: 'Resources' },
  { title: 'Case Studies', description: 'Client success stories', href: '#insights', category: 'Resources' },
  { title: 'Architecture Patterns', description: 'Reference designs', href: '#platform', category: 'Technology' },
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
