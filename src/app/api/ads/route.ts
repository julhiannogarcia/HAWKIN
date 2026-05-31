import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');
  const countryCode = searchParams.get('country') || 'US';

  try {
    const now = new Date();
    
    // Buscar anuncios que:
    // 1. Estén activos
    // 2. Coincidan con la ubicación (si se pide)
    // 3. Estén dentro del rango de fechas
    // 4. Sean GLOBALES o coincidan con el PAÍS del usuario
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] }, // Permitir ambos estados para visibilidad
        placement: placement || undefined,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { isGlobal: true },
          { targetCountry: countryCode },
          { targetCountry: null } // Si no tiene país, es global por defecto
        ]
      },
    });

    // Fallback: Si no hay anuncios locales, traer globales para no dejar el espacio vacío
    if (ads.length === 0) {
      const globalFallback = await prisma.adCampaign.findMany({
        where: {
          status: 'ACTIVE',
          startDate: { lte: now },
          endDate: { gte: now },
          isGlobal: true
        },
        take: 3
      });
      return NextResponse.json(globalFallback);
    }

    return NextResponse.json(ads);
  } catch (error) {
    console.error("Ad Engine Error:", error);
    return NextResponse.json({ error: "Fallo al cargar publicidad" }, { status: 500 });
  }
}

// Registro de clics
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.adCampaign.update({
      where: { id },
      data: {
        clicks: { increment: 1 }
      }
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al registrar clic" }, { status: 500 });
  }
}
