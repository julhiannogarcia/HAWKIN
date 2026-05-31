import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { companyName, bannerUrl, targetUrl, placement, startDate, endDate, status } = await req.json();

    if (!companyName || !bannerUrl || !placement) {
      return NextResponse.json({ error: "Faltan datos obligatorios para la campaña" }, { status: 400 });
    }

    const campaign = await prisma.adCampaign.create({
      data: {
        companyName,
        bannerUrl,
        targetUrl: targetUrl || null,
        placement,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días por defecto
        status: status || "ACTIVE",
      }
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("DEBUG - B2B CREATION ERROR:", error);
    return NextResponse.json({ 
      error: "DATABASE_CONNECTION_ERROR", 
      message: `${error.code || 'ERROR'}: ${error.message || 'Error desconocido al inyectar pauta.'}`
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const campaigns = await prisma.adCampaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las pautas" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, companyName, bannerUrl, targetUrl, placement, startDate, endDate, status } = await req.json();

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: {
        companyName,
        bannerUrl,
        targetUrl,
        placement,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      }
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("DEBUG - B2B UPDATE ERROR:", error);
    return NextResponse.json({ 
      error: "DATABASE_UPDATE_ERROR", 
      message: `${error.code || 'ERROR'}: ${error.message || 'Error al actualizar la pauta.'}`
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.adCampaign.delete({
      where: { id }
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Error al eliminar la pauta" }, { status: 500 });
  }
}
