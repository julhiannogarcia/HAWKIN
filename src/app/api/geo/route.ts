import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // En Vercel, el header x-vercel-ip-country nos da el código del país (PE, VE, US, etc.)
  const countryCode = req.headers.get('x-vercel-ip-country') || 'UNKNOWN';
  
  return NextResponse.json({ countryCode });
}
