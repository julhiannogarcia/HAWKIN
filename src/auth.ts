import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v12.0 - MODO "ZERO-CONFIG" ALPHA
// La versión más limpia y estable recomendada para Next.js 15
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // En v5, si las variables se llaman AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET,
      // el sistema las detecta automáticamente. Pero las pasamos aquí para seguridad.
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  debug: true,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  }
})
