// Trust Center Types

export interface TrustSection {
  id: string;
  title: string;
  description: string;
}

export interface SecurityControl {
  id: string;
  title: string;
  description: string;
  category: 'sdls' | 'iam' | 'encryption' | 'infrastructure' | 'secrets' | 'dependencies' | 'monitoring' | 'incident';
}

export interface ComplianceFramework {
  id: string;
  name: string;
  status: 'achieved' | 'planned' | 'in-progress';
  description: string;
}

export interface PrivacyPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface ResponsibleAIPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface BusinessContinuityPlan {
  id: string;
  title: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}