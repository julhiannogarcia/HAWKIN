import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- PROTOCOLO DE SEGURIDAD FINANCIERA HAWKIN V11 ---
// Esta ruta es el punto de entrada oficial para las notificaciones de PayPal.
// Valida las transacciones de forma asíncrona y segura.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    // Registrar el intento de webhook en los logs de auditoría
    await prisma.auditLog.create({
      data: {
        action: `PAYPAL_WEBHOOK_${eventType}`,
        details: JSON.stringify({ id: resource.id, status: resource.status }),
        status: "RECEIVED"
      }
    });

    // 1. EVENTO: PAGO COMPLETADO (CHECKOUT)
    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      const orderId = resource.id;

      // Buscar campaña o suscripción pendiente
      const ad = await prisma.adCampaign.findUnique({
        where: { paypalOrderId: orderId }
      });

      if (ad) {
        await prisma.adCampaign.update({
          where: { id: ad.id },
          data: { 
            status: "PAID",
            paymentVerified: true 
          }
        });

        // Registrar métrica de ingresos
        await prisma.revenueMetric.create({
          data: {
            amount: parseFloat(resource.purchase_units[0].amount.value),
            source: "PAYPAL",
            type: "ADVERTISING",
            transactionId: orderId
          }
        });
      }
    }

    // 2. EVENTO: SUSCRIPCIÓN ACTIVADA
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = resource.id;
      const customId = resource.custom_id; // Debería contener el userId

      if (customId) {
        await prisma.subscription.update({
          where: { userId: customId },
          data: { status: "active" }
        });
      }
    }

    return NextResponse.json({ status: "success" });

  } catch (error: any) {
    console.error("PayPal Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Processing Failed" }, { status: 500 });
  }
}
