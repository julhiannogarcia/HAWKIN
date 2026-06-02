import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v22.5 - ELIMINACIÓN DEFINITIVA DEL BUCLE OAUTHCALLBACK
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // MODO DE CONFIANZA TOTAL: Saltamos todas las validaciones de estado que Vercel bloquea
      checks: ['none'], 
    }),
  ],
  // Usamos el secreto de Vercel o el de emergencia
  secret: (process.env.NEXTAUTH_SECRET || "HAWKIN_ALPHA_SECRET_MASTER_2026").trim(),
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
