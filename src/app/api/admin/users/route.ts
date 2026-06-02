import { NextResponse } from "next/server";
import { getAlphaUser } from "@/lib/auth-alpha";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await getAlphaUser(req);

  // Solo el admin real puede ver la lista de socios
  if (!user || user.email !== 'charliejulhianno@gmail.com') {
    return NextResponse.json({ error: "Acceso Maestro Denegado" }, { status: 401 });
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
        accessKey: true,
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
