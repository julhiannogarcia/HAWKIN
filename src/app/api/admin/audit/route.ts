import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ error: "Fallo al obtener logs" }, { status: 500 });
  }
}
