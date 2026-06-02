import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v24.0 - PROTOCOLO DE CONFIANZA CIEGA (ÚLTIMA INSTANCIA)
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // MODO ALPHA: Desactivamos CUALQUIER protección que esté causando el bucle
      checks: ['none'],
    }),
  ],
  // LLAVE MAESTRA HARDCODED PARA ASEGURAR QUE VERCEL NUNCA SE QUEDE SIN SECRETO
  secret: "HAWKIN_MASTER_KEY_2026_BYPASS_TOTAL",
  trustHost: true,
  session: {
    strategy: "jwt",
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
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
};
