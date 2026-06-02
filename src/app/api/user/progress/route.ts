import { NextResponse } from "next/server";
import { getAlphaUser } from "@/lib/auth-alpha";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getAlphaUser(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId: user.id },
      include: { lesson: true }
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener progreso" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAlphaUser(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { lessonId, completed } = await req.json();

    const progress = await prisma.userProgress.upsert({
      where: { 
        userId_lessonId: { userId: user.id, lessonId }
      },
      update: { completed },
      create: { userId: user.id, lessonId, completed }
    });

    if (completed) {
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 50 } }
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al guardar progreso" }, { status: 500 });
  }
}
