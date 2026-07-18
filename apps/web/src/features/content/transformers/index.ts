import type { ContentItem, SeoMetadata, ContentBlock } from '../types';

// Transform content item to SEO metadata
export function transformToSeoMetadata(item: ContentItem): SeoMetadata {
  return {
    title: item.seo?.title || item.title,
    description: item.seo?.description || item.description || '',
    canonical: item.seo?.canonical,
    openGraph: item.seo?.openGraph,
    twitter: item.seo?.twitter,
    jsonLd: item.seo?.jsonLd,
    focusKeyword: item.seo?.focusKeyword,
    readingTime: item.seo?.readingTime,
  };
}

// Transform content blocks to sections
export function transformBlocksToSections(blocks: ContentBlock[]) {
  const sections: Record<string, ContentBlock[]> = {};

  blocks.forEach((block) => {
    const sectionId = block.data.sectionId as string || 'default';
    if (!sections[sectionId]) {
      sections[sectionId] = [];
    }
    sections[sectionId].push(block);
  });

  return Object.entries(sections).map(([id, sectionBlocks]) => ({
    id,
    blocks: sectionBlocks.sort((a, b) => a.order - b.order),
  }));
}

// Generate full URL from slug
export function generateUrl(slug: string, basePath = ''): string {
  return `${basePath}/${slug}`;
}

// Generate canonical URL
export function generateCanonicalUrl(item: ContentItem, baseUrl: string): string {
  return `${baseUrl}${item.slug.fullPath}`;
}

// Calculate reading time from content
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}