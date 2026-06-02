import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { nickname } = await req.json();

    if (!nickname || nickname.length < 3) {
      return NextResponse.json({ error: "Nik demasiado corto" }, { status: 400 });
    }

    // Verificar si el Nik ya existe
    const existing = await prisma.user.findUnique({
      where: { nickname }
    });

    if (existing) {
      return NextResponse.json({ error: "Este Nik ya está tomado por otro socio" }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { 
        nickname,
        xp: { increment: 100 } // Bonus por completar perfil
      }
    });

    return NextResponse.json({ success: true, nickname: updatedUser.nickname });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al guardar Nik" }, { status: 500 });
  }
}
