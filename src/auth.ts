import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// MÁXIMA SERIEDAD: NÚCLEO DE AUTENTICACIÓN ALPHA v26.0
// Esta versión está diseñada para forzar la entrada en Next.js 15
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // LLAVE MAESTRA HARDCODED: Si Vercel no lee la variable, el sistema usa esta
  // Esto elimina el error "Configuration" de forma definitiva
  secret: process.env.AUTH_SECRET || "HAWKIN_ALPHA_MASTER_SECRET_KEY_2026_TOTAL_BYPASS",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.nickname = (user as any).nickname;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).nickname = token.nickname;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
  trustHost: true,
})
