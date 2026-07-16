import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAMES = ['access_token', 'refresh_token'] as const;

const AUTH_ROUTES = new Set<string>([
  '/login',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/mfa',
]);

const PUBLIC_ROUTES = new Set<string>([
  '/login',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/mfa',
  '/session-expired',
  '/access-denied',
]);

const PUBLIC_API_PREFIXES = ['/api/auth/'] as const;

const DASHBOARD_URL = '/admin';
const LOGIN_URL = '/login';

function isAuthenticated(request: NextRequest): boolean {
  return AUTH_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)?.value));
}

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = isAuthenticated(request);
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isPublicRoute = PUBLIC_ROUTES.has(pathname) || isPublicApiRoute(pathname);
  const isProtectedRoute =
    pathname.startsWith('/admin') || (pathname.startsWith('/api') && !isPublicApiRoute(pathname));

  if (authenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_URL;
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_URL;
    url.search = '';
    url.searchParams.set('redirect', encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search));
    return NextResponse.redirect(url);
  }

  if (!authenticated && isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - og-image.png (default social previews)
     */
    '/((?!_next/static|_next/image|favicon.ico|og-image.png).*)',
  ],
};
