/**
 * Server-side authentication and session token management.
 * Credentials and secrets are resolved dynamically from environment variables.
 */

export function getAdminUid(): string {
  return process.env.ADMIN_UID || '9884465374';
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'vino';
}

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET || 'sathus_admin_enterprise_auth_secret_2026';
}

export const AUTH_COOKIE_NAME = 'sathus_admin_session';

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyAdminCredentials(uidInput: string, passwordInput: string): Promise<boolean> {
  const targetUid = getAdminUid().trim();
  const targetPassword = getAdminPassword().trim();
  const cleanUid = (uidInput || '').trim();
  const cleanPassword = (passwordInput || '').trim();

  return cleanUid === targetUid && cleanPassword === targetPassword;
}

export async function createSessionToken(uid: string, rememberMe = false): Promise<string> {
  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const exp = Date.now() + durationMs;
  const payload = JSON.stringify({
    uid,
    role: 'SUPER_ADMIN',
    name: 'Sathiya Murthy',
    exp,
  });

  const payloadB64 = Buffer.from(payload).toString('base64url');
  const signature = await hmacSha256(payloadB64, getAuthSecret());
  return `${payloadB64}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<{ valid: boolean; uid?: string; name?: string }> {
  try {
    if (!token) return { valid: false };
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signature] = parts;
    const expectedSignature = await hmacSha256(payloadB64, getAuthSecret());
    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const data = JSON.parse(payloadJson);

    if (!data.exp || Date.now() > data.exp) {
      return { valid: false };
    }

    return { valid: true, uid: data.uid, name: data.name };
  } catch {
    return { valid: false };
  }
}
