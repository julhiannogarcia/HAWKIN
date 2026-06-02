import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// CONFIGURACIÓN v9.0 - SISTEMA DE SOCIOS ALPHA BLINDADO
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
    strategy: "database", // FORZAMOS DB PARA GUARDAR XP, NIK Y STATUS
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.nickname = user.nickname;
        session.user.xp = user.xp;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }: any) {
      console.log("NUEVO SOCIO ALPHA DETECTADO:", user.email);
      // Aquí se activará el envío de correo de bienvenida en la v9.1
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
