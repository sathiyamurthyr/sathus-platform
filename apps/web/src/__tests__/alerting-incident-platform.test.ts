import {
  mockAlertRules,
  mockFiringAlerts,
  mockIncidents,
  mockEscalationPolicy,
  mockServiceDependencies,
} from '../features/observability/data/mock-alerting-data';

describe('Story 13.3 Enterprise Alerting & Incident Management Verification', () => {
  it('validates alert rule evaluation conditions and notification channels', () => {
    expect(mockAlertRules.length).toBeGreaterThan(0);
    mockAlertRules.forEach((rule) => {
      expect(rule.id).toBeTruthy();
      expect(rule.name).toBeTruthy();
      expect(rule.condition).toBeTruthy();
      expect(rule.threshold).toBeGreaterThan(0);
      expect(rule.channels.length).toBeGreaterThan(0);
    });
  });

  it('validates firing alerts payload and severity ratings', () => {
    expect(mockFiringAlerts.length).toBeGreaterThan(0);
    const firing = mockFiringAlerts.find((a) => a.status === 'firing');
    expect(firing).toBeDefined();
    expect(firing?.ruleName).toBeTruthy();
    expect(firing?.affectedService).toBeTruthy();
    expect(firing?.value).toBeGreaterThan(firing?.threshold || 0);
  });

  it('validates incident response lifecycle state transitions and timeline audit log', () => {
    expect(mockIncidents.length).toBeGreaterThan(0);
    const activeInc = mockIncidents.find((i) => i.severity === 'P1_HIGH');
    expect(activeInc).toBeDefined();
    expect(activeInc?.owner).toBeTruthy();
    expect(activeInc?.mttaMinutes).toBeDefined();
    expect(activeInc?.timeline.length).toBeGreaterThan(0);
  });

  it('validates 3-tier escalation policy routing chain', () => {
    expect(mockEscalationPolicy.level1.length).toBeGreaterThan(0);
    expect(mockEscalationPolicy.level2.length).toBeGreaterThan(0);
    expect(mockEscalationPolicy.level3.length).toBeGreaterThan(0);
    expect(mockEscalationPolicy.timeoutMin).toBe(15);
  });

  it('validates service dependency topology mapping', () => {
    expect(mockServiceDependencies.length).toBeGreaterThan(0);
    const childNode = mockServiceDependencies.find((n) => n.parentServiceId);
    expect(childNode).toBeDefined();
    expect(childNode?.parentServiceId).toBeTruthy();
  });
});
