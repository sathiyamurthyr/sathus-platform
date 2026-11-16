'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [uid, setUid] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const redirectTarget = React.useMemo(() => {
    const param = searchParams?.get('redirect');
    if (param && param.startsWith('/')) {
      return decodeURIComponent(param);
    }
    return '/admin/finance';
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanUid = uid.trim();
    const cleanPassword = password.trim();

    if (!cleanUid) {
      setFormError('Please enter your User ID or Mobile Number.');
      return;
    }
    if (!cleanPassword) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: cleanUid,
          password: cleanPassword,
          rememberMe,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please verify your User ID and password.');
      }

      // Persist auth status in client storage for offline/component awareness
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', 'authenticated');
        localStorage.setItem('sathus_admin_uid', cleanUid);
      }

      onSuccess?.();

      // Full navigation ensures cookies and server middleware state update cleanly
      window.location.href = redirectTarget;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setFormError(msg);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-medium leading-tight">{formError}</span>
        </div>
      )}

      {/* User ID / Mobile Input */}
      <div className="space-y-1.5">
        <label htmlFor="uid" className="block text-xs font-semibold text-foreground">
          User ID / Mobile Number
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="uid"
            type="text"
            autoComplete="username"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            disabled={isLoading}
            placeholder="Enter User ID or Mobile"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none transition-colors focus:border-[#A20A3A] focus:ring-1 focus:ring-[#A20A3A]"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-semibold text-foreground">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-10 text-sm placeholder:text-muted-foreground outline-none transition-colors focus:border-[#A20A3A] focus:ring-1 focus:ring-[#A20A3A]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-input text-[#A20A3A] focus:ring-[#A20A3A]"
          />
          <span>Remember me on this browser</span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 bg-[#A20A3A] hover:bg-[#85082e] text-white font-semibold text-sm shadow-xs transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
          </span>
        ) : (
          'Sign in to Sathus Admin'
        )}
      </Button>
    </form>
  );
}
