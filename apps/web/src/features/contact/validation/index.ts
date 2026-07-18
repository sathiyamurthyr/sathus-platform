import { z } from 'zod';
import type { InquiryType } from '../types';

// Business email validation
const businessEmailSchema = z.string().email().refine(
  (email) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return !personalDomains.includes(domain);
  },
  { message: 'Please use your business email address' }
);

// Phone validation
const phoneSchema = z.string().optional().refine(
  (phone) => {
    if (!phone) return true;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },
  { message: 'Please enter a valid phone number' }
);

// Contact form validation schema
export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  company: z.string().min(1, 'Company is required').max(100),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  email: businessEmailSchema,
  phone: phoneSchema,
  country: z.string().min(1, 'Country is required'),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  serviceInterested: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
  inquiryType: z.enum(['general', 'strategy-session', 'product-demo', 'partnership', 'careers', 'support']),
});

// Form step schemas
export const step1Schema = contactFormSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
});

export const step2Schema = contactFormSchema.pick({
  company: true,
  jobTitle: true,
  country: true,
  industry: true,
  companySize: true,
});

export const step3Schema = contactFormSchema.pick({
  serviceInterested: true,
  message: true,
  consent: true,
});

// Validation functions
export function validateContactForm(data: unknown) {
  return contactFormSchema.parse(data);
}

export function validateStep1(data: unknown) {
  return step1Schema.parse(data);
}

export function validateStep2(data: unknown) {
  return step2Schema.parse(data);
}

export function validateStep3(data: unknown) {
  return step3Schema.parse(data);
}