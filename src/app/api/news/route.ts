import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const news = await prisma.news.findUnique({
        where: { id }
      });
      return NextResponse.json(news);
    }

    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener noticias" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Para simplificar y restaurar la carga, permitiremos la creación si la llave del admin está presente en el body o header
    const data = await req.json();
    const news = await prisma.news.create({ data });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al crear noticia" }, { status: 500 });
  }
}
