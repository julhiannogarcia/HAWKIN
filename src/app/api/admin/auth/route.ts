import { NextResponse } from 'next/server';
import {
  adminCookieOptions,
  checkAdminPassword,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  COOKIE_NAME,
} from '@/lib/adminAuth';

export async function POST(req: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD no configurada en el servidor (mínimo 8 caracteres).' },
      { status: 503 }
    );
  }

  let password = '';
  try {
    const body = await req.json();
    password = String(body?.password || '');
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ ok: true });
  const opts = adminCookieOptions(token);
  res.cookies.set(opts);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return res;
}

export async function GET() {
  return NextResponse.json({
    configured: isAdminPasswordConfigured(),
  });
}
