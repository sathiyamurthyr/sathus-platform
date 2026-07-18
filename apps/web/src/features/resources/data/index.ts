import type { Resource, Category, Tag, Author, FeaturedContent } from '../types';

export const categories: Category[] = [
  { id: 'blog', name: 'Blog', slug: 'blog', description: 'Latest insights and perspectives' },
  { id: 'docs', name: 'Documentation', slug: 'docs', description: 'Product documentation and guides' },
  { id: 'learning', name: 'Learning Center', slug: 'learning', description: 'Tutorials and educational content' },
  { id: 'whitepapers', name: 'Whitepapers', slug: 'whitepapers', description: 'In-depth research and analysis' },
  { id: 'tutorials', name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides' },
  { id: 'releases', name: 'Release Notes', slug: 'releases', description: 'Product updates and changes' },
  { id: 'engineering', name: 'Engineering', slug: 'engineering', description: 'Technical deep-dives' },
];

export const authors: Author[] = [
  { id: '1', name: 'Sathus Team', role: 'Engineering' },
  { id: '2', name: 'Product Team', role: 'Product' },
];

export const tags: Tag[] = [
  { id: 'ai', name: 'AI', slug: 'ai' },
  { id: 'cloud', name: 'Cloud', slug: 'cloud' },
  { id: 'security', name: 'Security', slug: 'security' },
  { id: 'architecture', name: 'Architecture', slug: 'architecture' },
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Building Secure Enterprise Applications',
    slug: 'building-secure-enterprise-applications',
    description: 'A guide to security best practices for enterprise software.',
    excerpt: 'Learn how to build secure applications from the ground up.',
    category: 'blog',
    tags: [{ id: 'security', name: 'Security', slug: 'security' }],
    author: { id: '1', name: 'Sathus Team', role: 'Engineering' },
    publishedAt: '2024-01-15',
    readingTime: 8,
    featured: true,
  },
  {
    id: '2',
    title: 'AI Engineering Fundamentals',
    slug: 'ai-engineering-fundamentals',
    description: 'Introduction to building production AI systems.',
    excerpt: 'Core principles for AI engineering in enterprise.',
    category: 'learning',
    tags: [{ id: 'ai', name: 'AI', slug: 'ai' }],
    author: { id: '1', name: 'Sathus Team', role: 'Engineering' },
    publishedAt: '2024-01-10',
    readingTime: 12,
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'Cloud Modernization Strategy',
    slug: 'cloud-modernization-strategy',
    description: 'A whitepaper on cloud transformation strategies.',
    excerpt: 'Strategic approaches to cloud modernization.',
    category: 'whitepapers',
    tags: [{ id: 'cloud', name: 'Cloud', slug: 'cloud' }],
    author: { id: '2', name: 'Product Team', role: 'Product' },
    publishedAt: '2024-01-05',
    readingTime: 15,
  },
];

export const featuredContent: FeaturedContent[] = [
  {
    id: '1',
    resource: resources[0],
    variant: 'hero',
  },
  {
    id: '2',
    resource: resources[1],
    variant: 'card',
  },
];