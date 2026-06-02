import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        progress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      xp: user.xp,
      streak: user.streak,
      completedLessons: user.progress.map((p) => p.lessonId),
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener progreso" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { lessonId, courseId, xpEarned } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Guardar progreso de lección si se proporciona
    if (lessonId) {
      await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lessonId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          lessonId: lessonId,
          courseId: courseId,
        },
      });
    }

    // 2. Actualizar XP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpEarned || 0 },
      },
    });

    return NextResponse.json({
      xp: updatedUser.xp,
      status: "success",
    });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ error: "Error al guardar progreso" }, { status: 500 });
  }
}
