import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function SessionExpiredPage() {
  return (
    <AuthLayout title="Session expired" subtitle="Your session has ended. Please sign in again.">
      <AuthCard title="Session expired" description="Your session has ended. Please sign in again.">
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
