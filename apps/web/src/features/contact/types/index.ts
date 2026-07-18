// Contact Platform Types

export type InquiryType =
  | 'general'
  | 'strategy-session'
  | 'product-demo'
  | 'partnership'
  | 'careers'
  | 'support';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone?: string;
  country: string;
  industry: string;
  companySize: string;
  serviceInterested?: string;
  message: string;
  consent: boolean;
  inquiryType: InquiryType;
}

export interface ContactFormStep {
  id: string;
  title: string;
  fields: (keyof ContactFormData)[];
}

export interface Lead {
  id: string;
  formData: ContactFormData;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadProvider {
  submitLead(lead: Lead): Promise<Lead>;
  getLead(id: string): Promise<Lead | null>;
}

// Options for dropdowns
export const INDUSTRY_OPTIONS = [
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Technology',
  'Government',
  'Logistics',
  'Insurance',
  'Other',
];

export const COMPANY_SIZE_OPTIONS = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];

export const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Singapore',
  'Other',
];

export const SERVICE_OPTIONS = [
  'AI Engineering',
  'Data Engineering',
  'Cloud Modernization',
  'Product Engineering',
  'Digital Transformation',
  'Enterprise Applications',
];