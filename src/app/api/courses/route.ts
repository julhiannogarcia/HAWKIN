import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Crear un nuevo curso (Solo ADMIN)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, category, image } = body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        image,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Obtener todos los cursos publicados
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        _count: {
          select: { modules: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
