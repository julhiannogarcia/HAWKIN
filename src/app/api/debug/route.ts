import { NextResponse } from "next/server";

export async function GET() {
  const googleId = process.env.GOOGLE_CLIENT_ID || "";
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const authSecret = process.env.AUTH_SECRET || "";
  const nextAuthSecret = process.env.NEXTAUTH_SECRET || "";
  
  return NextResponse.json({
    google: {
      hasId: !!googleId,
      idLength: googleId.trim().length,
      hasSecret: !!googleSecret,
    },
    secrets: {
      hasAuthSecret: !!authSecret,
      hasNextAuthSecret: !!nextAuthSecret,
    },
    env: {
      url: process.env.NEXTAUTH_URL || "NOT SET",
      internalUrl: process.env.NEXTAUTH_URL_INTERNAL || "NOT SET",
      authUrl: process.env.AUTH_URL || "NOT SET",
    },
    version: "AUTH_JS_V5_BETA"
  });
}
