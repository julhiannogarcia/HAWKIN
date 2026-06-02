import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAlphaUser } from "@/lib/auth-alpha";

export async function POST(req: Request) {
  const user = await getAlphaUser(req);
  
  if (!user) {
    return NextResponse.json({ error: "Identidad requerida para reaccionar." }, { status: 401 });
  }

  try {
    const { newsId, action } = await req.json();

    if (action === 'LIKE') {
      const news = await prisma.news.update({
        where: { id: newsId },
        data: { likes: { increment: 1 } }
      });
      return NextResponse.json({ success: true, likes: news.likes });
    }

    if (action === 'DISLIKE') {
      const news = await prisma.news.update({
        where: { id: newsId },
        data: { dislikes: { increment: 1 } }
      });
      return NextResponse.json({ success: true, dislikes: news.dislikes });
    }

    if (action === 'SAVE') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          savedNews: { connect: { id: newsId } }
        }
      });
      return NextResponse.json({ success: true, message: "Reporte guardado en la Bóveda." });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });

  } catch (error) {
    console.error("Reaction Error:", error);
    return NextResponse.json({ error: "Error en el sistema de reacciones" }, { status: 500 });
  }
}
