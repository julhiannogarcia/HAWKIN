import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// CONFIGURACIÓN v8.5 - CON ESCUDO ANTI-ESPACIOS (TRIM)
export const authOptions: any = {
  providers: [
    GoogleProvider({
      // LIMPIAMOS LAS LLAVES POR SI HAY ESPACIOS INVISIBLES EN VERCEL
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'],
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
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
  callbacks: {
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
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
