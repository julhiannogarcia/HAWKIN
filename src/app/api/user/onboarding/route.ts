import { NextResponse } from "next/server";
import { getAlphaUser } from "@/lib/auth-alpha";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getAlphaUser(req);

  if (!user) {
    return NextResponse.json({ error: "Identidad no verificada" }, { status: 401 });
  }

  try {
    const { nickname } = await req.json();

    if (!nickname || nickname.length < 3) {
      return NextResponse.json({ error: "Nik demasiado corto" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { nickname }
    });

    if (existing) {
      return NextResponse.json({ error: "Nik ya en uso" }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        nickname,
        xp: { increment: 100 }
      }
    });

    return NextResponse.json({ success: true, nickname: updatedUser.nickname });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al guardar identidad" }, { status: 500 });
  }
}
