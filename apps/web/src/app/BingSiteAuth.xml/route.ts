import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `<?xml version="1.0"?>
<users>
	<user>9EFF30B76BF1119CD257D4E864713973</user>
</users>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
