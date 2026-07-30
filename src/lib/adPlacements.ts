export const PLACEMENT_ZONES: Record<
  string,
  { label: string; pages: string[]; sponsorType: 'banner' | 'inline' | 'sidebar' }
> = {
  TOP_BANNER: {
    label: 'Banner principal (Plus Streaming)',
    pages: ['/', '/radar', '/markets', '/rumors'],
    sponsorType: 'banner',
  },
  NEWS_FEED: {
    label: 'Bloque inline (Native Radar)',
    pages: ['/', '/radar', '/news', '/b2b'],
    sponsorType: 'inline',
  },
  SIDEBAR: {
    label: 'Barra lateral (Sidebar Táctico)',
    pages: ['/news', '/shield', '/intelligence'],
    sponsorType: 'sidebar',
  },
};

export const ALL_PLACEMENTS = ['TOP_BANNER', 'NEWS_FEED', 'SIDEBAR'] as const;
