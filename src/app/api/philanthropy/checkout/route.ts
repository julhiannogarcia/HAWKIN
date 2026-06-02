import { NextResponse } from "next/server";
import { getAlphaUser } from "@/lib/auth-alpha";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getAlphaUser(req);

  if (!user) {
    return NextResponse.json({ error: "Socio no verificado" }, { status: 401 });
  }

  try {
    const { amount, message } = await req.json();

    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        message,
        userId: user.id,
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: Math.floor(amount * 10) } }
    });

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Donation Error:", error);
    return NextResponse.json({ error: "Fallo al procesar donación" }, { status: 500 });
  }
}
