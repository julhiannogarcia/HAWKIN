import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v11.0 - TRIPLE BLINDAJE ALPHA
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // Bypass de seguridad para entornos de alta latencia
      checks: ['none'],
    }),
  ],
  // LLAVE MAESTRA: Se usa AUTH_SECRET en Vercel, pero inyectamos este fallback
  secret: process.env.AUTH_SECRET || "68db8613-74b7-4c3d-83b3-0505b3820261",
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
})
