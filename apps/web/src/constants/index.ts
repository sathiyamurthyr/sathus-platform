import { SiteConfig, NavItem, MegaMenuSection, FooterSection } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Sathus Platform',
  url: 'https://sathusplatform.com',
  description: 'Enterprise-grade web platform for technology companies.',
  links: {
    github: 'https://github.com/sathiyamurthyr/sathus-platform',
    twitter: 'https://twitter.com/sathusplatform',
    linkedin: 'https://linkedin.com/company/sathusplatform',
  },
};

export const navItems: NavItem[] = [
  { label: 'Products', href: '#products', hasMega: true },
  { label: 'Services', href: '#services', hasMega: true },
  { label: 'Labs', href: '#labs', hasMega: true },
  { label: 'Sathus X', href: '#sathus-x', hasMega: true },
  { label: 'Learning', href: '#learning', hasMega: false },
  { label: 'Trust Center', href: '#trust-center', hasMega: false },
];

export const megaMenuSections: Record<string, MegaMenuSection[]> = {
  Products: [
    {
      title: 'Platform',
      items: [
        { title: 'Analytics', description: 'Real-time insights and reporting', href: '#' },
        { title: 'Automation', description: 'Workflow automation engine', href: '#' },
        { title: 'Integrations', description: 'Connect your existing tools', href: '#' },
        { title: 'Mobile', description: 'Native iOS and Android apps', href: '#' },
      ],
    },
    {
      title: 'Solutions',
      items: [
        { title: 'Enterprise', description: 'For large organizations', href: '#' },
        { title: 'Mid-Market', description: 'For growing teams', href: '#' },
        { title: 'Startups', description: 'For early-stage companies', href: '#' },
        { title: 'Healthcare', description: 'HIPAA compliant solutions', href: '#' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { title: 'Documentation', description: 'Guides and references', href: '#' },
        { title: 'API Reference', description: 'REST and GraphQL APIs', href: '#' },
        { title: 'Community', description: 'Forums and discussions', href: '#' },
        { title: 'Blog', description: 'Latest news and updates', href: '#' },
      ],
    },
  ],
  Services: [
    {
      title: 'Consulting',
      items: [
        { title: 'Strategy', description: 'Digital transformation strategy', href: '#' },
        { title: 'Implementation', description: 'End-to-end deployment', href: '#' },
        { title: 'Training', description: 'Team enablement programs', href: '#' },
        { title: 'Support', description: '24/7 premium support', href: '#' },
      ],
    },
    {
      title: 'Professional Services',
      items: [
        { title: 'Custom Development', description: 'Tailored solutions', href: '#' },
        { title: 'Data Migration', description: 'Seamless data transfer', href: '#' },
        { title: 'Security Audit', description: 'Comprehensive assessment', href: '#' },
        { title: 'Performance Tuning', description: 'Optimize your stack', href: '#' },
      ],
    },
    {
      title: 'Support',
      items: [
        { title: 'Help Center', description: 'FAQs and guides', href: '#' },
        { title: 'Community Forum', description: 'Peer support', href: '#' },
        { title: 'Status Page', description: 'System health', href: '#' },
        { title: 'Contact Support', description: 'Get in touch', href: '#' },
      ],
    },
  ],
  Labs: [
    {
      title: 'Research',
      items: [
        { title: 'AI Experiments', description: 'Cutting-edge AI research', href: '#' },
        { title: 'Open Source', description: 'Community projects', href: '#' },
        { title: 'Beta Programs', description: 'Early access features', href: '#' },
        { title: 'Innovation Lab', description: 'Future technologies', href: '#' },
      ],
    },
    {
      title: 'Innovation',
      items: [
        { title: 'Prototypes', description: 'Experimental features', href: '#' },
        { title: 'Design Systems', description: 'Component libraries', href: '#' },
        { title: 'Developer Tools', description: 'Productivity tools', href: '#' },
        { title: 'Plugins', description: 'Extend the platform', href: '#' },
      ],
    },
    {
      title: 'Community',
      items: [
        { title: 'Hackathons', description: 'Coding competitions', href: '#' },
        { title: 'Meetups', description: 'Local events', href: '#' },
        { title: 'Scholarships', description: 'Education programs', href: '#' },
        { title: 'Partners', description: 'Partner ecosystem', href: '#' },
      ],
    },
  ],
  'Sathus X': [
    {
      title: 'Platform',
      items: [
        { title: 'Advanced Analytics', description: 'AI-powered insights', href: '#' },
        { title: 'Enterprise Security', description: 'Zero-trust architecture', href: '#' },
        { title: 'Global CDN', description: 'Edge computing network', href: '#' },
        { title: 'API Gateway', description: 'Unified API management', href: '#' },
      ],
    },
    {
      title: 'Solutions',
      items: [
        { title: 'Financial Services', description: 'Regulatory compliant', href: '#' },
        { title: 'Healthcare', description: 'HIPAA and HITRUST', href: '#' },
        { title: 'Government', description: 'FedRAMP authorized', href: '#' },
        { title: 'Manufacturing', description: 'IoT integrated', href: '#' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { title: 'Case Studies', description: 'Success stories', href: '#' },
        { title: 'Whitepapers', description: 'Technical deep dives', href: '#' },
        { title: 'Webinars', description: 'Live and recorded', href: '#' },
        { title: 'ROI Calculator', description: 'Estimate your savings', href: '#' },
      ],
    },
  ],
};

export const footerSections: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { title: 'About', href: '#' },
      { title: 'Careers', href: '#' },
      { title: 'Press', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Products',
    links: [
      { title: 'Platform', href: '#' },
      { title: 'Integrations', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '#' },
      { title: 'API Reference', href: '#' },
      { title: 'Community', href: '#' },
      { title: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { title: 'Getting Started', href: '#' },
      { title: 'SDKs', href: '#' },
      { title: 'Status', href: '#' },
      { title: 'Support', href: '#' },
    ],
  },
  {
    title: 'Trust Center',
    links: [
      { title: 'Security', href: '#' },
      { title: 'Privacy', href: '#' },
      { title: 'Compliance', href: '#' },
      { title: 'Terms', href: '#' },
    ],
  },
];

export const socialLinks = [
  { name: 'GitHub', href: siteConfig.links.github, icon: 'GitHub' },
  { name: 'Twitter', href: siteConfig.links.twitter, icon: 'Twitter' },
  { name: 'LinkedIn', href: siteConfig.links.linkedin, icon: 'LinkedIn' },
];
