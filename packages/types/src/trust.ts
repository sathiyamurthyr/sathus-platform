import * as React from 'react';

export interface SecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  items?: string[];
  badge?: string;
}

export interface PrivacyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  rights?: string[];
}

export interface ComplianceTimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: 'planning' | 'in-progress' | 'completed';
  icon?: React.ReactNode;
}

export interface ComplianceTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ComplianceTimelineItem[];
}

export interface TrustBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline';
}

export interface ArchitectureLayer {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ArchitectureDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  layers: ArchitectureLayer[];
  title?: string;
  description?: string;
}

export interface SystemStatusItem {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
}

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  title: string;
  description?: string;
  lastUpdated?: string;
  services?: SystemStatusItem[];
}

export interface ContactSecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  securityEmail?: string;
  responsibleDisclosure?: {
    url?: string;
    description: string;
  };
  bugReporting?: {
    url?: string;
    description: string;
  };
  bugBounty?: {
    active?: boolean;
    description?: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'data' | 'encryption' | 'privacy' | 'backups' | 'support';
}

export interface FAQAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FAQItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}
