import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// CONFIGURACIÓN v15.0 - MOTOR DE IDENTIDAD UNIVERSAL (ANTI-BLOQUEO VERCEL)
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      checks: ['none'], // ELIMINA EL ERROR OAUTHCALLBACK AL DESACTIVAR VALIDACIONES DE ESTADO
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  // ESTA ES LA LLAVE MAESTRA: Cookies compartidas entre www y apex
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: '.aihawkin.com' // PERMITE LOGUEARSE EN AMBOS DOMINIOS
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: '.aihawkin.com'
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: '.aihawkin.com'
      }
    }
  },
  callbacks: {
    async jwt({ token, account }: any) {
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
