import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scanOfficialReleases } from '@/lib/releasesWatch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CACHE_MS = 86_400_000;
let cached: { payload: unknown; at: number } | null = null;

async function logScanToAudit(result: Awaited<ReturnType<typeof scanOfficialReleases>>) {
  try {
    await prisma.auditLog.create({
      data: {
        action: 'ARENA_RELEASES_WATCH',
        userName: 'system',
        details: JSON.stringify({
          alertCount: result.alerts.length,
          staleCount: result.staleModels.length,
          feedItemCount: result.feedItemCount,
          alerts: result.alerts.slice(0, 5),
          staleModels: result.staleModels.slice(0, 5),
          scannedAt: result.scannedAt,
        }),
        status: result.alerts.length > 0 ? 'WARN' : 'SUCCESS',
      },
    });
  } catch {
    // BD opcional
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === '1' || searchParams.get('cron') === '1';
  const now = Date.now();

  if (!force && cached && now - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const result = await scanOfficialReleases();

    if (force || searchParams.get('cron') === '1') {
      await logScanToAudit(result);
    }

    const payload = {
      ...result,
      message:
        result.alerts.length > 0
          ? `${result.alerts.length} release(s) no listados en Arena`
          : 'Catálogo alineado con feeds oficiales',
    };

    cached = { payload, at: now };
    return NextResponse.json(payload);
  } catch (error) {
    console.error('RELEASES WATCH ERR:', error);
    return NextResponse.json({
      alerts: [],
      staleModels: [],
      scannedAt: new Date().toISOString(),
      feedItemCount: 0,
      error: true,
      message: 'Sin datos del watch',
    });
  }
}

export async function POST() {
  return GET(new Request('http://local/api/intelligence/releases-watch?force=1'));
}
