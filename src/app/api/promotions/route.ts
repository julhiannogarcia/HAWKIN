import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');

  try {
    const now = new Date();
    
    // 1. INTENTO DE CARGA DESDE DB (CAMPANAS REALES)
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        placement: placement || undefined,
        startDate: { lte: now },
        endDate: { gte: new Date(new Date().setHours(0,0,0,0)) },
      },
    });

    if (ads.length > 0) {
      return NextResponse.json(ads);
    }

    // 2. FALLBACK INSTITUCIONAL PRO (EL COMERCIAL 3D ORIGINAL)
    // Usamos video nativo de respaldo para garantizar visualización sin fallos de API externa
    const institutionalAds = [
      {
        id: "hawkin-academy-premium-3d",
        companyName: "HAWKIN ACADEMY",
        // Enlace directo a video de alta fidelidad (Unsplash/Nativo)
        bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
        targetUrl: "/academy",
        placement: placement || "TOP_BANNER",
        isInternal: true
      },
      {
        id: "hawkin-intel-standard",
        companyName: "HAWKIN INTELLIGENCE",
        bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
        targetUrl: "/b2b",
        placement: placement || "SIDEBAR",
        isInternal: true
      }
    ];

    return NextResponse.json(institutionalAds);

  } catch (error) {
    console.error("[ADS API] Critical Failure:", error);
    return NextResponse.json([{
      id: "err-system-fallback",
      companyName: "HAWKIN ACADEMY",
      bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
      targetUrl: "/academy",
      placement: "TOP_BANNER"
    }]);
  }
}
