import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scanOfficialReleases } from '@/lib/releasesWatch';
import { getActiveArenaModels, daysSinceRelease } from '@/lib/arenaModels';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scan = await scanOfficialReleases();
    const catalog = getActiveArenaModels().map((m) => ({
      slug: m.slug,
      name: m.name,
      company: m.company,
      releaseDate: m.releaseDate || null,
      daysSinceRelease: daysSinceRelease(m.releaseDate),
      hasConfirmedRelease: Boolean(m.releaseDate && m.whatsNewConfirmed),
    }));

    let recentAudit: unknown[] = [];
    try {
      recentAudit = await prisma.auditLog.findMany({
        where: { action: { startsWith: 'ARENA_' } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      catalog,
      alerts: scan.alerts,
      staleModels: scan.staleModels,
      scannedAt: scan.scannedAt,
      recentAudit,
    });
  } catch (error) {
    console.error('ADMIN ARENA GET ERR:', error);
    return NextResponse.json({ error: 'Error cargando Arena admin' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, action, title, reviewedBy } = body as {
      alertId: string;
      action: 'APPROVE' | 'REJECT';
      title?: string;
      reviewedBy?: string;
    };

    if (!alertId || !action) {
      return NextResponse.json({ error: 'alertId y action requeridos' }, { status: 400 });
    }

    const logAction = action === 'APPROVE' ? 'ARENA_ALERT_APPROVED' : 'ARENA_ALERT_REJECTED';

    await prisma.auditLog.create({
      data: {
        action: logAction,
        userName: reviewedBy || 'admin',
        details: JSON.stringify({ alertId, title, note: 'Revisión manual — actualizar catálogo en código si se aprueba' }),
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({ ok: true, alertId, action });
  } catch (error) {
    console.error('ADMIN ARENA PATCH ERR:', error);
    return NextResponse.json({ error: 'Error registrando revisión' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const scan = await scanOfficialReleases();
    await prisma.auditLog.create({
      data: {
        action: 'ARENA_RELEASES_WATCH',
        userName: 'admin',
        details: JSON.stringify({
          alertCount: scan.alerts.length,
          staleCount: scan.staleModels.length,
          scannedAt: scan.scannedAt,
        }),
        status: scan.alerts.length > 0 ? 'WARN' : 'SUCCESS',
      },
    });
    return NextResponse.json({ ok: true, ...scan });
  } catch (error) {
    console.error('ADMIN ARENA SCAN ERR:', error);
    return NextResponse.json({ error: 'Error ejecutando scan' }, { status: 500 });
  }
}
