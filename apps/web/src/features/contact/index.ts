// Types
export type {
  InquiryType,
  ContactFormData,
  ContactFormStep,
  Lead,
} from './types';

export {
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  COUNTRY_OPTIONS,
  SERVICE_OPTIONS,
} from './types';

// Validation
export {
  contactFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  validateContactForm,
  validateStep1,
  validateStep2,
  validateStep3,
} from './validation';

// Providers
export { MockLeadProvider, LeadService } from './providers/lead-provider';
export type { LeadProvider } from './types';

// Components
export { ContactForm } from './components/ContactForm';
export { OfficeLocations } from './components/OfficeLocations';
export { BusinessHours } from './components/BusinessHours';
export { ContactMethods } from './components/ContactMethods';
export { Faq } from './components/Faq';
export { Cta } from './components/Cta';