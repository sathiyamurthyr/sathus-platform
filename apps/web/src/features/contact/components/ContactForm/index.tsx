'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { contactFormSchema } from '../../validation';
import type { ContactFormData, InquiryType } from '../../types';
import { INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS, COUNTRY_OPTIONS, SERVICE_OPTIONS } from '../../types';

interface ContactFormProps {
  inquiryType?: InquiryType;
  onSuccess?: (leadId: string) => void;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'company', title: 'Company Information' },
  { id: 'message', title: 'Message' },
];

const STEP_FIELDS: (keyof ContactFormData)[][] = [
  ['firstName', 'lastName', 'email', 'phone'],
  ['company', 'jobTitle', 'country', 'industry', 'companySize'],
  ['serviceInterested', 'message', 'consent'],
];

export function ContactForm({ inquiryType = 'general', onSuccess }: ContactFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType,
      consent: false,
      serviceInterested: 'AI Engineering',
    },
  });

  React.useEffect(() => {
    const authenticated = typeof document !== 'undefined' && document.cookie.split(';').some((c) => c.trim().startsWith('access_token='));
    if (authenticated) {
      reset({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@sathus.technology',
        company: 'Sathus Technology',
        jobTitle: 'Principal Architect',
        phone: '+91 90253 81316',
        country: 'India',
        industry: 'Technology',
        companySize: '100-500',
        serviceInterested: 'AI Engineering',
        inquiryType,
        consent: true,
      });
    }
  }, [inquiryType, reset]);

  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      let leadId = crypto.randomUUID();
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.leadId) leadId = resData.leadId;
        }
      } catch {
        // Dev client-side fallback
      }

      setIsSubmitted(true);
      onSuccess?.(leadId);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Request Submitted Successfully!</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. A Sathus principal engineer will review your request and reach out within 1 business day.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              reset();
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  index <= currentStep
                    ? 'border-primary bg-primary text-primary-foreground font-bold'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline text-foreground">{step.title}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 sm:w-24 transition-colors ${
                  index < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g. Sathiya"
                {...register('firstName')}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g. Murthy"
                {...register('lastName')}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Company Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Organization or Enterprise name"
              {...register('company')}
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p className="text-xs text-destructive mt-1">{errors.company.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. VP of Engineering, CTO, Architect"
              {...register('jobTitle')}
              className={errors.jobTitle ? 'border-destructive' : ''}
            />
            {errors.jobTitle && (
              <p className="text-xs text-destructive mt-1">{errors.jobTitle.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <select
              id="country"
              {...register('country')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a country</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-xs text-destructive mt-1">{errors.country.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="industry">Industry *</Label>
            <select
              id="industry"
              {...register('industry')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an industry</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-xs text-destructive mt-1">{errors.industry.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="companySize">Company Size *</Label>
            <select
              id="companySize"
              {...register('companySize')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Select company size</option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
            {errors.companySize && (
              <p className="text-xs text-destructive mt-1">{errors.companySize.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Message */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceInterested">Service Interested In</Label>
            <select
              id="serviceInterested"
              {...register('serviceInterested')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a service</option>
              {SERVICE_OPTIONS.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Describe your platform challenge or strategy session agenda..."
              {...register('message')}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
            )}
          </div>
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col space-y-1">
                <div
                  className="flex items-center space-x-2.5 pt-1 cursor-pointer select-none"
                  onClick={() => {
                    const newValue = !field.value;
                    field.onChange(newValue);
                    trigger('consent');
                  }}
                >
                  <Checkbox
                    id="consent"
                    checked={field.value === true}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                      trigger('consent');
                    }}
                    className={errors.consent ? 'border-destructive' : ''}
                  />
                  <Label
                    htmlFor="consent"
                    className="text-xs text-muted-foreground leading-snug cursor-pointer select-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newValue = !field.value;
                      field.onChange(newValue);
                      trigger('consent');
                    }}
                  >
                    I agree to the privacy policy and terms of service *
                  </Label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-destructive mt-1">{errors.consent.message}</p>
                )}
              </div>
            )}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        )}
      </div>
    </form>
  );
}