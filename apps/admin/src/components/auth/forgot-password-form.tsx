'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPasswordSchema } from '@/lib/auth-validation';
import { forgotPassword } from '@/lib/auth-client';

import { EmailInput } from './email-input';
import { LoadingButton } from './loading-button';
import { SuccessAlert } from './success-alert';

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await forgotPassword(values.email);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <EmailInput
          id="email"
          placeholder="you@sathusplatform.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <LoadingButton type="submit" className="w-full" isLoading={isSubmitting}>
        Send reset link
      </LoadingButton>

      {submitted && (
        <SuccessAlert message="If an account exists, a reset link has been sent." className="mt-4" />
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export { ForgotPasswordForm };
