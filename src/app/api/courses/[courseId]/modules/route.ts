import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: any }) {
  const { courseId } = params;

  try {
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al obtener módulos" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  const { courseId } = params;
  const session = await auth();

  if (!session?.user?.email || session.user.email !== 'charliejulhianno@gmail.com') {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const module = await prisma.module.create({
      data: { ...data, courseId }
    });
    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json({ error: "Fallo al crear módulo" }, { status: 500 });
  }
}
