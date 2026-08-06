import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Métricas públicas mínimas (sin revenue ni datos sensibles). */
export async function GET() {
  try {
    const newsCount = await prisma.news.count();
    const adMetrics = await prisma.adCampaign.aggregate({
      _sum: { views: true, clicks: true },
    });
    const totalAdViews = adMetrics._sum.views || 0;
    const totalAdClicks = adMetrics._sum.clicks || 0;
    const ctr = totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(1) : '0.0';

    return NextResponse.json({
      newsCount,
      totalAdViews,
      totalAdClicks,
      adCtr: `${ctr}%`,
      status: newsCount > 0 || totalAdViews > 0 ? 'ok' : 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      newsCount: 0,
      totalAdViews: 0,
      totalAdClicks: 0,
      adCtr: '0.0%',
      status: 'Sin datos nuevos',
      error: true,
    });
  }
}
