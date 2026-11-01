import { memomesCloud } from './memomes-cloud';
import { sathusAi } from './sathus-ai';
import { socialHubMcp } from './socialhub-mcp';
import { oneHealthId } from './onehealthid';
import { vmaila } from './vmaila';
import { vmailachat } from './vmailachat';
import type { Product } from '../types';

export { memomesCloud, sathusAi, socialHubMcp, oneHealthId, vmaila, vmailachat };

export const allProducts: Product[] = [
  sathusAi,
  oneHealthId,
  memomesCloud,
  vmaila,
  vmailachat,
  socialHubMcp,
];

export const productsBySlug: Record<string, Product> = {
  'sathus-ai': sathusAi,
  'onehealthid': oneHealthId,
  'memomes-cloud': memomesCloud,
  'vmaila': vmaila,
  'vmailachat': vmailachat,
  'socialhub-mcp': socialHubMcp,
};

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug[slug];
}
