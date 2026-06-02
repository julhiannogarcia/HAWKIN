import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v10.5 - MODO DE EMERGENCIA (JWT PURO)
// ESTO ELIMINA EL ERROR OAUTHCALLBACK AL SALTAR LA BASE DE DATOS
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'], 
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  session: {
    strategy: "jwt", // NO USAMOS DB POR AHORA PARA ROMPER EL BUCLE
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub;
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
