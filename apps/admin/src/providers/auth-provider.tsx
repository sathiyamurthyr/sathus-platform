'use client';

import * as React from 'react';
import type { User, AuthTokens, MFASetupResponse } from '@/types/auth';
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  refreshTokens,
  getCurrentUser,
  enableMFA as authEnableMFA,
  disableMFA as authDisableMFA,
  clearAuth,
} from '@/lib/auth-client';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchUser: () => Promise<void>;
  enableMFA: () => Promise<MFASetupResponse>;
  disableMFA: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function persistTokens(tokens: AuthTokens | null): void {
  if (tokens) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  } else {
    clearAuth();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const setTokens = React.useCallback((tokens: AuthTokens | null) => {
    persistTokens(tokens);
    setState((prev) => ({ ...prev, tokens }));
  }, []);

  const setUser = React.useCallback((user: User | null) => {
    setState((prev) => ({ ...prev, user, isAuthenticated: user !== null }));
  }, []);

  const fetchUser = React.useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [setUser]);

  const refreshToken = React.useCallback(async () => {
    const refreshTokenValue = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshTokenValue) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const tokens = await refreshTokens(refreshTokenValue);
      setTokens(tokens);
    } catch {
      clearAuth();
      setState((prev) => ({ ...prev, user: null, tokens: null, isAuthenticated: false, isLoading: false }));
    }
  }, [setTokens]);

  React.useEffect(() => {
    const initAuth = async () => {
      const refreshTokenValue = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (refreshTokenValue) {
        try {
          const tokens = await refreshTokens(refreshTokenValue);
          setTokens(tokens);
          const user = await getCurrentUser();
          setUser(user);
        } catch {
          clearAuth();
          setState((prev) => ({ ...prev, user: null, tokens: null, isAuthenticated: false, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    void initAuth();
  }, [setTokens, setUser]);

  const loginFn = React.useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const tokens = await authLogin(email, password, rememberMe);
      setTokens(tokens);
      const user = await getCurrentUser();
      setUser(user);
    },
    [setTokens, setUser],
  );

  const logoutFn = React.useCallback(async () => {
    const refreshTokenValue = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    try {
      if (refreshTokenValue) {
        await authLogout(refreshTokenValue);
      }
    } finally {
      clearAuth();
      setState({ user: null, tokens: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const registerFn = React.useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const user = await authRegister(email, password, firstName, lastName);
      setUser(user);
    },
    [setUser],
  );

  const enableMFAFn = React.useCallback(async () => {
    return authEnableMFA();
  }, []);

  const disableMFAFn = React.useCallback(async () => {
    await authDisableMFA();
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, mfaEnabled: false } : null,
    }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login: loginFn,
    logout: logoutFn,
    register: registerFn,
    refreshToken,
    fetchUser,
    enableMFA: enableMFAFn,
    disableMFA: disableMFAFn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
