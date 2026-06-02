import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// CONFIGURACIÓN AUTH-LITE v1.0 - ELIMINAMOS NEXTAUTH
export async function POST(req: Request) {
  try {
    const { action, key, nickname } = await req.json();

    // 1. INICIALIZAR NUEVA LLAVE (NUEVO SOCIO)
    if (action === "INIT") {
      const newKey = `ALPHA-${nanoid(12).toUpperCase()}`;
      const user = await prisma.user.create({
        data: {
          accessKey: newKey,
          nickname: nickname || `SOCIO_${nanoid(5)}`,
          xp: 100, // Regalo inicial
        }
      });
      return NextResponse.json({ success: true, user, key: newKey });
    }

    // 2. ENTRAR CON LLAVE EXISTENTE
    if (action === "LOGIN") {
      const user = await prisma.user.findUnique({
        where: { accessKey: key },
        include: { progress: true }
      });

      if (!user) {
        return NextResponse.json({ error: "Llave de Acceso Inválida o Inactiva" }, { status: 401 });
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });

  } catch (error) {
    console.error("Auth Lite Error:", error);
    return NextResponse.json({ error: "Error en el Núcleo de Identidad" }, { status: 500 });
  }
}
