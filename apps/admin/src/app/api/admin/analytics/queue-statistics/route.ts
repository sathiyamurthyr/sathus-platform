import { type NextRequest } from 'next/server';
import { getQueueStatistics } from '@/lib/analytics';
import { queueStatisticsQuerySchema } from '@/lib/validation';
import { handleError, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { from, to, department } = queueStatisticsQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getQueueStatistics(from, to, department);
    return json({
      data,
      generatedAt: new Date().toISOString(),
      range: { from, to },
    });
  } catch (err) {
    return handleError(err);
  }
}
