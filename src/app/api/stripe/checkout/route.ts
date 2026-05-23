import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    
    // VERIFICACIÓN DE LLAVES (Log para el desarrollador)
    console.log("Iniciando Checkout para el plan:", plan);

    const priceId = plan === 'annual' 
      ? process.env.STRIPE_ANNUAL_PLAN_ID 
      : process.env.STRIPE_MONTHLY_PLAN_ID;

    if (!priceId || priceId.includes('placeholder')) {
      return NextResponse.json({ error: "Llaves de Stripe no configuradas en Vercel." }, { status: 500 });
    }

    // CREACIÓN DE SESIÓN DE PAGO (SIN BLOQUEOS DE SESIÓN)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `https://aihawkin.com/dashboard?success=true`,
      cancel_url: `https://aihawkin.com/?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error("FATAL_STRIPE_ERROR:", error);
    return NextResponse.json({ 
      error: "Error en la conexión financiera", 
      details: error.message 
    }, { status: 500 });
  }
}
