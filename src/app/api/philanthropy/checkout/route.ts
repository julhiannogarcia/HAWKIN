import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { amount, message } = await req.json();

    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        message,
        userId: (session.user as any).id,
      }
    });

    // Otorgar XP por donación
    await prisma.user.update({
      where: { email: session.user.email },
      data: { xp: { increment: Math.floor(amount * 10) } }
    });

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Donation Error:", error);
    return NextResponse.json({ error: "Fallo al procesar donación" }, { status: 500 });
  }
}
