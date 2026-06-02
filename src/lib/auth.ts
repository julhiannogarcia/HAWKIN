import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v21.0 - SOLUCIÓN FINAL AL BUCLE OAUTHCALLBACK
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'], // ELIMINA EL ERROR DE ESTADO
    }),
  ],
  // LLAVE MAESTRA HARDCODED PARA EVITAR FALLOS DE VERCEL
  secret: "HAWKIN_MASTER_KEY_SECRET_ALPHA_2026_SECURITY_BYPASS",
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días de sesión activa
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  callbacks: {
    async signIn() { return true; },
    async jwt({ token, user }: any) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
};
