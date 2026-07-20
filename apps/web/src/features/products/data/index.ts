import { memomesCloud } from './memomes-cloud';
import { sathusAi } from './sathus-ai';
import { socialHubMcp } from './socialhub-mcp';
import { oneHealthId } from './onehealthid';
import type { Product } from '../types';

export { memomesCloud, sathusAi, socialHubMcp, oneHealthId };

export const allProducts: Product[] = [
  sathusAi,
  memomesCloud,
  socialHubMcp,
  oneHealthId,
];

export const productsBySlug: Record<string, Product> = {
  'memomes-cloud': memomesCloud,
  'sathus-ai': sathusAi,
  'socialhub-mcp': socialHubMcp,
  'onehealthid': oneHealthId,
};

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug[slug];
}
