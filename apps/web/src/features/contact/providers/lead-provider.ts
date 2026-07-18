import type { Lead, LeadProvider, ContactFormData, InquiryType } from '../types';

// Mock Lead Provider - replace with real CRM integration
export class MockLeadProvider implements LeadProvider {
  private leads: Map<string, Lead> = new Map();

  async submitLead(lead: Lead): Promise<Lead> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    this.leads.set(lead.id, lead);
    return lead;
  }

  async getLead(id: string): Promise<Lead | null> {
    return this.leads.get(id) || null;
  }
}

// Lead service for creating leads
export class LeadService {
  constructor(private provider: LeadProvider) {}

  async createLead(formData: ContactFormData, source: string = 'website'): Promise<Lead> {
    const lead: Lead = {
      id: crypto.randomUUID(),
      formData,
      status: 'new',
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.provider.submitLead(lead);
  }
}