import Link from 'next/link';
import { Lock } from 'lucide-react';

import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';

export default function AccessDeniedPage() {
  return (
    <AuthLayout
      title="Access denied"
      subtitle="You do not have permission to view this resource."
    >
      <AuthCard
        title="Access denied"
        description="You do not have permission to view this resource."
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please contact your administrator or sign in with an
            account that has access.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Return to site
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
