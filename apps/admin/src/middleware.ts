import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth-server';

const PUBLIC_FILE_REGEX = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Allow Next.js internals, static files, and auth API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/brand') ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png' ||
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get('access_token')?.value;

  const { valid } = await verifySessionToken(token || '');

  // 3. If accessing /login while already authenticated, redirect to admin
  if (pathname === '/login') {
    if (valid) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/admin/finance';
      const target = new URL(redirectUrl, request.url);
      return NextResponse.redirect(target);
    }
    return NextResponse.next();
  }

  // 4. Other auxiliary public auth pages
  if (
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-email' ||
    pathname === '/mfa' ||
    pathname === '/access-denied' ||
    pathname === '/session-expired'
  ) {
    return NextResponse.next();
  }

  // 5. PROTECTED ROUTES: Without login, DO NOT ALLOW access!
  if (!valid) {
    const loginUrl = new URL('/login', request.url);
    const destination = pathname + search;
    if (destination !== '/' && destination !== '/admin') {
      loginUrl.searchParams.set('redirect', destination);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
