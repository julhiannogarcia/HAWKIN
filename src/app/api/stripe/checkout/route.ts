import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { plan } = await req.json(); // 'monthly' o 'annual'

    // MODELO DE NEGOCIO DINÁMICO: 
    // Si no hay sesión, permitimos 'Guest Checkout' para no bloquear la venta.
    const customerEmail = session?.user?.email || undefined;

    const priceId = plan === 'annual' 
      ? process.env.STRIPE_ANNUAL_PLAN_ID 
      : process.env.STRIPE_MONTHLY_PLAN_ID;

    if (!priceId) {
      return new NextResponse("Stripe Price ID not configured", { status: 500 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail, // Stripe pedirá el email si no existe sesión
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Redirigimos al dominio oficial aihawkin.com
      success_url: `https://aihawkin.com/dashboard?success=true`,
      cancel_url: `https://aihawkin.com/?canceled=true`,
      metadata: {
        userId: (session?.user as any)?.id || "guest",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json({ 
      error: "Error interno en el motor financiero", 
      details: error.message 
    }, { status: 500 });
  }
}
