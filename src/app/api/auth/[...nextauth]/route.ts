import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// CONFIGURACIÓN DE EMERGENCIA FINAL v8.0 - ELIMINACIÓN DE ERROR OAUTHSIGNIN
export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
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
}

const handler = (req: any, res: any) => {
  console.log("NEXTAUTH DEBUG - ENV CHECK:");
  console.log("CLIENT_ID PRESENT:", !!process.env.GOOGLE_CLIENT_ID);
  console.log("SECRET PRESENT:", !!process.env.NEXTAUTH_SECRET);
  
  return NextAuth(req, res, authOptions);
}

export { handler as GET, handler as POST }
