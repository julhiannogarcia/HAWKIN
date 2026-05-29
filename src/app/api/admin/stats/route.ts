import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const activeUsers = await prisma.session.count(); // Aproximación de usuarios con sesión activa
    const totalRevenue = await prisma.adCampaign.aggregate({
      _sum: {
        clicks: true, // Esto es solo un ejemplo, deberíamos tener un campo de monto real
      }
    });

    return NextResponse.json({
      totalUsers: userCount,
      activeNow: activeUsers,
      revenue: "S/ 48,250", // Mantengo el mock por ahora hasta tener pagos reales en DB
    });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener métricas" }, { status: 500 });
  }
}
