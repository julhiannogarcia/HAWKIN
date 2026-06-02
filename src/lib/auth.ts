import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v19.0 - MODO DE RESCATE TOTAL
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      authorization: {
        params: {
          prompt: "select_account", // Obliga a elegir cuenta para limpiar errores
        }
      },
      checks: ['none'], 
    }),
  ],
  // USAMOS UN SECRETO NUEVO Y LIMPIO POR SI EL OTRO FALLA
  secret: "HAWKIN_SECRET_MASTER_KEY_2026_ALPHA_SHIELD", 
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // DESACTIVAMOS LAS PÁGINAS PERSONALIZADAS PARA DESCARTAR ERRORES DE RUTA
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/signin',
  // },
  debug: true,
};
