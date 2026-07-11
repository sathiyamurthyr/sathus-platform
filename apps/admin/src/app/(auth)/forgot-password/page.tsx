import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email to receive a reset link">
      <AuthCard title="Forgot password" description="Enter your email to receive a reset link">
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
