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
      where: { status: 'ACTIVE' }
    });

    // Subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' }
    });

    const revenue = revenueMetrics._sum.amount || 0;

    return NextResponse.json({
      totalUsers: userCount,
      activeNow: activeSessions,
      newsCount: newsCount,
      activeAds: activeAds,
      activeSubscriptions: activeSubscriptions,
      revenue: `USD $${revenue.toLocaleString()}`,
      rawRevenue: revenue,
      mrr: revenue * 0.1 // Base calculation if we derive MRR from DB (requires better subscription logic later)
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener métricas reales" }, { status: 500 });
  }
}
