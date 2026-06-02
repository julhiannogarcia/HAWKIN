import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const progress = await prisma.userProgress.findMany({
      where: { user: { email: session.user.email } },
      include: { lesson: true }
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener progreso" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { lessonId, completed } = await req.json();

    const progress = await prisma.userProgress.upsert({
      where: { 
        userId_lessonId: {
          userId: (session.user as any).id,
          lessonId
        }
      },
      update: { completed },
      create: {
        userId: (session.user as any).id,
        lessonId,
        completed
      }
    });

    // Otorgar XP por completar lección
    if (completed) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { xp: { increment: 50 } }
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress POST Error:", error);
    return NextResponse.json({ error: "Fallo al guardar progreso" }, { status: 500 });
  }
}
