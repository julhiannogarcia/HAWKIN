import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest } from "next/server"

// MOTOR ADAPTATIVO: Detecta si entras con WWW o sin ellas y calibra la seguridad al vuelo
const handler = async (req: NextRequest, ctx: { params: any }) => {
  const host = req.headers.get("host") || "aihawkin.com";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  
  // Forzamos al sistema a reconocer el dominio actual como el oficial
  process.env.NEXTAUTH_URL = `${protocol}://${host}`;
  
  console.log(`[HAWKIN AUTH] Calibrando acceso para: ${process.env.NEXTAUTH_URL}`);

  return await NextAuth(req as any, ctx as any, authOptions);
};

export { handler as GET, handler as POST };
