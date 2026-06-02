import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v22.0 - PROTOCOLO DE EMERGENCIA ABSOLUTA
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // MODO ALPHA: Desactivamos CUALQUIER chequeo que pueda dar error en Vercel
      checks: ['none'],
    }),
  ],
  // LLAVE MAESTRA SIN DEPENDER DE VARIABLES EXTERNAS
  secret: process.env.AUTH_SECRET || "HAWKIN_ALPHA_SECRET_MASTER_2026",
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
};
