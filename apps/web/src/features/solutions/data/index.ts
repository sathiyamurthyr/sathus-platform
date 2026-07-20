import { aiEngineeringSolution } from './ai-engineering';
import { dataEngineeringSolution } from './data-engineering';
import { cloudModernizationSolution } from './cloud-modernization';
import { enterpriseApplicationsSolution } from './enterprise-applications';
import { productEngineeringSolution } from './product-engineering';
import { digitalTransformationSolution } from './digital-transformation';
import { genAiSolution } from './genai';
import type { Solution } from '../types';

export {
  aiEngineeringSolution,
  dataEngineeringSolution,
  cloudModernizationSolution,
  enterpriseApplicationsSolution,
  productEngineeringSolution,
  digitalTransformationSolution,
  genAiSolution,
};

export const allSolutions: Solution[] = [
  aiEngineeringSolution,
  dataEngineeringSolution,
  cloudModernizationSolution,
  enterpriseApplicationsSolution,
  productEngineeringSolution,
  digitalTransformationSolution,
  genAiSolution,
];

export const solutionsBySlug: Record<string, Solution> = {
  'ai-engineering': aiEngineeringSolution,
  'data-engineering': dataEngineeringSolution,
  'cloud-modernization': cloudModernizationSolution,
  'enterprise-applications': enterpriseApplicationsSolution,
  'product-engineering': productEngineeringSolution,
  'digital-transformation': digitalTransformationSolution,
  'genai': genAiSolution,
};

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutionsBySlug[slug];
}
