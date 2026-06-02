import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { modules: { include: { lessons: true } } }
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener cursos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== 'charliejulhianno@gmail.com') {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const course = await prisma.course.create({ data });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al crear curso" }, { status: 500 });
  }
}
