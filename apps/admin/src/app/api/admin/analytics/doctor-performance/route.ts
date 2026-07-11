import { type NextRequest } from 'next/server';
import { getDoctorPerformance } from '@/lib/analytics';
import { doctorPerformanceQuerySchema } from '@/lib/validation';
import { handleError, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { from, to, department, limit } = doctorPerformanceQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getDoctorPerformance(from, to, department, limit);
    return json({
      data,
      generatedAt: new Date().toISOString(),
      range: { from, to },
    });
  } catch (err) {
    return handleError(err);
  }
}
