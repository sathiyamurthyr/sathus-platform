import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function SessionExpiredPage() {
  return (
    <AuthLayout title="Session expired" subtitle="Your session has ended. Please sign in again.">
      <AuthCard title="Session expired" description="Your session has ended. Please sign in again.">
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
