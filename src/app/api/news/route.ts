import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener noticias" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== 'charliejulhianno@gmail.com') {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const news = await prisma.news.create({ data });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al crear noticia" }, { status: 500 });
  }
}
