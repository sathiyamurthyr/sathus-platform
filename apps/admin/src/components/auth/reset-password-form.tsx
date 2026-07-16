'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPasswordSchema } from '@/lib/auth-validation';
import { resetPassword } from '@/lib/auth-client';

import { PasswordInput } from './password-input';
import { LoadingButton } from './loading-button';
import { SuccessAlert } from './success-alert';

interface ResetPasswordFormProps {
  token: string;
}

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    await resetPassword(token, values.password);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'newPassword-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id="newPassword-error" className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-xs text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <LoadingButton type="submit" className="w-full" isLoading={isSubmitting}>
        Reset password
      </LoadingButton>

      {submitted && (
        <SuccessAlert message="Your password has been reset successfully." className="mt-4" />
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export { ResetPasswordForm, type ResetPasswordFormProps };
