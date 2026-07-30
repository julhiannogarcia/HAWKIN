import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function logAudit(action: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: { action, details, userName: 'Admin', status: 'SUCCESS' },
    });
  } catch {
    // no bloquear operación principal
  }
}

export async function POST(req: Request) {
  try {
    const {
      companyName, bannerUrl, targetUrl,
      placement, startDate, endDate,
      status, targetCountry, isGlobal,
      paypalOrderId, paymentVerified
    } = await req.json();

    if (paypalOrderId && paymentVerified) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);

      const campaign = await prisma.adCampaign.create({
        data: {
          companyName: companyName || "Reserva Pendiente",
          bannerUrl: bannerUrl || "",
          targetUrl: targetUrl || null,
          placement,
          targetCountry: isGlobal ? null : (targetCountry || 'PE'),
          isGlobal: !!isGlobal,
          startDate: sDate,
          endDate: eDate,
          status: "PAID",
          paymentVerified: true,
          paypalOrderId,
        }
      });

      await logAudit('B2B_CAMPAIGN_PAID', `Campaña ${campaign.companyName} pagada vía PayPal ${paypalOrderId}`);
      return NextResponse.json(campaign);
    }

    if (!companyName || !bannerUrl || !placement) {
      return NextResponse.json({ error: "Faltan datos obligatorios para la campaña" }, { status: 400 });
    }

    const sDate = new Date(startDate || Date.now());
    const eDate = new Date(endDate || Date.now() + 30 * 24 * 60 * 60 * 1000);
    eDate.setHours(23, 59, 59, 999);

    const campaign = await prisma.adCampaign.create({
      data: {
        companyName,
        bannerUrl,
        targetUrl: targetUrl || null,
        placement,
        targetCountry: isGlobal ? null : (targetCountry || 'PE'),
        isGlobal: !!isGlobal,
        startDate: sDate,
        endDate: eDate,
        status: status || "ACTIVE",
        paymentVerified: true,
      }
    });

    await logAudit('B2B_CAMPAIGN_CREATED', `Campaña ${companyName} creada manualmente`);
    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("B2B CREATION ERROR:", error);
    return NextResponse.json({
      error: "DATABASE_CONNECTION_ERROR",
      message: error.message || 'Error al crear campaña.'
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
    const { id, companyName, bannerUrl, targetUrl, placement, startDate, endDate, status, targetCountry, isGlobal } = await req.json();

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: {
        companyName,
        bannerUrl,
        targetUrl,
        placement,
        targetCountry,
        isGlobal,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
      }
    });

    await logAudit('B2B_CAMPAIGN_UPDATED', `Campaña ${campaign.companyName} → ${status}`);
    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: "DATABASE_UPDATE_ERROR", message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "ID y status requeridos" }, { status: 400 });

    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: { status },
    });

    await logAudit('B2B_CAMPAIGN_STATUS', `${campaign.companyName} → ${status}`);
    return NextResponse.json(campaign);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const existing = await prisma.adCampaign.findUnique({ where: { id } });
    await prisma.adCampaign.delete({ where: { id } });

    await logAudit('B2B_CAMPAIGN_DELETED', `Eliminada: ${existing?.companyName}`);
    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la pauta" }, { status: 500 });
  }
}
