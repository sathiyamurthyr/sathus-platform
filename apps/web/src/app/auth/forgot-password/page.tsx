'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070810] text-foreground flex items-center justify-center p-4 relative overflow-hidden font-inter">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center">
          <Logo size="lg" showWordmark={true} />
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Reset your password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will send you instructions to reset your password
          </p>
        </div>

        <div className="bg-card/50 border border-border/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 border border-primary/20 text-primary text-sm rounded-lg p-4 leading-relaxed">
                Check your email. We have sent password reset instructions to <strong className="text-foreground">{email}</strong>.
              </div>
              <Button className="w-full" asChild>
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Sending reset link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Secured by Sathus Access Manager.</span>
        </div>
      </div>
    </div>
  );
}
