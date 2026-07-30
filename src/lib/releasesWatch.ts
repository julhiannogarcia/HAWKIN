import { parseFeed } from '@/lib/newsUtils';
import {
  ALL_ARENA_MODELS,
  getActiveArenaModels,
  mentionScore,
  daysSinceRelease,
  isModelStale,
  NO_RELEASE_CONFIRMED,
  type ArenaModelMeta,
} from '@/lib/arenaModels';

export type ReleaseVendor = {
  id: string;
  name: string;
  feeds: string[];
  keywords: string[];
};

export const RELEASE_WATCH_VENDORS: ReleaseVendor[] = [
  {
    id: 'google',
    name: 'Google',
    feeds: ['https://deepmind.google/blog/rss.xml', 'https://blog.google/products/google-cloud/rss/'],
    keywords: ['gemini', 'google ai', 'deepmind', 'flash'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    feeds: ['https://openai.com/news/rss.xml'],
    keywords: ['gpt', 'openai', 'chatgpt', 'o3', 'o1'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    feeds: ['https://www.anthropic.com/news/rss'],
    keywords: ['claude', 'anthropic'],
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    feeds: ['https://news.google.com/rss/search?q=Moonshot+AI+Kimi&hl=en-US&gl=US&ceid=US:en'],
    keywords: ['kimi', 'moonshot'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    feeds: ['https://news.google.com/rss/search?q=DeepSeek+AI+model&hl=en-US&gl=US&ceid=US:en'],
    keywords: ['deepseek'],
  },
  {
    id: 'meta',
    name: 'Meta',
    feeds: ['https://news.google.com/rss/search?q=Meta+Llama+AI&hl=en-US&gl=US&ceid=US:en'],
    keywords: ['llama', 'meta ai'],
  },
  {
    id: 'alibaba',
    name: 'Alibaba',
    feeds: ['https://news.google.com/rss/search?q=Alibaba+Qwen+AI&hl=en-US&gl=US&ceid=US:en'],
    keywords: ['qwen', 'alibaba', 'tongyi'],
  },
];

export type ReleaseAlert = {
  id: string;
  vendor: string;
  vendorName: string;
  title: string;
  link?: string;
  pubDate?: string;
  reason: string;
  suggestedAction: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export type StaleModelAlert = {
  slug: string;
  name: string;
  company: string;
  daysSinceRelease: number | null;
  message: string;
};

function catalogCoversTitle(title: string, vendorId: string): boolean {
  const t = title.toLowerCase();
  const vendorModels = ALL_ARENA_MODELS.filter(
    (m) => m.company.toLowerCase().includes(vendorId) || mentionScore(t, m.aliases) > 0
  );
  if (vendorModels.some((m) => mentionScore(t, m.aliases) > 0)) return true;

  const vendor = RELEASE_WATCH_VENDORS.find((v) => v.id === vendorId);
  if (!vendor) return false;

  const hasKeyword = vendor.keywords.some((k) => t.includes(k));
  if (!hasKeyword) return true;

  return ALL_ARENA_MODELS.some((m) => mentionScore(t, m.aliases) > 0);
}

export async function scanOfficialReleases(): Promise<{
  alerts: ReleaseAlert[];
  staleModels: StaleModelAlert[];
  scannedAt: string;
  feedItemCount: number;
}> {
  const alerts: ReleaseAlert[] = [];
  let feedItemCount = 0;

  for (const vendor of RELEASE_WATCH_VENDORS) {
    for (const feedUrl of vendor.feeds) {
      try {
        const feed = await parseFeed(feedUrl);
        const items = (feed.items || []).slice(0, 12);
        feedItemCount += items.length;

        for (const item of items) {
          const title = item.title?.trim();
          if (!title) continue;

          if (catalogCoversTitle(title, vendor.id)) continue;

          const text = `${title} ${item.contentSnippet || ''}`.toLowerCase();
          const looksLikeRelease =
            vendor.keywords.some((k) => text.includes(k)) &&
            (text.includes('launch') ||
              text.includes('release') ||
              text.includes('announce') ||
              text.includes('introduc') ||
              text.includes('lanza') ||
              text.includes('new model') ||
              text.includes('gemini 3'));

          if (!looksLikeRelease) continue;

          alerts.push({
            id: `${vendor.id}-${Buffer.from(title).toString('base64url').slice(0, 16)}`,
            vendor: vendor.id,
            vendorName: vendor.name,
            title,
            link: item.link,
            pubDate: item.pubDate,
            reason: `${vendor.name} tiene un anuncio en feed oficial que no coincide con el catálogo Arena activo.`,
            suggestedAction: 'Revisar y actualizar arenaModels.ts antes de publicar.',
            status: 'PENDING',
          });
        }
      } catch {
        // feed silencioso
      }
    }
  }

  const staleModels: StaleModelAlert[] = getActiveArenaModels()
    .filter((m) => {
      const days = daysSinceRelease(m.releaseDate);
      return days === null || days > 90;
    })
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      company: m.company,
      daysSinceRelease: daysSinceRelease(m.releaseDate),
      message:
        m.releaseDate && daysSinceRelease(m.releaseDate)! > 90
          ? `Sin release confirmado en >90 días (último: ${m.releaseDate})`
          : 'Sin fecha de release confirmada en catálogo',
    }));

  return {
    alerts: alerts.slice(0, 20),
    staleModels,
    scannedAt: new Date().toISOString(),
    feedItemCount,
  };
}

export function enrichModelRelease(
  meta: ArenaModelMeta,
  snippets: { title: string; summary?: string; url?: string }[]
) {
  let bestTitle = '';
  let bestUrl: string | undefined;
  let hasRecentMention = false;

  for (const snip of snippets) {
    const blob = `${snip.title} ${snip.summary || ''}`;
    if (mentionScore(blob, meta.aliases) > 0) {
      hasRecentMention = true;
      if (!bestTitle) {
        bestTitle = snip.title;
        bestUrl = snip.url;
      }
    }
  }

  const stale = isModelStale(meta, hasRecentMention);

  if (bestTitle) {
    return {
      whatsNew: bestTitle,
      sourceUrl: bestUrl,
      releaseConfirmed: true,
      needsVerification: false,
    };
  }

  if (meta.whatsNewConfirmed && meta.releaseDate) {
    return {
      whatsNew: meta.whatsNewConfirmed,
      sourceUrl: meta.releaseSource,
      releaseConfirmed: true,
      needsVerification: stale,
    };
  }

  return {
    whatsNew: NO_RELEASE_CONFIRMED,
    sourceUrl: undefined,
    releaseConfirmed: false,
    needsVerification: stale,
  };
}
