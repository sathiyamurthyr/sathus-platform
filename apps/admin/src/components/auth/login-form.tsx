'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '@/lib/auth-validation';
import { login as authLogin } from '@/lib/auth-client';

import { EmailInput } from './email-input';
import { PasswordInput } from './password-input';
import { RememberMeCheckbox } from './remember-me-checkbox';
import { LoadingButton } from './loading-button';
import { ErrorAlert } from './error-alert';

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues & { rememberMe?: boolean }>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const rememberMe = watch('rememberMe') ?? false;

  const onSubmit = async (values: LoginFormValues & { rememberMe?: boolean }) => {
    try {
      setFormError(null);
      await authLogin(values.email, values.password, values.rememberMe ?? false);
      onSuccess?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed');
    }
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

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <RememberMeCheckbox
          checked={rememberMe}
          onChange={(checked) => setValue('rememberMe', checked)}
          disabled={isSubmitting}
        />
        <Link href="/forgot-password" className="text-sm text-primary hover:underline underline-offset-4">
          Forgot password?
        </Link>
      </div>

      <LoadingButton type="submit" className="w-full" isLoading={isSubmitting}>
        Sign in
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/verify-email" className="text-primary hover:underline underline-offset-4">
          Resend verification
        </Link>
      </p>

      {formError && <ErrorAlert message={formError} className="mt-4" />}
    </form>
  );
}

export { LoginForm, type LoginFormProps };
