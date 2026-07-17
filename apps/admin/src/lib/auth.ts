import { cookies } from 'next/headers';
import { query } from './db';
import type { User, Session } from '@sathus-platform/types';
import * as crypto from 'crypto';

const SESSION_COOKIE_NAME = 'sathus-session';
const SESSION_EXPIRY_DAYS = 7;

// PBKDF2 configuration for password hashing
const HASH_ITERATIONS = 100_000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = 'sha512';

/**
 * Hash a password using PBKDF2.
 * Returns the hash and salt formatted as "iterations:salt:hash_hex"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_DIGEST
  ).toString('hex');
  return `${HASH_ITERATIONS}:${salt}:${hash}`;
}

/**
 * Verify a password against a stored PBKDF2 password hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [iterationsStr, salt, originalHash] = storedHash.split(':');
    const iterations = parseInt(iterationsStr, 10);
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      HASH_KEY_LENGTH,
      HASH_DIGEST
    ).toString('hex');
    return hash === originalHash;
  } catch (e) {
    return false;
  }
}

/**
 * Generate a secure cryptographically random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a session in the database for the given user.
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await query(
    `INSERT INTO sessions (session_token, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [token, userId, expiresAt]
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

/**
 * Validate a session token. Returns the associated user if valid, or null.
 */
export async function validateSession(token: string): Promise<User | null> {
  const sessions = await query<Session>(
    'SELECT * FROM sessions WHERE session_token = $1 AND expires_at > now()',
    [token]
  );

  if (sessions.length === 0) {
    return null;
  }

  const session = sessions[0];

  const users = await query<User>(
    'SELECT id, email, role, status, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
    [session.userId]
  );

  if (users.length === 0 || users[0].status !== 'active') {
    return null;
  }

  return users[0];
}

/**
 * Get the currently logged-in user based on session cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return validateSession(token);
}

/**
 * Terminate the current session (Logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await query('DELETE FROM sessions WHERE session_token = $1', [token]);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
