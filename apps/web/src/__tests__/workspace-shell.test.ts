import { sidebarNavItems, quickActions, mockWorkspaces, mockCurrentUser, moduleStatusRegistry } from '../features/workspace/config/nav-config';

describe('Workspace Shell & Navigation Configuration', () => {
  it('contains valid sidebar navigation items with unique IDs', () => {
    expect(sidebarNavItems.length).toBeGreaterThan(5);
    const ids = sidebarNavItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has mandatory core items (dashboard, settings)', () => {
    const dashboard = sidebarNavItems.find((i) => i.id === 'dashboard');
    const settings = sidebarNavItems.find((i) => i.id === 'settings');

    expect(dashboard).toBeDefined();
    expect(dashboard?.href).toBe('/workspace');
    expect(settings).toBeDefined();
    expect(settings?.href).toBe('/workspace/settings');
  });

  it('provides quick launch actions with descriptions', () => {
    expect(quickActions.length).toBeGreaterThan(0);
    quickActions.forEach((action) => {
      expect(action.title).toBeTruthy();
      expect(action.href).toBeTruthy();
      expect(action.description).toBeTruthy();
    });
  });

  it('contains mock tenant workspaces and active user profile', () => {
    expect(mockWorkspaces.length).toBeGreaterThan(0);
    expect(mockCurrentUser.name).toBe('Sathish Kumar');
    expect(mockCurrentUser.role).toBeTruthy();
  });

  it('registers target EPIC metadata for unreleased modules in moduleStatusRegistry', () => {
    const keys = Object.keys(moduleStatusRegistry);
    expect(keys).toContain('projects');
    expect(keys).toContain('tasks');
    expect(keys).toContain('files');
    expect(keys).toContain('ai');

    expect(moduleStatusRegistry['ai'].epicId).toBe('EPIC-020');
    expect(moduleStatusRegistry['ai'].expectedFeatures.length).toBeGreaterThan(0);
  });
});
