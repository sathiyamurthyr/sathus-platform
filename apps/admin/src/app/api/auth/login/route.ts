import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const uid = String(body.uid || body.email || body.username || '').trim();
    const password = String(body.password || '').trim();
    const rememberMe = Boolean(body.rememberMe);

    if (!uid || !password) {
      return NextResponse.json(
        { success: false, message: 'User ID and Password are required.' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(uid, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your User ID and password.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(uid, rememberMe);
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day
    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        uid,
        name: 'Sathiya Murthy',
        role: 'SUPER_ADMIN',
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge,
    };

    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
    response.cookies.set('access_token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('[Auth API] Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred during authentication.' },
      { status: 500 }
    );
  }
}
