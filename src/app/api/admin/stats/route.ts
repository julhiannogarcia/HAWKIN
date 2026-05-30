import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Contar usuarios reales en la DB
    const userCount = await prisma.user.count();
    
    // 2. Contar sesiones activas (aproximación de usuarios online)
    const activeSessions = await prisma.session.count();

    // 3. Contar noticias publicadas
    const newsCount = await prisma.news.count();

    return NextResponse.json({
      totalUsers: userCount,
      activeNow: activeSessions,
      newsCount: newsCount,
      revenue: "S/ 48,250", // Esto se automatizará cuando Stripe/PayPal guarden en DB
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener métricas" }, { status: 500 });
  }
}
