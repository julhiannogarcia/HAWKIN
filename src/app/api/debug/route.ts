import { NextResponse } from "next/server";

export async function GET() {
  const rawId = process.env.GOOGLE_CLIENT_ID || "";
  const trimmedId = rawId.trim();
  
  return NextResponse.json({
    hasClientId: !!rawId,
    clientIdLengthRaw: rawId.length,
    clientIdLengthTrimmed: trimmedId.length,
    isDirty: rawId.length !== trimmedId.length,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    authUrl: process.env.AUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    status: "ESCUDO ANTI-ESPACIOS ACTIVO"
  });
}
