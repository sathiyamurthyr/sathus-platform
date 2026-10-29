import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAMES = ['access_token', 'refresh_token'] as const;

const PROTECTED_PREFIXES = [
  '/app',
  '/dashboard',
  '/workspace',
  '/admin',
  '/portal',
  '/console',
];

const AUTH_PREFIXES = ['/auth/'];

function parseJwtPayload(token: string): { exp?: number; sub?: string; type?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function isTokenValid(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp || !payload.sub) return false;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return false;

  const secret = process.env.JWT_SECRET;
  if (secret) {
    try {
      const parts = token.split('.');
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );
      const data = encoder.encode(`${parts[0]}.${parts[1]}`);
      const rawSig = atob(parts[2].replace(/-/g, '+').replace(/_/g, '/'));
      const sig = new Uint8Array(rawSig.length);
      for (let i = 0; i < rawSig.length; i++) {
        sig[i] = rawSig.charCodeAt(i);
      }
      return await crypto.subtle.verify('HMAC', key, sig, data);
    } catch {
      return false;
    }
  }

  return true;
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('access_token')?.value || request.cookies.get('refresh_token')?.value;
  if (!token) return false;
  return await isTokenValid(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = await isAuthenticated(request);
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (authenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/app/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|branding|branding/.*|api/.*).*)'],
};
