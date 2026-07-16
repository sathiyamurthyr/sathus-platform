import { describe, expect, it } from 'vitest';
import type { NavigationNode, NavigationVersion, NavigationMenuItem } from '../../../../types/navigation-data';

describe('navigation-data', () => {
  const baseNode: NavigationNode = {
    id: 'node-1',
    parentId: undefined,
    displayName: 'Home',
    itemType: 'Link',
    routePath: '/',
    targetType: 'Internal',
    targetUrl: undefined,
    referenceKind: 'None',
    referenceId: undefined,
    icon: 'home',
    cssClass: undefined,
    isExpanded: false,
    isHidden: false,
    isEnabled: true,
    sortOrder: 1,
    depth: 0,
    localizations: [],
    permissions: [],
    visibilityRules: [],
    children: [],
  };

  it('creates a valid navigation node', () => {
    expect(baseNode.displayName).toBe('Home');
    expect(baseNode.routePath).toBe('/');
    expect(baseNode.children).toHaveLength(0);
  });

  it('extends node into menu item', () => {
    const item: NavigationMenuItem = { ...baseNode, nodeId: 'node-1' };
    expect(item.nodeId).toBe('node-1');
    expect(item.itemType).toBe('Link');
  });

  it('creates a valid version', () => {
    const version: NavigationVersion = {
      id: 'v-1',
      versionNumber: 1,
      label: 'Draft',
      status: 'Draft',
      createdBy: 'admin',
      createdAt: '2025-01-01T00:00:00Z',
      isCurrent: true,
    };
    expect(version.status).toBe('Draft');
    expect(version.isCurrent).toBe(true);
  });
});
