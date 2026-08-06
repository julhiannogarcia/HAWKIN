import Parser from 'rss-parser';

export const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

export function generateShortId(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function formatLiveDate(pubDate?: string) {
  if (!pubDate) return 'En vivo';
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return 'En vivo';
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

export function extractRssImage(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && (!enclosure.type || enclosure.type.startsWith('image'))) {
    return enclosure.url;
  }

  const mediaContent = item.mediaContent as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const mediaThumbnail = item.mediaThumbnail as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

  const content = String(item.content || item['content:encoded'] || '');
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && !imgMatch[1].includes('pixel')) return imgMatch[1];

  return null;
}

const ogImageCache = new Map<string, string | null>();
const articleUrlCache = new Map<string, string>();

function absoluteUrl(maybeRelative: string, base: string): string | null {
  try {
    return new URL(maybeRelative, base).href;
  } catch {
    return null;
  }
}

/** Resuelve redirects de Google News al artículo real. */
export async function resolveArticleUrl(pageUrl: string): Promise<string> {
  if (!pageUrl?.startsWith('http')) return pageUrl;
  if (!pageUrl.includes('news.google.com')) return pageUrl;
  if (articleUrlCache.has(pageUrl)) return articleUrlCache.get(pageUrl)!;

  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(6000),
      redirect: 'follow',
    });

    if (res.url && !res.url.includes('news.google.com')) {
      articleUrlCache.set(pageUrl, res.url);
      return res.url;
    }

    const html = (await res.text()).slice(0, 200_000);
    const patterns = [
      /data-n-au=["'](https?:\/\/[^"']+)["']/i,
      /<link[^>]+rel=["']canonical["'][^>]+href=["'](https?:\/\/[^"']+)["']/i,
      /href=["'](https?:\/\/(?!news\.google\.com|www\.google\.com|accounts\.google\.com)[^"'\s]+)["']/i,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      const candidate = m?.[1]?.trim();
      if (
        candidate &&
        !candidate.includes('news.google.com') &&
        !candidate.includes('google.com/search')
      ) {
        articleUrlCache.set(pageUrl, candidate);
        return candidate;
      }
    }
  } catch {
    // keep original
  }

  articleUrlCache.set(pageUrl, pageUrl);
  return pageUrl;
}

export async function fetchOgImage(pageUrl: string): Promise<string | null> {
  if (!pageUrl?.startsWith('http')) return null;
  if (ogImageCache.has(pageUrl)) return ogImageCache.get(pageUrl) ?? null;

  try {
    const articleUrl = await resolveArticleUrl(pageUrl);
    const res = await fetch(articleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(5500),
      redirect: 'follow',
    });
    if (!res.ok) {
      ogImageCache.set(pageUrl, null);
      return null;
    }
    const html = (await res.text()).slice(0, 150_000);
    const match =
      html.match(/property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i) ||
      html.match(/name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i);

    const raw = match?.[1]?.trim() || null;
    const image = raw ? absoluteUrl(raw, articleUrl) : null;
    if (
      image &&
      !image.includes('unsplash.com') &&
      !image.includes('googleusercontent.com/proxy') &&
      !image.endsWith('.svg')
    ) {
      ogImageCache.set(pageUrl, image);
      return image;
    }
    ogImageCache.set(pageUrl, null);
    return null;
  } catch {
    ogImageCache.set(pageUrl, null);
    return null;
  }
}

/** Imagen verificada: RSS → og:image (sigue redirects Google News). Sin Unsplash. */
export async function resolveVerifiedNewsImage(
  item: Record<string, unknown>,
  pageUrl?: string
): Promise<string | null> {
  const fromFeed = extractRssImage(item);
  if (
    fromFeed &&
    !fromFeed.includes('unsplash.com') &&
    !fromFeed.endsWith('.gif') &&
    !fromFeed.includes('pixel')
  ) {
    return fromFeed;
  }
  if (pageUrl) {
    return fetchOgImage(pageUrl);
  }
  return null;
}

export function extractSourceName(item: { title?: string; link?: string; creator?: string; author?: string }): string {
  const title = item.title || '';
  const dashParts = title.split(' - ');
  if (dashParts.length > 1) {
    const source = dashParts[dashParts.length - 1].trim();
    if (source.length > 1 && source.length < 80) return source;
  }
  if (item.creator && typeof item.creator === 'string') return item.creator;
  if (item.author && typeof item.author === 'string') return item.author;
  try {
    const host = new URL(item.link || '').hostname.replace(/^www\./, '');
    return host || 'RSS';
  } catch {
    return 'RSS';
  }
}

export function isValidNewsUrl(url?: string): url is string {
  if (!url?.startsWith('http')) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function trimExcerpt(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function topicImage(title: string, sig: string, kind: 'radar' | 'gold' | 'rumor' = 'radar') {
  const t = title.toLowerCase();
  const base = 'https://images.unsplash.com/';

  if (kind === 'rumor') {
    return `${base}photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }

  if (t.includes('bitcoin') || t.includes('btc') || t.includes('crypto')) {
    return `${base}photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }
  if (t.includes('nvidia') || t.includes('chip') || t.includes('gpu')) {
    return `${base}photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }
  if (t.includes('openai') || t.includes('gpt') || t.includes('chatgpt')) {
    return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }
  if (t.includes('musk') || t.includes('xai') || t.includes('tesla')) {
    return `${base}photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }
  if (t.includes('altman') || t.includes('ceo') || t.includes('billion')) {
    return `${base}photo-1560179707-f14e0ef6383?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }
  if (t.includes('security') || t.includes('hack') || t.includes('breach')) {
    return `${base}photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }

  if (kind === 'gold') {
    return `${base}photo-1611974717528-9878a1d26a8e?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
  }

  return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${sig}`;
}

export function resolveNewsImage(item: Record<string, unknown>, title: string, kind: 'radar' | 'gold' | 'rumor' = 'radar') {
  const sig = generateShortId(String(item.link || title));
  const fromFeed = extractRssImage(item);
  if (fromFeed && !fromFeed.includes('pixel') && !fromFeed.endsWith('.gif')) {
    return fromFeed;
  }
  return topicImage(title, sig, kind);
}

export async function parseFeed(url: string) {
  try {
    return await parser.parseURL(url);
  } catch {
    return { items: [] as Parser.Item[] };
  }
}
