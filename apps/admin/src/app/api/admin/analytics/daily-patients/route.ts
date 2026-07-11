import { type NextRequest } from 'next/server';
import { getDailyPatients } from '@/lib/analytics';
import { dailyPatientsQuerySchema } from '@/lib/validation';
import { handleError, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { from, to } = dailyPatientsQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getDailyPatients(from, to);
    return json({
      data,
      generatedAt: new Date().toISOString(),
      range: { from, to },
    });
  } catch (err) {
    return handleError(err);
  }
}
