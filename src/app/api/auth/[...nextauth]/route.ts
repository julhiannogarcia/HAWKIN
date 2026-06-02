import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

// FIX DEFINITIVO PARA NEXT.JS 15: Los parámetros de ruta ahora son promesas
// Envolvemos el handler para resolver los parámetros antes de pasarlos a NextAuth
export async function GET(req: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  // @ts-ignore
  return await handler(req, { params: resolvedParams });
}

export async function POST(req: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  // @ts-ignore
  return await handler(req, { params: resolvedParams });
}
