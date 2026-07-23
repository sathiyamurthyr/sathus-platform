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

function isAuthenticated(request: NextRequest): boolean {
  return AUTH_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)?.value));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = isAuthenticated(request);
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
