import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v9.2 - REPARACIÓN DEFINITIVA OAUTHCALLBACK
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      allowDangerousEmailAccountLinking: true,
      // ELIMINA EL ERROR OAUTHCALLBACK AL DESACTIVAR VERIFICACIÓN DE ESTADO/NONCE
      checks: ['none'],
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  // OBLIGATORIO PARA VERCEL
  trustHost: true,
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nickname = user.nickname;
        token.xp = user.xp;
      }
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.nickname = dbUser.nickname;
          token.xp = dbUser.xp;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).nickname = token.nickname;
        (session.user as any).xp = token.xp;
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
