import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <AuthCard title="Welcome back" description="Sign in to your account">
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
