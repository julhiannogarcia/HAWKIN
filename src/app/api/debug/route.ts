import { NextResponse } from "next/server";

export async function GET() {
  const googleId = process.env.GOOGLE_CLIENT_ID || "";
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const authSecret = process.env.AUTH_SECRET || "";
  const nextAuthSecret = process.env.NEXTAUTH_SECRET || "";
  
  return NextResponse.json({
    status: "DIAGNÓSTICO ALPHA v5.1",
    google: {
      hasId: !!googleId,
      idLengthRaw: googleId.length,
      idLengthTrimmed: googleId.trim().length,
      hasSecret: !!googleSecret,
    },
    secrets: {
      has_AUTH_SECRET: !!authSecret,
      has_NEXTAUTH_SECRET: !!nextAuthSecret,
      authSecretFirst6: authSecret.substring(0, 6) + "...",
    },
    vercel_env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      AUTH_URL: process.env.AUTH_URL || "MISSING",
      VERCEL_URL: process.env.VERCEL_URL || "MISSING",
    }
  });
}
