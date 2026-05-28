import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, content, excerpt, category, isUrgent, isLocked, image } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        category,
        isUrgent,
        isLocked,
        image: image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        published: true, // Por ahora publicamos directamente
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Error al crear la noticia" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las noticias" }, { status: 500 });
  }
}
