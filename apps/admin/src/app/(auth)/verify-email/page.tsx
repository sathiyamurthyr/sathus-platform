import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { VerifyEmailCard } from '@/components/auth/verify-email-card';

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? (params.token[0] ?? '') : (params.token ?? '');

  return (
    <AuthLayout title="Verify email" subtitle="Confirm your email address">
      <AuthCard title="Verify email" description="Confirm your email address">
        <VerifyEmailCard token={token} />
      </AuthCard>
    </AuthLayout>
  );
}
