'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { contactFormSchema, step1Schema, step2Schema, step3Schema } from '../../validation';
import type { ContactFormData, InquiryType } from '../../types';
import { INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS, COUNTRY_OPTIONS, SERVICE_OPTIONS } from '../../types';

interface ContactFormProps {
  inquiryType?: InquiryType;
  onSuccess?: (leadId: string) => void;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information', schema: step1Schema },
  { id: 'company', title: 'Company Information', schema: step2Schema },
  { id: 'message', title: 'Message', schema: step3Schema },
];

export function ContactForm({ inquiryType = 'general', onSuccess }: ContactFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType,
      consent: false,
    },
  });

  const nextStep = async () => {
    const currentSchema = STEPS[currentStep].schema;
    const isStepValid = await trigger(STEPS[currentStep].schema.keyof().parse(undefined) as any);
    
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const leadId = crypto.randomUUID();
      onSuccess?.(leadId);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index <= currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">{step.title}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 sm:w-24 ${
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
                {...register('firstName')}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
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
              {...register('company')}
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p className="text-sm text-destructive mt-1">{errors.company.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              {...register('jobTitle')}
              className={errors.jobTitle ? 'border-destructive' : ''}
            />
            {errors.jobTitle && (
              <p className="text-sm text-destructive mt-1">{errors.jobTitle.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <select
              id="country"
              {...register('country')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a country</option>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="industry">Industry *</Label>
            <select
              id="industry"
              {...register('industry')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select an industry</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-sm text-destructive mt-1">{errors.industry.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="companySize">Company Size *</Label>
            <select
              id="companySize"
              {...register('companySize')}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select company size</option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
            {errors.companySize && (
              <p className="text-sm text-destructive mt-1">{errors.companySize.message}</p>
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
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
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
              rows={5}
              {...register('message')}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
            )}
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              {...register('consent')}
              className={errors.consent ? 'border-destructive' : ''}
            />
            <Label htmlFor="consent" className="text-sm">
              I agree to the privacy policy and terms of service *
            </Label>
          </div>
          {errors.consent && (
            <p className="text-sm text-destructive">{errors.consent.message}</p>
          )}
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
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </form>
  );
}