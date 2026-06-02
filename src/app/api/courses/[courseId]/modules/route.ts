import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, order } = await req.json();
    const resolvedParams = await params;

    const module = await prisma.module.create({
      data: {
        title,
        order,
        courseId: resolvedParams.courseId,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error("[MODULE_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
