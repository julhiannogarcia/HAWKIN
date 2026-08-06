import { NextResponse } from 'next/server';
import { isVideoUrl, getYoutubeEmbedId, getVimeoEmbedId, buildYoutubeEmbedUrl } from '@/lib/adMediaUtils';
import { resolveArticleUrl } from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';

type FeedKind = 'rumors' | 'live' | 'gold' | 'auto';

function getSiteUrl() {
  if (process.env.URL) return process.env.URL.replace(/\/$/, '');
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://127.0.0.1:3000';
}

function videoEmbedFromUrl(url: string): string | null {
  if (!isVideoUrl(url)) return null;
  const yt = getYoutubeEmbedId(url);
  if (yt) return buildYoutubeEmbedUrl(yt, { autoplay: false });
  const vimeo = getVimeoEmbedId(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return url;
  return null;
}

async function fetchFeed(path: string) {
  try {
    const res = await fetch(`${getSiteUrl()}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.news) ? data.news : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id')?.trim();
  const feed = (searchParams.get('feed') || 'auto') as FeedKind;

  if (!id) {
    return NextResponse.json({ error: true, message: 'Falta id' }, { status: 400 });
  }

  const order: FeedKind[] =
    feed === 'auto'
      ? ['rumors', 'live', 'gold']
      : feed === 'rumors'
        ? ['rumors', 'live', 'gold']
        : feed === 'live'
          ? ['live', 'gold', 'rumors']
          : ['gold', 'live', 'rumors'];

  const pathMap: Record<string, string> = {
    rumors: '/api/news/rumors',
    live: '/api/news/live',
    gold: '/api/news/gold',
  };

  let found: any = null;
  let fromFeed: string | null = null;

  for (const kind of order) {
    const items = await fetchFeed(pathMap[kind]);
    const hit = items.find((n: any) => String(n.id) === id);
    if (hit) {
      found = hit;
      fromFeed = kind;
      break;
    }
  }

  if (!found) {
    return NextResponse.json(
      { error: true, message: 'Sin datos nuevos', status: 'Sin datos nuevos' },
      { status: 404 }
    );
  }

  const originalUrl = found.url || '';
  let articleUrl = originalUrl;
  try {
    if (originalUrl) {
      const resolved = await resolveArticleUrl(originalUrl);
      // Solo sustituir si parece artículo real (no CDN de imagen)
      if (
        resolved &&
        !resolved.includes('googleusercontent.com') &&
        !/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(resolved)
      ) {
        articleUrl = resolved;
      }
    }
  } catch {
    articleUrl = originalUrl;
  }

  const videoEmbed =
    found.videoEmbed ||
    videoEmbedFromUrl(articleUrl) ||
    videoEmbedFromUrl(originalUrl) ||
    null;

  const isRumor =
    fromFeed === 'rumors' ||
    found.category === 'RUMOR' ||
    found.isRumor === true;

  return NextResponse.json({
    item: {
      ...found,
      url: articleUrl || originalUrl,
      originalUrl,
      videoEmbed,
      body: found.body || found.excerpt || '',
      feed: fromFeed,
      isRumor,
      badge: found.badge || (isRumor ? 'RUMOR' : found.category || 'INTEL'),
      disclaimer:
        found.disclaimer ||
        (isRumor ? 'No confirmado — inteligencia no verificada' : null),
    },
    status: 'ok',
  });
}
