import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully.',
  });

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set(AUTH_COOKIE_NAME, '', clearOptions);
  response.cookies.set('access_token', '', clearOptions);
  response.cookies.set('refresh_token', '', clearOptions);

  return response;
}

export async function GET() {
  return POST();
}
