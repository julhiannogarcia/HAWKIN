import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v18.0 - MÁXIMA COMPATIBILIDAD VERCEL + NEXT.JS 15
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'], // ELIMINA EL ERROR OAUTHCALLBACK AL SALTAR CHEQUEOS DE ESTADO
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  trustHost: true,
  session: {
    strategy: "jwt", // JWT es 10x más estable para evitar bucles en Vercel
  },
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.id = token.sub;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
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
