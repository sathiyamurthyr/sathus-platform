import { type NextRequest } from 'next/server';
import { getOverview } from '@/lib/analytics';
import { overviewQuerySchema } from '@/lib/validation';
import { handleError, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { from, to } = overviewQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getOverview(from, to);
    return json({
      data,
      generatedAt: new Date().toISOString(),
      range: { from, to },
    });
  } catch (err) {
    return handleError(err);
  }
}
