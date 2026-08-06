const COOKIE_NAME = 'hawkin_admin';
const MAX_AGE_SEC = 60 * 60 * 12; // 12 horas

function getAdminSecret() {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.HAWKIN_ADMIN_PASSWORD ||
    ''
  );
}

function getSigningKey() {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'hawkin-admin-dev'
  );
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminSecret().length >= 8;
}

export function checkAdminPassword(password: string): boolean {
  const expected = getAdminSecret();
  if (!expected || expected.length < 8) return false;
  return timingSafeEqual(password, expected);
}

export async function createAdminSessionToken(): Promise<string> {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `admin:${exp}`;
  const sig = await hmacHex(payload, getSigningKey());
  return `${exp}.${sig}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split('.');
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmacHex(`admin:${exp}`, getSigningKey());
  return timingSafeEqual(sig, expected);
}

export function adminCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SEC,
  };
}

export { COOKIE_NAME, MAX_AGE_SEC };
