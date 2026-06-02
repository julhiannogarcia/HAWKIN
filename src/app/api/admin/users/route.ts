import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

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
