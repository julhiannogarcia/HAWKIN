import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');

  try {
    const now = new Date();
    
    // 1. INTENTO DE CARGA DESDE DB
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

    // 2. FALLBACK INSTITUCIONAL PRO (EL "COMERCIAL" QUE EL USUARIO EXTRAÑA)
    // Usamos el video de alto impacto de HAWKIN ACADEMY como respaldo global
    const institutionalAds = [
      {
        id: "hawkin-commercial-01",
        companyName: "HAWKIN ACADEMY",
        // Video de los cubos 3D de alta calidad
        bannerUrl: "https://player.vimeo.com/video/949285093?autoplay=1&muted=1&loop=1&background=1",
        targetUrl: "/academy",
        placement: placement || "TOP_BANNER",
        isInternal: true
      },
      {
        id: "hawkin-intel-01",
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
      id: "err-fallback",
      companyName: "HAWKIN ACADEMY",
      bannerUrl: "https://player.vimeo.com/video/949285093?autoplay=1&muted=1&loop=1&background=1",
      targetUrl: "/academy",
      placement: "TOP_BANNER"
    }]);
  }
}
