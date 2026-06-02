import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// CONFIGURACIÓN v27.0 - BYPASS TOTAL DE CONFIGURACIÓN
// Eliminamos el adaptador de base de datos temporalmente para aislar el error "Configuration"
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'],
    }),
  ],
  // EN V5, EL SECRETO DEBE LLAMARSE 'secret' EN EL OBJETO O 'AUTH_SECRET' EN ENV
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "HAWKIN_MASTER_KEY_2026_ALPHA_BYPASS",
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  debug: true,
})
