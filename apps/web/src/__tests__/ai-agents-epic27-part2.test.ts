import { describe, it, expect } from 'vitest';
import { mockMultiAgentWorkflows, mockSafetyGuardrails } from '../features/ai-agents/data/mock-agents-data';

describe('EPIC-027 Story 27.4 Multi-Agent Workflows & Safety Guardrails', () => {
  it('validates Multi-Agent DAG workflow orchestration and node chaining', () => {
    expect(mockMultiAgentWorkflows.length).toBeGreaterThan(0);
    mockMultiAgentWorkflows.forEach((wf) => {
      expect(wf.id).toBeTruthy();
      expect(wf.triggerEvent).toBeTruthy();
      expect(wf.nodes.length).toBeGreaterThan(1);
      wf.nodes.forEach((node) => {
        expect(node.agentId).toBeTruthy();
        expect(node.outputKey).toBeTruthy();
        expect(['completed', 'running', 'pending']).toContain(node.status);
      });
    });
  });

  it('validates AI Safety, Prompt Injection Defense, and Guardrails policies', () => {
    expect(mockSafetyGuardrails.length).toBeGreaterThan(0);
    mockSafetyGuardrails.forEach((guard) => {
      expect(guard.id).toBeTruthy();
      expect(guard.threshold).toBeTruthy();
      expect(['prompt_injection', 'pii_masking', 'rbac_enforcement', 'cost_cap']).toContain(guard.category);
      expect(guard.isEnforced).toBe(true);
    });
  });
});
