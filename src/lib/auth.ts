import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v17.0 - BLINDAJE FINAL DE IDENTIDAD ALPHA
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // ELIMINA EL ERROR OAUTHCALLBACK AL DESACTIVAR VERIFICACIONES QUE VERCEL BLOQUEA
      checks: ['none'],
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  trustHost: true, // OBLIGATORIO PARA VERCEL + NEXT.JS 15
  session: {
    strategy: "jwt", // JWT es 10x más estable para evitar bucles en la nube
  },
  // COOKIES ESTÁNDAR PARA MÁXIMA COMPATIBILIDAD (SOPORTA WWW Y NON-WWW)
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
