import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, content, excerpt, category, isUrgent, isLocked, image, url } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        category: category || "NOTICIA",
        isUrgent: !!isUrgent,
        isLocked: !!isLocked,
        image: image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        url: url || null,
        published: true, 
      }
    });

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("DEBUG - NEWS CREATION ERROR:", error);
    return NextResponse.json({ 
      error: "DATABASE_CONNECTION_ERROR", 
      message: `${error.code || 'ERROR'}: ${error.message || 'Error desconocido en el núcleo.'}`
    }, { status: 500 });
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

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.news.delete({
      where: { id }
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Error al eliminar la noticia" }, { status: 500 });
  }
}
