import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  // Solo el admin puede ver la lista de socios
  if (!session?.user?.email || session.user.email !== 'charliejulhianno@gmail.com') {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        image: true,
        nickname: true,
      },
      orderBy: {
        xp: 'desc',
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: "Fallo al obtener lista de socios" }, { status: 500 });
  }
}
