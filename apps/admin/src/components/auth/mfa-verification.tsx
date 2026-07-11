'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mfaVerifySchema } from '@/lib/auth-validation';
import { verifyMFA } from '@/lib/auth-client';

import { PasswordInput } from './password-input';
import { LoadingButton } from './loading-button';

interface MFAVerificationProps {
  email?: string;
  onSuccess?: (tokens: { accessToken: string; refreshToken: string; expiresIn: number }) => void;
}

type MFAVerifyValues = z.infer<typeof mfaVerifySchema>;

const DASHBOARD_URL = '/admin';

function MFAVerification({ onSuccess }: MFAVerificationProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MFAVerifyValues>({
    resolver: zodResolver(mfaVerifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (values: MFAVerifyValues) => {
    const tokens = await verifyMFA(values.code);
    if (onSuccess) {
      onSuccess(tokens);
    } else {
      router.push(DASHBOARD_URL);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="code" className="text-sm font-medium">Authentication code</label>
        <PasswordInput
          id="code"
          placeholder="123456"
          aria-invalid={errors.code ? 'true' : 'false'}
          aria-describedby={errors.code ? 'code-error' : undefined}
          {...register('code')}
        />
        {errors.code && (
          <p id="code-error" className="text-xs text-destructive" role="alert">
            {errors.code.message}
          </p>
        )}
      </div>

      <LoadingButton type="submit" className="w-full" isLoading={isSubmitting}>
        Verify
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export { MFAVerification, type MFAVerificationProps };
