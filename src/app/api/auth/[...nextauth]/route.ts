import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

// WRAPPER ASÍNCRONO DEFINITIVO PARA NEXT.JS 15
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
