import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function json<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function badRequest(message: string, details?: unknown): NextResponse {
  return NextResponse.json({ error: 'bad_request', message, details }, { status: 400 });
}

export function internalError(message = 'Internal server error'): NextResponse {
  return NextResponse.json({ error: 'internal_error', message }, { status: 500 });
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return badRequest('Invalid query parameters', err.flatten());
  }
  console.error('[analytics]', err);
  return internalError();
}
