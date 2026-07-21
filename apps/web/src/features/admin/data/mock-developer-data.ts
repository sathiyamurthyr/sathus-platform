import type { DeveloperApp, APIKeyItem, WebhookSubscription } from '../types';

export const mockDeveloperApps: DeveloperApp[] = [
  {
    id: 'app-101',
    name: 'Acme Payment Gateway Sync',
    description: 'Stripe webhook listener & automated billing ingestion service.',
    environment: 'production',
    keyCount: 3,
    monthlyCalls: 184500,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'app-102',
    name: 'FinTech AI Copilot Integration',
    description: 'FastAPI microservices gateway for RAG embeddings and Claude 3.5 Sonnet.',
    environment: 'production',
    keyCount: 2,
    monthlyCalls: 412000,
    createdAt: '2026-03-15T00:00:00Z',
  },
];

export const mockAPIKeys: APIKeyItem[] = [
  {
    id: 'key-801',
    appId: 'app-101',
    appName: 'Acme Payment Gateway Sync',
    name: 'Server Secret Production Key',
    keyPrefix: 'sk_live_acme_',
    maskedKey: 'sk_live_acme_********************4a9b',
    keyType: 'server',
    scopes: ['billing:write', 'tenants:read'],
    rateLimitPerMin: 1200,
    lastUsedAt: '2026-07-21T18:10:00Z',
    expiresAt: '2027-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'key-802',
    appId: 'app-102',
    appName: 'FinTech AI Copilot Integration',
    name: 'Client Public Sandbox Key',
    keyPrefix: 'pk_test_fintech_',
    maskedKey: 'pk_test_fintech_********************9e12',
    keyType: 'client',
    scopes: ['ai:execute', 'analytics:read'],
    rateLimitPerMin: 300,
    lastUsedAt: '2026-07-21T17:45:00Z',
    expiresAt: null,
    status: 'active',
  },
];

export const mockWebhooks: WebhookSubscription[] = [
  {
    id: 'wh-501',
    targetUrl: 'https://api.acmeglobal.com/webhooks/sathus-events',
    subscribedEvents: ['tenant.provisioned', 'billing.invoice_paid', 'user.created'],
    secretMasked: 'whsec_acme_********************881b',
    status: 'active',
    deliverySuccessPercent: 99.8,
    createdAt: '2026-02-10T00:00:00Z',
  },
];
