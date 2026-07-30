import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_SIZE = 15 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

async function uploadToSupabase(file: File, filename: string, buffer: Buffer) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;

  const res = await fetch(`${supabaseUrl}/storage/v1/object/ads/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: buffer,
  });

  if (!res.ok) return null;
  return `${supabaseUrl}/storage/v1/object/public/ads/${filename}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WebP, GIF o MP4.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx 15 MB).' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filename = `ad-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabaseUrl = await uploadToSupabase(file, filename, buffer);
    if (supabaseUrl) {
      return NextResponse.json({ url: supabaseUrl, filename, size: file.size, type: file.type, storage: 'supabase' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'ads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/ads/${filename}`, filename, size: file.size, type: file.type, storage: 'local' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir el archivo.' }, { status: 500 });
  }
}
