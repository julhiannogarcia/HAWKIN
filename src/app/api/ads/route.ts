import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');
  const countryCode = searchParams.get('country');

  try {
    const now = new Date();
    
    // 1. INTENTO DE CARGA SEGMENTADA
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        placement: placement || undefined,
        startDate: { lte: now },
        endDate: { gte: new Date(new Date().setHours(0,0,0,0)) },
        OR: [
          { isGlobal: true },
          { targetCountry: countryCode || undefined },
          { targetCountry: null }
        ]
      },
    });

    if (ads.length > 0) {
      return NextResponse.json(ads);
    }

    // 2. FALLBACK GLOBAL: Cualquier anuncio activo sin importar placement
    const globalAds = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        startDate: { lte: now },
        endDate: { gte: new Date(new Date().setHours(0,0,0,0)) },
      },
      take: 5
    });

    if (globalAds.length > 0) {
      return NextResponse.json(globalAds);
    }

    // 3. FALLBACK INSTITUCIONAL (Garantía de visualización)
    // Si la DB está vacía, devolvemos pautas de la casa.
    const institutionalAds = [
      {
        id: "hawkin-academy-01",
        companyName: "HAWKIN ACADEMY",
        bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
        targetUrl: "/academy",
        placement: placement || "TOP_BANNER",
        isInternal: true
      },
      {
        id: "hawkin-b2b-01",
        companyName: "HAWKIN B2B",
        bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
        targetUrl: "/b2b",
        placement: placement || "SIDEBAR",
        isInternal: true
      }
    ];

    return NextResponse.json(institutionalAds);

  } catch (error) {
    console.error("[ADS API] Critical Failure:", error);
    // Retornamos fallback incluso en error de DB para no romper el front
    return NextResponse.json([{
      id: "err-fallback",
      companyName: "HAWKIN INTEL",
      bannerUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
      targetUrl: "/",
      placement: "TOP_BANNER"
    }]);
  }
}
