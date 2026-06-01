import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    authUrl: process.env.AUTH_URL,
    nodeEnv: process.env.NODE_ENV
  });
}
