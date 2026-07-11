import { type NextRequest } from 'next/server';
import { getBedOccupancy } from '@/lib/analytics';
import { bedOccupancyQuerySchema } from '@/lib/validation';
import { handleError, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { ward } = bedOccupancyQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getBedOccupancy(ward);
    return json({ data, generatedAt: new Date().toISOString() });
  } catch (err) {
    return handleError(err);
  }
}
