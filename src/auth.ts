import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// CONFIGURACIÓN v32.0 - PROTOCOLO DE CONFIANZA TOTAL
// Esta es la versión más estable para Next.js 15 en Vercel
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Dejamos que Auth.js lea AUTH_SECRET automáticamente del entorno de Vercel
  trustHost: true,
  debug: true,
})
