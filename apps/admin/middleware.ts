import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration: Session Cookie name
const SESSION_COOKIE_NAME = 'sathus-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  // 1. Guard API routes under /api/admin
  if (pathname.startsWith('/api/admin')) {
    // Exclude authentication API endpoints
    if (pathname.startsWith('/api/admin/auth')) {
      return NextResponse.next();
    }

    if (!hasSession) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Session missing or expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Guard Page routes under /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      // Redirect unauthenticated user to login screen
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect authenticated users away from Login page (/)
  if (pathname === '/') {
    if (hasSession) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
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
