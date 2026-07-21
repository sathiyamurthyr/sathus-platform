import type { LicenseOverviewMetric, SubscriptionPlanItem, LicenseAssignmentItem } from '../types';

export const mockLicenseMetrics: LicenseOverviewMetric = {
  totalLicensesCount: 400,
  assignedLicensesCount: 342,
  availableLicensesCount: 58,
  expiringSoonLicensesCount: 12,
  monthlyRecurringRevenueMRR: 24850,
  annualRecurringRevenueARR: 298200,
  renewalDaysRemaining: 145,
};

export const mockSubscriptionPlans: SubscriptionPlanItem[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    priceMonthlyDollars: 49,
    includedSeats: 5,
    includedStorageGB: 50,
    includedAiTokensMonthly: 100000,
    features: ['5 User Seats', '50 GB Cloud Storage', '100k AI Token Quota', 'Standard Email Support'],
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    priceMonthlyDollars: 199,
    includedSeats: 25,
    includedStorageGB: 500,
    includedAiTokensMonthly: 1000000,
    features: ['25 User Seats', '500 GB Cloud Storage', '1M AI Token Quota', 'Priority 24/7 SLA Support', 'Workflow Orchestrator'],
    isPopular: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    priceMonthlyDollars: 899,
    includedSeats: 100,
    includedStorageGB: 2000,
    includedAiTokensMonthly: 5000000,
    features: ['100 User Seats', '2 TB Dedicated Storage', '5M AI Token Quota', 'Dedicated SRE Account Manager', 'Custom ABAC Security Policies'],
  },
];

export const mockLicenseAssignments: LicenseAssignmentItem[] = [
  {
    id: 'lic-101',
    userId: 'usr-101',
    userName: 'Sathish Kumar',
    userEmail: 'sathish@sathus.in',
    planName: 'Enterprise',
    assignedAt: '2026-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'lic-102',
    userId: 'usr-102',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@acmeglobal.com',
    planName: 'Enterprise',
    assignedAt: '2026-01-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'lic-103',
    userId: 'usr-103',
    userName: 'Michael Chen',
    userEmail: 'mchen@fintechlabs.io',
    planName: 'Professional',
    assignedAt: '2026-02-01T00:00:00Z',
    status: 'active',
  },
];
