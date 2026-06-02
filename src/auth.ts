import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v14.0 - COMPATIBILIDAD TOTAL CON TUS LLAVES ACTUALES
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // USAMOS LOS NOMBRES QUE YA TIENES EN VERCEL PARA QUE NO TENGAS QUE CAMBIAR NADA
      clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
      checks: ['none'],
    }),
  ],
  // Usamos el secreto que ya tienes en Vercel
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "68db8613-74b7-4c3d-83b3-0505b3820261",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
})
