import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { MFAVerification } from '@/components/auth/mfa-verification';

interface MFAPageProps {
  searchParams: Promise<{ email?: string | string[] }>;
}

export default async function MFAPage({ searchParams }: MFAPageProps) {
  const params = await searchParams;
  const email = Array.isArray(params.email) ? (params.email[0] ?? undefined) : params.email;

  return (
    <AuthLayout
      title="Two-factor authentication"
      subtitle="Enter the 6-digit code from your authenticator app"
    >
      <AuthCard
        title="Two-factor authentication"
        description="Enter the 6-digit code from your authenticator app"
      >
        <MFAVerification email={email} />
      </AuthCard>
    </AuthLayout>
  );
}
