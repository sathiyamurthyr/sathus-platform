'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, Loader2, Sparkles } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Engineering Blog Newsletter' }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border border-primary/20 bg-card p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Engineering Dispatch
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Stay Ahead of AI & Cloud Architecture
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto">
              Get peer-reviewed technical whitepapers, evaluation benchmarks, and architecture postmortems delivered directly to your inbox.
            </p>
          </div>

          {status === 'success' ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 max-w-md mx-auto space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-foreground">Subscription Confirmed!</h4>
              <p className="text-xs text-muted-foreground">
                You're all set! You'll receive our monthly engineering whitepaper release notes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter.your@company.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-xs md:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={status === 'loading'}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-xl px-6 font-bold shadow-md shadow-primary/20 shrink-0"
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>

              {status === 'error' && (
                <p className="text-xs font-semibold text-destructive">{errorMessage}</p>
              )}

              <p className="text-[11px] text-muted-foreground/80">
                No spam. Unsubscribe at any time. Respecting your privacy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}