import type { BrandingProfileItem, CustomDomainItem } from '../types';

export const mockBrandingProfiles: BrandingProfileItem[] = [
  {
    id: 'brand-101',
    tenantId: 'tnt-101',
    tenantName: 'Acme Production Main',
    logoUrl: '/brand/acme-logo-light.svg',
    darkLogoUrl: '/brand/acme-logo-dark.svg',
    faviconUrl: '/brand/acme-favicon.ico',
    primaryColor: '#3B82F6',
    accentColor: '#10B981',
    fontFamily: 'Inter, sans-serif',
    companyName: 'Acme Global Corporation',
    supportEmail: 'support@acmeglobal.com',
    loginMessage: 'Welcome to Acme Global Enterprise Portal powered by Sathus Cloud.',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'brand-201',
    tenantId: 'tnt-201',
    tenantName: 'FinTech Production',
    logoUrl: '/brand/fintech-logo-light.svg',
    darkLogoUrl: '/brand/fintech-logo-dark.svg',
    faviconUrl: '/brand/fintech-favicon.ico',
    primaryColor: '#8B5CF6',
    accentColor: '#F59E0B',
    fontFamily: 'Outfit, sans-serif',
    companyName: 'FinTech Labs Ltd',
    supportEmail: 'help@fintechlabs.io',
    loginMessage: 'Secure FinTech Cloud Portal.',
    updatedAt: '2026-07-18T14:30:00Z',
  },
];

export const mockCustomDomains: CustomDomainItem[] = [
  {
    id: 'dom-1',
    domainName: 'cloud.acmeglobal.com',
    tenantName: 'Acme Production Main',
    sslStatus: 'active',
    sslExpiresAt: '2027-06-15T00:00:00Z',
    cnameRecord: 'acme.sathus.cloud',
  },
  {
    id: 'dom-2',
    domainName: 'app.fintechlabs.io',
    tenantName: 'FinTech Production',
    sslStatus: 'active',
    sslExpiresAt: '2027-05-20T00:00:00Z',
    cnameRecord: 'fintech.sathus.cloud',
  },
];
