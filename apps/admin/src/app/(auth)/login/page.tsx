import { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In · Sathus Admin',
  description: 'Sign in to access Sathus Admin console.',
};

export default function LoginPage() {
  return (
    <AuthLayout title="Sathus Admin" subtitle="Enterprise Administration Console">
      <AuthCard title="Administrator Sign In" description="Enter your User ID / Mobile and password to continue">
        <Suspense
          fallback={
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
