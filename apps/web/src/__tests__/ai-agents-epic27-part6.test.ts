import { describe, it, expect } from 'vitest';
import {
  mockAgentSecurityPolicies,
  mockAgentPerformanceAnalytics,
  mockAgentLearningFeedback,
  mockAICommandCenterFleetStatus,
} from '../features/ai-agents/data/mock-agents-data';

describe('EPIC-027 Master Prompt 05: Security, Analytics, Continuous Learning & Command Center', () => {
  it('validates Story 27.13 Agent Security & Governance Center', () => {
    expect(mockAgentSecurityPolicies.length).toBeGreaterThan(0);
    mockAgentSecurityPolicies.forEach((pol) => {
      expect(pol.id).toBeTruthy();
      expect(pol.name).toBeTruthy();
      expect(['data_access', 'pii_protection', 'prompt_injection', 'tool_permission']).toContain(pol.policyType);
      expect(typeof pol.isEnforced).toBe('boolean');
    });
  });

  it('validates Story 27.14 Agent Analytics & Continuous Learning Engine', () => {
    expect(mockAgentPerformanceAnalytics.length).toBeGreaterThan(0);
    mockAgentPerformanceAnalytics.forEach((item) => {
      expect(item.agentId).toBeTruthy();
      expect(item.taskSuccessRatePercent).toBeGreaterThan(90.0);
      expect(item.reasoningQualityScore).toBeGreaterThan(4.0);
    });

    expect(mockAgentLearningFeedback.length).toBeGreaterThan(0);
    mockAgentLearningFeedback.forEach((fb) => {
      expect(fb.id).toBeTruthy();
      expect(fb.autoOptimizationSuggestion).toBeTruthy();
    });
  });

  it('validates Story 27.15 Enterprise AI Command Center and Fleet Control', () => {
    expect(mockAICommandCenterFleetStatus.totalAgentsInFleet).toBeGreaterThan(0);
    expect(typeof mockAICommandCenterFleetStatus.emergencyStopEngaged).toBe('boolean');
    expect(['optimal', 'degraded', 'critical']).toContain(mockAICommandCenterFleetStatus.systemHealthStatus);
  });
});
