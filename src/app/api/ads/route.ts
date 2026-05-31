import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');

  try {
    const now = new Date();
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: 'ACTIVE',
        placement: placement || undefined,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // Si no hay anuncios para esa ubicación, traer cualquiera que sea global
    if (ads.length === 0 && placement) {
      const globalAds = await prisma.adCampaign.findMany({
        where: {
          status: 'ACTIVE',
          startDate: { lte: now },
          endDate: { gte: now },
        },
        take: 5
      });
      return NextResponse.json(globalAds);
    }

    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al cargar publicidad" }, { status: 500 });
  }
}

// Endpoint para registrar clics
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
