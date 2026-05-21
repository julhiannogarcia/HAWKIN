import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Solo el ADMIN puede publicar noticias
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, category, isUrgent, isLocked, image } = body;

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt,
        category,
        isUrgent,
        isLocked,
        image,
        published: true,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("[NEWS_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("[NEWS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
