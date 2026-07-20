import { aiEngineeringSolution } from './ai-engineering';
import { dataEngineeringSolution } from './data-engineering';
import { cloudModernizationSolution } from './cloud-modernization';
import { enterpriseApplicationsSolution } from './enterprise-applications';
import { productEngineeringSolution } from './product-engineering';
import { digitalTransformationSolution } from './digital-transformation';
import { genAiSolution } from './genai';
import { mcpDevelopmentSolution } from './mcp-development';
import { cloudEngineeringSolution } from './cloud-engineering';
import { enterpriseIntegrationSolution } from './enterprise-integration';
import { apiDevelopmentSolution } from './api-development';
import { aiAgentsSolution } from './ai-agents';
import { ragSolutionsSolution } from './rag-solutions';
import { dataPlatformModernizationSolution } from './data-platform-modernization';
import type { Solution } from '../types';

export {
  aiEngineeringSolution,
  dataEngineeringSolution,
  cloudModernizationSolution,
  enterpriseApplicationsSolution,
  productEngineeringSolution,
  digitalTransformationSolution,
  genAiSolution,
  mcpDevelopmentSolution,
  cloudEngineeringSolution,
  enterpriseIntegrationSolution,
  apiDevelopmentSolution,
  aiAgentsSolution,
  ragSolutionsSolution,
  dataPlatformModernizationSolution,
};

export const allSolutions: Solution[] = [
  aiEngineeringSolution,
  dataEngineeringSolution,
  genAiSolution,
  aiAgentsSolution,
  ragSolutionsSolution,
  mcpDevelopmentSolution,
  cloudEngineeringSolution,
  cloudModernizationSolution,
  enterpriseIntegrationSolution,
  apiDevelopmentSolution,
  dataPlatformModernizationSolution,
  enterpriseApplicationsSolution,
  productEngineeringSolution,
  digitalTransformationSolution,
];

export const solutionsBySlug: Record<string, Solution> = {
  'ai-engineering': aiEngineeringSolution,
  'data-engineering': dataEngineeringSolution,
  'cloud-modernization': cloudModernizationSolution,
  'enterprise-applications': enterpriseApplicationsSolution,
  'product-engineering': productEngineeringSolution,
  'digital-transformation': digitalTransformationSolution,
  'genai': genAiSolution,
  'mcp-development': mcpDevelopmentSolution,
  'cloud-engineering': cloudEngineeringSolution,
  'enterprise-integration': enterpriseIntegrationSolution,
  'api-development': apiDevelopmentSolution,
  'ai-agents': aiAgentsSolution,
  'rag-solutions': ragSolutionsSolution,
  'data-platform-modernization': dataPlatformModernizationSolution,
};

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutionsBySlug[slug];
}
