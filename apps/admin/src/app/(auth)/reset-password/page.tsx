import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? (params.token[0] ?? '') : (params.token ?? '');

  return (
    <AuthLayout title="Reset password" subtitle="Set a new password for your account">
      <AuthCard title="Reset password" description="Set a new password for your account">
        <ResetPasswordForm token={token} />
      </AuthCard>
    </AuthLayout>
  );
}
