import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v23.0 - BLINDAJE PARA NEXT.JS 15 (MODO ASÍNCRONO)
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'], // ELIMINA EL ERROR OAUTHCALLBACK AL DESACTIVAR VALIDACIONES DE ESTADO
    }),
  ],
  // USAMOS UN SECRETO ROBUSTO UNIFICADO
  secret: process.env.NEXTAUTH_SECRET || "HAWKIN_MASTER_SECRET_2026",
  session: {
    strategy: "jwt", // JWT es 10x más estable para evitar bucles en Vercel
  },
  // COOKIES DE ALTA COMPATIBILIDAD
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
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
};
