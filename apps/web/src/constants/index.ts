import { SiteConfig, NavItem, MegaMenuSection, FooterSection, NotificationItem, SearchResult, CommandAction } from '@/types';
import { companyConfig } from '@/config/company';

export const siteConfig: SiteConfig = {
  name: companyConfig.name,
  url: companyConfig.website,
  description:
    'Sathus Technology Pvt. Ltd. engineers enterprise AI, data platforms, and cloud-native software for regulated industries.',
  links: {
    linkedin: companyConfig.socials.linkedin,
    instagram: companyConfig.socials.instagram,
    github: 'https://github.com',
    twitter: 'https://twitter.com',
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
          title: 'AI & Generative Engineering',
          icon: 'Bot',
          description: 'Agentic systems, evaluation harnesses, and production guardrails.',
          items: [
            { title: 'AI Engineering', description: 'Agentic platform design', href: '/solutions/ai-engineering', icon: 'Bot' },
            { title: 'GenAI Solutions', description: 'Enterprise LLM fine-tuning', href: '/solutions/genai', icon: 'Sparkles' },
            { title: 'AI Agents & Swarms', description: 'Autonomous agent workflows', href: '/solutions/ai-agents', icon: 'Users' },
            { title: 'Enterprise RAG Systems', description: 'Grounding & hybrid vector search', href: '/solutions/rag-solutions', icon: 'Database' },
            { title: 'MCP Development', description: 'Model Context Protocol tools', href: '/solutions/mcp-development', icon: 'Network' },
          ],
          featured: {
            title: 'Sathus AI Platform',
            description: 'Enterprise agent platform with built-in evaluation, guardrails, and observability.',
            href: '/products/sathus-ai',
            tag: 'New Release',
          },
        },
        {
          title: 'Data & Lakehouse Architecture',
          icon: 'BarChart3',
          description: 'Governed lakehouses, streaming, and real-time analytics.',
          items: [
            { title: 'Data Engineering', description: 'Streaming & analytics pipelines', href: '/solutions/data-engineering', icon: 'Layers' },
            { title: 'Data Platform Modernization', description: 'Legacy warehouse to lakehouse', href: '/solutions/data-platform-modernization', icon: 'Server' },
            { title: 'Enterprise Integration', description: 'Kafka event mesh & CDC', href: '/solutions/enterprise-integration', icon: 'Activity' },
            { title: 'API Engineering', description: 'FastAPI microservices', href: '/solutions/api-development', icon: 'Code2' },
          ],
        },
        {
          title: 'Cloud & Systems Engineering',
          icon: 'LayoutGrid',
          description: 'Domain-driven products built for scale and compliance.',
          items: [
            { title: 'Cloud Engineering', description: 'Infrastructure as Code & SRE', href: '/solutions/cloud-engineering', icon: 'Cloud' },
            { title: 'Cloud Modernization', description: 'Zero-downtime re-platforming', href: '/solutions/cloud-modernization', icon: 'RefreshCw' },
            { title: 'Enterprise Applications', description: 'Domain-driven software', href: '/solutions/enterprise-applications', icon: 'LayoutGrid' },
            { title: 'Product Engineering', description: 'Embedded delivery squads', href: '/solutions/product-engineering', icon: 'Rocket' },
            { title: 'Digital Transformation', description: 'Platform operating model', href: '/solutions/digital-transformation', icon: 'Repeat' },
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
            { title: 'Model Context Protocol Guide', description: 'MCP gateway specs', href: '/solutions/mcp-development', icon: 'Network' },
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
            { title: 'Python & FastAPI', description: 'Async APIs & ML models', href: '/solutions/api-development', icon: 'FileCode' },
            { title: '.NET 9', description: 'Enterprise line-of-business', href: '/solutions/enterprise-applications', icon: 'Server' },
            { title: 'React & Next.js 15', description: 'Shared component systems', href: '/solutions/product-engineering', icon: 'Component' },
            { title: 'Model Context Protocol', description: 'Standardized tool connectivity', href: '/solutions/mcp-development', icon: 'Network' },
          ],
        },
        {
          title: 'Data, Cloud & Infra',
          icon: 'Cloud',
          description: 'Cloud-native foundations and data platforms.',
          items: [
            { title: 'Databricks & Spark', description: 'Lakehouse & processing', href: '/solutions/data-platform-modernization', icon: 'Zap' },
            { title: 'Kafka & Event Mesh', description: 'Streaming & CDC', href: '/solutions/enterprise-integration', icon: 'Share2' },
            { title: 'Azure & AWS Cloud', description: 'Multi-region landing zones', href: '/solutions/cloud-engineering', icon: 'Cloud' },
            { title: 'Qdrant & Vector DBs', description: 'Enterprise RAG indexing', href: '/solutions/rag-solutions', icon: 'Database' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Guides, references, and patterns.',
          items: [
            { title: 'API Documentation', description: 'OpenAPI & SDK guides', href: '/resources/documentation', icon: 'FileText' },
            { title: 'Knowledge Base FAQs', description: 'Technical questions & answers', href: '/resources/faqs', icon: 'HelpCircle' },
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
            { title: 'Why Sathus', description: 'Engineering pillars', href: '/company/why-sathus', icon: 'Award' },
            { title: 'Partner Ecosystem', description: 'AWS, Azure, Databricks', href: '/company/partners', icon: 'Handshake' },
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
          title: 'Insights & Knowledge',
          icon: 'Lightbulb',
          description: 'Engineering, AI, and data perspectives.',
          items: [
            { title: 'Insights & Research', description: 'Whitepapers & benchmarks', href: '/resources/insights', icon: 'Bot' },
            { title: 'Engineering Blog', description: 'Practices & postmortems', href: '/resources/blog', icon: 'Code2' },
            { title: 'Documentation', description: 'API references & SDKs', href: '/resources/documentation', icon: 'FileText' },
            { title: 'Knowledge Base FAQs', description: 'Frequently asked questions', href: '/resources/faqs', icon: 'HelpCircle' },
          ],
        },
        {
          title: 'Case Studies',
          icon: 'Briefcase',
          description: 'Client success stories and impact.',
          items: [
            { title: 'All Case Studies', description: 'Client success stories', href: '/case-studies', icon: 'BookOpen' },
            { title: 'FinTech Core Banking', description: '12M+ user migration', href: '/case-studies/core-banking-modernization', icon: 'Landmark' },
            { title: 'Healthcare Data Platform', description: 'FHIR-native lakehouse', href: '/case-studies/fhir-clinical-data-platform', icon: 'HeartPulse' },
            { title: 'Supply Chain Visibility', description: 'Real-time analytics', href: '/case-studies/supply-chain-resilience', icon: 'Truck' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'BookOpen',
          description: 'Technical references and getting started.',
          items: [
            { title: 'Documentation Hub', description: 'API & SDK references', href: '/resources/documentation', icon: 'FileCode' },
            { title: 'OpenAPI 3.0 Specs', description: 'REST endpoint schemas', href: '/resources/documentation#api', icon: 'Server' },
            { title: 'MCP Tool SDKs', description: 'Model Context Protocol', href: '/solutions/mcp-development', icon: 'Network' },
            { title: 'Security Guides', description: 'Zero-trust architecture', href: '/trust/security', icon: 'ShieldCheck' },
          ],
          featured: {
            title: 'Trust Center',
            description: 'Security posture, compliance frameworks, and responsible AI principles.',
            href: '/trust',
            tag: 'Security',
          },
        },
        {
          title: 'Company & Network',
          icon: 'Building2',
          description: 'About Sathus and how to engage.',
          items: [
            { title: 'About Sathus', description: 'Engineering culture & vision', href: '/company/about', icon: 'Target' },
            { title: 'Why Sathus', description: 'Four key pillars', href: '/company/why-sathus', icon: 'Award' },
            { title: 'Partner Ecosystem', description: 'AWS, Azure, Databricks', href: '/company/partners', icon: 'Handshake' },
            { title: 'Careers', description: 'Open roles & culture', href: '/company/careers', icon: 'Users' },
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
            { title: 'About Us & Approach', description: 'Process & methodology', href: '/company/about', icon: 'Target' },
            { title: 'Why Sathus', description: 'Differentiators & track record', href: '/company/why-sathus', icon: 'Award' },
            { title: 'Partner Ecosystem', description: 'AWS, Azure, Databricks', href: '/company/partners', icon: 'Handshake' },
            { title: 'Leadership', description: 'Executive team', href: '/company/leadership', icon: 'Users' },
          ],
        },
        {
          title: 'Corporate & Governance',
          icon: 'Handshake',
          description: 'Investor relations and engagement.',
          items: [
            { title: 'Investor Relations', description: 'Growth & corporate governance', href: '/company/investors', icon: 'Award' },
            { title: 'Book Strategy Call', description: 'Working session', href: '/book-strategy-session', icon: 'Calendar' },
            { title: 'Trust Center', description: 'Security posture', href: '/trust', icon: 'ShieldCheck' },
            { title: 'Contact Engineering', description: 'Reach the team', href: '/company/contact', icon: 'Mail' },
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
            { title: 'Partner Ecosystem', description: 'Cloud & data alliances', href: '/company/partners', icon: 'Handshake' },
            { title: 'Why Sathus Whitepaper', description: 'Code vs slide decks', href: '/company/why-sathus', icon: 'FileText' },
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
      { title: 'GenAI Solutions', href: '/solutions/genai' },
      { title: 'AI Agents & Swarms', href: '/solutions/ai-agents' },
      { title: 'Enterprise RAG', href: '/solutions/rag-solutions' },
      { title: 'MCP Development', href: '/solutions/mcp-development' },
      { title: 'Cloud Engineering', href: '/solutions/cloud-engineering' },
      { title: 'Enterprise Integration', href: '/solutions/enterprise-integration' },
      { title: 'API Engineering', href: '/solutions/api-development' },
      { title: 'Data Modernization', href: '/solutions/data-platform-modernization' },
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
      { title: 'Why Sathus', href: '/company/why-sathus' },
      { title: 'Partner Network', href: '/company/partners' },
      { title: 'Leadership', href: '/company/leadership' },
      { title: 'Investors', href: '/company/investors' },
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
      { title: 'Documentation', href: '/resources/documentation' },
      { title: 'Knowledge Base FAQs', href: '/resources/faqs' },
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
  { name: 'LinkedIn', href: companyConfig.socials.linkedin, icon: 'LinkedIn' },
  { name: 'Instagram', href: companyConfig.socials.instagram, icon: 'Instagram' },
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
  { title: 'Model Context Protocol', description: 'Standardized tool connectivity', href: '/solutions/mcp-development', category: 'Solutions' },
  { title: 'Cloud Engineering', description: 'Terraform IaC & Kubernetes', href: '/solutions/cloud-engineering', category: 'Solutions' },
  { title: 'Why Sathus', description: 'Four engineering pillars', href: '/company/why-sathus', category: 'Company' },
  { title: 'Partners Network', description: 'AWS, Azure, Databricks', href: '/company/partners', category: 'Company' },
  { title: 'Documentation', description: 'API references & SDKs', href: '/resources/documentation', category: 'Resources' },
  { title: 'Knowledge Base FAQs', description: 'Technical questions & answers', href: '/resources/faqs', category: 'Resources' },
  { title: 'Trust Center', description: 'Security & compliance', href: '/trust', category: 'Company' },
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
