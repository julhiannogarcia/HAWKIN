import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  COOKIE_NAME,
  isAdminPasswordConfigured,
  verifyAdminSessionToken,
} from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';

  // POST público: envío de campañas B2B y upload de creativos desde /b2b
  const isPublicAdminPost =
    request.method === 'POST' &&
    (pathname === '/api/admin/b2b' || pathname === '/api/admin/upload');

  const isAdminApi =
    pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/auth') &&
    !isPublicAdminPost;

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (!isAdminPasswordConfigured()) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD no configurada (mín. 8 caracteres)' },
        { status: 503 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('error', 'not_configured');
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifyAdminSessionToken(token);

  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
