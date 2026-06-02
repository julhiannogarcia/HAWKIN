import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAlphaUser } from "@/lib/auth-alpha";

export async function GET(req: Request) {
  const user = await getAlphaUser(req);

  if (!user) {
    return NextResponse.json({ error: "Identidad requerida." }, { status: 401 });
  }

  try {
    const userWithSavedNews = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        savedNews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({
      savedNews: userWithSavedNews?.savedNews || []
    });
  } catch (error) {
    console.error("Vault API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener la Bóveda" }, { status: 500 });
  }
}
