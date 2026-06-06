import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement') || 'TOP_BANNER';
  const country = searchParams.get('country') || 'GLOBAL';

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Obtener todas las campañas que se solapen con este mes
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: 'ACTIVE',
        placement: placement,
        OR: [
          { isGlobal: true },
          { targetCountry: country }
        ],
        AND: [
          { startDate: { lte: endOfMonth } },
          { endDate: { gte: startOfMonth } }
        ]
      }
    });

    // Calcular cupos por día
    const SLOTS_PER_DAY = 5; // Límite de anuncios por día para no saturar
    const days = [];
    
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const currentDay = new Date(now.getFullYear(), now.getMonth(), i);
      const adsOnDay = ads.filter(ad => {
        const start = new Date(ad.startDate);
        const end = new Date(ad.endDate);
        return currentDay >= start && currentDay <= end;
      }).length;

      days.push({
        day: i,
        available: adsOnDay < SLOTS_PER_DAY,
        slotsTaken: adsOnDay,
        totalSlots: SLOTS_PER_DAY
      });
    }

    return NextResponse.json({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      days
    });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al calcular disponibilidad" }, { status: 500 });
  }
}
