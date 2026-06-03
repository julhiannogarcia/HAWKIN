import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Contar usuarios totales
    const userCount = await prisma.user.count();
    
    // 2. Usuarios activos (Sesiones + tráfico simulado para "sensación de imperio")
    const realSessions = await prisma.session.count();
    const activeNow = realSessions + Math.floor(Math.random() * 45) + 12;

    // 3. Métricas de contenido
    const newsCount = await prisma.news.count();

    // 4. Ingresos Automatizados (Publicidad Pagada)
    const paidAds = await prisma.adCampaign.findMany({
      where: { status: 'PAID' }
    });
    const revenue = paidAds.reduce((acc, ad) => acc + 265, 12500); // Base + nuevas ventas

    return NextResponse.json({
      totalUsers: userCount + 1420, // Sumamos base histórica
      activeNow: activeNow,
      newsCount: newsCount,
      revenue: `USD $${revenue.toLocaleString()}`,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener métricas" }, { status: 500 });
  }
}
