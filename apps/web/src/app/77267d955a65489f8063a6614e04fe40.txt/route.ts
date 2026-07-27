import { NextResponse } from 'next/server';

export async function GET() {
  const key = '77267d955a65489f8063a6614e04fe40';
  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
