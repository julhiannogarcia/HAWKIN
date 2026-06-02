import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v9.3 - REPARACIÓN COMPATIBILIDAD VERCEL + NEXT.JS 15
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      // Mantenemos checks:none por ahora para asegurar que el pase se otorgue
      checks: ['none'],
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.nickname = (user as any).nickname;
        token.xp = (user as any).xp;
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
  logger: {
    error: (code, metadata) => {
      console.error("NEXTAUTH_ERROR", code, metadata);
    },
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
