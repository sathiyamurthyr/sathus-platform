export const NAVIGATION_PLATFORMS = [
  { value: 'Website', label: 'Website' },
  { value: 'Products', label: 'Products' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'LearningCenter', label: 'Learning Center' },
  { value: 'TrustCenter', label: 'Trust Center' },
  { value: 'CustomerPortal', label: 'Customer Portal' },
  { value: 'DeveloperPortal', label: 'Developer Portal' },
] as const;

export const MENU_TYPES = [
  { value: 'main', label: 'Main Navigation' },
  { value: 'footer', label: 'Footer' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'learning', label: 'Learning' },
  { value: 'product', label: 'Product' },
  { value: 'portal', label: 'Portal' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'context-menu', label: 'Context Menu' },
  { value: 'breadcrumb', label: 'Breadcrumb' },
] as const;

export const NODE_ITEM_TYPES = [
  { value: 'Container', label: 'Container' },
  { value: 'Link', label: 'Link' },
  { value: 'Divider', label: 'Divider' },
  { value: 'Header', label: 'Header' },
] as const;

export const TARGET_TYPES = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' },
  { value: 'Dynamic', label: 'Dynamic' },
] as const;

export const REFERENCE_KINDS = [
  { value: 'None', label: 'None' },
  { value: 'Page', label: 'Page' },
  { value: 'Product', label: 'Product' },
  { value: 'Document', label: 'Document' },
  { value: 'Blog', label: 'Blog' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Media', label: 'Media' },
  { value: 'External', label: 'External URL' },
] as const;

export const VISIBILITY_RULE_TYPES = [
  { value: 'Public', label: 'Public' },
  { value: 'Authenticated', label: 'Authenticated' },
  { value: 'Permission', label: 'Permission' },
  { value: 'Role', label: 'Role' },
  { value: 'FeatureFlag', label: 'Feature Flag' },
  { value: 'Country', label: 'Country' },
  { value: 'Language', label: 'Language' },
  { value: 'Device', label: 'Device' },
  { value: 'Custom', label: 'Custom' },
] as const;

export const MENU_STATUSES = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Scheduled', label: 'Scheduled' },
] as const;

export const PERMISSION_EFFECTS = [
  { value: 'Allow', label: 'Allow' },
  { value: 'Deny', label: 'Deny' },
] as const;

export const REQUIREMENT_MODES = [
  { value: 'Any', label: 'Any' },
  { value: 'All', label: 'All' },
] as const;

export const REDIRECT_TYPES = [
  { value: '301', label: 'Permanent (301)' },
  { value: '302', label: 'Temporary (302)' },
  { value: '308', label: 'Canonical (308)' },
] as const;

export type PlatformValue = (typeof NAVIGATION_PLATFORMS)[number]['value'];
export type MenuTypeValue = (typeof MENU_TYPES)[number]['value'];
export type NodeItemTypeValue = (typeof NODE_ITEM_TYPES)[number]['value'];
export type TargetTypeValue = (typeof TARGET_TYPES)[number]['value'];
export type ReferenceKindValue = (typeof REFERENCE_KINDS)[number]['value'];
export type VisibilityRuleTypeValue = (typeof VISIBILITY_RULE_TYPES)[number]['value'];
export type MenuStatusValue = (typeof MENU_STATUSES)[number]['value'];
