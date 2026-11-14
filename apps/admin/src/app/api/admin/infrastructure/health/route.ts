import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedInfrastructureTelemetry } from '@/lib/infrastructure-monitor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const telemetry = await getUnifiedInfrastructureTelemetry(forceRefresh);

    return NextResponse.json(telemetry, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    console.error('[API Infrastructure Health] Fatal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve infrastructure telemetry',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
