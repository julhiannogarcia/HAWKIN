import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v13.0 - EL "BYPASS" DEFINITIVO
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // Zero-config: Lee AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET automáticamente
    }),
  ],
  // Forzamos el secreto directamente en el objeto por si Vercel falla
  secret: "68db8613-74b7-4c3d-83b3-0505b3820261",
  trustHost: true,
  session: { strategy: "jwt" },
  debug: true,
})
