import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v9.1 - MÁXIMA ESTABILIDAD (JWT + DATABASE ADAPTER)
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: (process.env.NEXTAUTH_SECRET || "").trim(),
  session: {
    strategy: "jwt", // CAMBIAMOS A JWT: Es mucho más estable en Vercel que la estrategia de DB
  },
  callbacks: {
    // Sincronizar datos del socio desde la DB al Token JWT
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nickname = user.nickname;
        token.xp = user.xp;
      }
      // Si el socio actualiza su Nik, refrescar el token
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.nickname = dbUser.nickname;
          token.xp = dbUser.xp;
        }
      }
      return token;
    },
    // Pasar los datos del Token a la Sesión para que el Header los vea
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
