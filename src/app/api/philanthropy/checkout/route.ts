import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Permitimos donaciones de usuarios identificados o anónimos (si session es null)
    // Para mayor seguridad en este prototipo, usaremos el ID del usuario si está logueado
    
    const body = await req.json();
    const { amount, message, isAnonymous, type } = body;

    if (!amount || amount < 1) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment', // Pago único, no suscripción
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: type === 'ECOSYSTEM' ? 'Aporte al Ecosistema HAWKIN' : 'Fondo de Impulso HAWKIN',
              description: message || 'Gracias por tu generosidad.',
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/philanthropy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/philanthropy?canceled=true`,
      metadata: {
        userId: (session?.user as any)?.id || "ANONYMOUS",
        message: message || "",
        isAnonymous: String(isAnonymous),
        type: type,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[PHILANTHROPY_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
