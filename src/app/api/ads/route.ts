import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');
  const countryCode = searchParams.get('country') || 'US';

  try {
    const now = new Date();
    
    // 1. INTENTO DE CARGA SEGMENTADA (PAÍS + PLACEMENT)
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        placement: placement || undefined,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { isGlobal: true },
          { targetCountry: countryCode },
          { targetCountry: null }
        ]
      },
    });

    if (ads.length > 0) return NextResponse.json(ads);

    // 2. FALLBACK ALPHA: Si no hay anuncios específicos, traer CUALQUIER anuncio activo
    // para que la interfaz no se vea vacía ("Vibras de Imperio Activo")
    const emergencyAds = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        startDate: { lte: now },
        endDate: { gte: now },
      },
      take: 3
    });

    // 3. FALLBACK FINAL: Si la base de datos está totalmente vacía de pautas vigentes,
    // devolver una pauta interna de HAWKIN pre-programada.
    if (emergencyAds.length === 0) {
      return NextResponse.json([{
        id: "hawkin-internal-01",
        companyName: "HAWKIN ELITE",
        bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
        targetUrl: "/shield",
        placement: placement || "NEWS_FEED",
        isInternal: true // Para que el componente sepa que es de la casa
      }]);
    }

    return NextResponse.json(emergencyAds);
  } catch (error) {
    console.error("Ad Engine Error:", error);
    return NextResponse.json({ error: "Fallo al cargar publicidad" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id || id.startsWith('hawkin-internal')) return NextResponse.json({ status: "skipped" });

    await prisma.adCampaign.update({
      where: { id },
      data: { clicks: { increment: 1 } }
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al registrar clic" }, { status: 500 });
  }
}
