import { mockNotifications, mockDefaultPreference, mockWebhooks } from '../features/notifications/data/mock-notifications';

describe('EPIC-018 Notification Domain & Data Verification', () => {
  it('contains initial notification items with valid properties', () => {
    expect(mockNotifications.length).toBeGreaterThan(0);
    mockNotifications.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.subject).toBeTruthy();
      expect(item.body).toBeTruthy();
      expect(['unread', 'read', 'archived']).toContain(item.status);
      expect(['low', 'normal', 'high', 'critical']).toContain(item.priority);
      expect(item.eventType).toBeTruthy();
    });
  });

  it('correctly identifies unread notification count', () => {
    const unread = mockNotifications.filter((i) => i.status === 'unread');
    expect(unread.length).toBe(3);
  });

  it('validates default channel preferences matrix', () => {
    expect(mockDefaultPreference.categoryPreferences.security.email).toBe(true);
    expect(mockDefaultPreference.categoryPreferences.security.sms).toBe(true);
    expect(mockDefaultPreference.categoryPreferences.security.webhook).toBe(true);
    expect(mockDefaultPreference.quietHoursEnabled).toBe(true);
  });

  it('validates webhook configurations', () => {
    expect(mockWebhooks.length).toBeGreaterThan(0);
    mockWebhooks.forEach((wh) => {
      expect(wh.url.startsWith('https://')).toBe(true);
      expect(wh.secret).toBeTruthy();
      expect(wh.active).toBe(true);
    });
  });
});
