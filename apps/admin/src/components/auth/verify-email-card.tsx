'use client';

import * as React from 'react';
import Link from 'next/link';
import { verifyEmail } from '@/lib/auth-client';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import { Alert } from '@/components/ui/alert';

interface VerifyEmailCardProps {
  token: string;
  onSuccess?: () => void;
}

function VerifyEmailCard({ token, onSuccess }: VerifyEmailCardProps) {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        await verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          setMessage('Your email has been verified successfully.');
          onSuccess?.();
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err instanceof Error ? err.message : 'Verification failed. The link may be invalid or expired.');
        }
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [token, onSuccess]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {status === 'loading' && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" role="status" aria-label="Verifying email" />
        </div>
      )}

      {status === 'success' && (
        <Alert variant="success" title="Success" icon={<CheckCircle2 className="h-4 w-4" />} role="status">
          {message}
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive" title="Error" icon={<AlertCircle className="h-4 w-4" />}>
          {message}
        </Alert>
      )}

      {status !== 'loading' && (
        <Link href="/login" className="text-sm font-medium text-primary hover:underline underline-offset-4">
          Continue to login
        </Link>
      )}
    </div>
  );
}

export { VerifyEmailCard, type VerifyEmailCardProps };
