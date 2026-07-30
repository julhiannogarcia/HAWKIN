import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const activeSessions = await prisma.session.count();
    const newsCount = await prisma.news.count();
    
    // Sum real revenue metrics
    const revenueMetrics = await prisma.revenueMetric.aggregate({
      _sum: { amount: true }
    });
    
    // Active campaigns
    const activeAds = await prisma.adCampaign.count({
      where: { status: { in: ['ACTIVE', 'PAID'] } }
    });

    const adMetrics = await prisma.adCampaign.aggregate({
      _sum: { views: true, clicks: true },
    });

    const adRevenue = await prisma.revenueMetric.aggregate({
      where: { type: 'ADVERTISING' },
      _sum: { amount: true },
    });

    // Subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' }
    });

    const revenue = revenueMetrics._sum.amount || 0;
    const totalAdViews = adMetrics._sum.views || 0;
    const totalAdClicks = adMetrics._sum.clicks || 0;
    const ctr = totalAdViews > 0 ? ((totalAdClicks / totalAdViews) * 100).toFixed(1) : '0.0';

    return NextResponse.json({
      totalUsers: userCount,
      activeNow: activeSessions,
      newsCount: newsCount,
      activeAds: activeAds,
      activeSubscriptions: activeSubscriptions,
      revenue: `USD $${revenue.toLocaleString()}`,
      rawRevenue: revenue,
      adRevenue: adRevenue._sum.amount || 0,
      totalAdViews,
      totalAdClicks,
      adCtr: `${ctr}%`,
      mrr: revenue * 0.1 // Estimado hasta conectar Stripe completo
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener métricas reales" }, { status: 500 });
  }
}
