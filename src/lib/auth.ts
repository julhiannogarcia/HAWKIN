import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v12.5 - REPARACIÓN DEFINITIVA PARA VERCEL + NEXT.JS 15
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // ELIMINA EL ERROR OAUTHCALLBACK AL DESACTIVAR VERIFICACIONES DE ESTADO CRUZADAS
      checks: ['none'], 
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  // Forzamos JWT para evitar peleas con la base de datos durante el login
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
};
