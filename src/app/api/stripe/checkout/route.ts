import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    
    // VERIFICACIÓN TÉCNICA DE LLAVES EN EL SERVIDOR
    const monthlyId = process.env.STRIPE_MONTHLY_PLAN_ID;
    const annualId = process.env.STRIPE_ANNUAL_PLAN_ID;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!monthlyId || !annualId || !secretKey) {
      return NextResponse.json({ 
        error: "VARIABLES_FALTANTES", 
        details: `Faltan llaves en Vercel: Monthly: ${monthlyId ? 'OK' : 'FALTA'}, Annual: ${annualId ? 'OK' : 'FALTA'}, Secret: ${secretKey ? 'OK' : 'FALTA'}`
      }, { status: 500 });
    }

    const priceId = plan === 'annual' ? annualId : monthlyId;

    // CREACIÓN DE SESIÓN CON TRATAMIENTO DE ERRORES REAL
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://aihawkin.com/dashboard?success=true`,
      cancel_url: `https://aihawkin.com/?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error("STRIPE_FATAL_ERROR:", error);
    return NextResponse.json({ 
      error: "FALLO_DE_STRIFE", 
      details: error.message || "Error desconocido en la pasarela"
    }, { status: 500 });
  }
}
