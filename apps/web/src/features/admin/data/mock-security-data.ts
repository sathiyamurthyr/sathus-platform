import type { SecurityMetricOverview, IPRuleItem, TrustedDeviceItem } from '../types';

export const mockSecurityMetrics: SecurityMetricOverview = {
  securityHealthScore: 96,
  mfaAdoptionPercent: 92.4,
  activeSessionsCount: 48,
  blockedLoginAttempts24h: 14,
  trustedDevicesCount: 184,
  suspiciousActivityAlertsCount: 0,
};

export const mockIPRules: IPRuleItem[] = [
  {
    id: 'ip-101',
    ipAddressOrCidr: '103.15.24.0/24',
    ruleType: 'allow',
    description: 'Chennai HQ Corporate VPN subnet whitelist',
    createdBy: 'Sathish Kumar (Platform Owner)',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'ip-102',
    ipAddressOrCidr: '198.51.100.45',
    ruleType: 'block',
    description: 'Automated brute-force attack origin IP',
    createdBy: 'Automated Security Sentinel',
    createdAt: '2026-07-20T14:30:00Z',
  },
];

export const mockTrustedDevices: TrustedDeviceItem[] = [
  {
    id: 'dev-1',
    userId: 'usr-101',
    userName: 'Sathish Kumar',
    deviceName: 'MacBook Pro M3 Max',
    deviceType: 'desktop',
    browser: 'Chrome 126 on macOS',
    lastUsedAt: '2026-07-21T18:00:00Z',
    ipAddress: '103.15.24.120',
    isTrusted: true,
  },
  {
    id: 'dev-2',
    userId: 'usr-102',
    userName: 'Sarah Jenkins',
    deviceName: 'Dell XPS 15 Workstation',
    deviceType: 'desktop',
    browser: 'Firefox 125 on Windows 11',
    lastUsedAt: '2026-07-21T16:15:00Z',
    ipAddress: '192.168.1.45',
    isTrusted: true,
  },
];
