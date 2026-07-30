export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return (
    /\.(mp4|webm|ogg)(\?|$)/i.test(url) ||
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
}

export function getYoutubeEmbedId(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1]?.split('?')[0] || null;
  }
  if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0] || null;
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] || null;
  return null;
}

export function getYoutubeStartSeconds(url: string): number | null {
  if (!url) return null;
  const timeMatch = url.match(/[?&]t=(\d+)/);
  if (timeMatch) return parseInt(timeMatch[1], 10);
  return null;
}

export function buildYoutubeEmbedUrl(videoId: string, options?: { autoplay?: boolean; start?: number | null }) {
  const params = new URLSearchParams({
    autoplay: options?.autoplay === false ? '0' : '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (options?.start && options.start > 0) params.set('start', String(options.start));
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function getVimeoEmbedId(url: string): string | null {
  if (!url?.includes('vimeo.com')) return null;
  return url.split('/').pop()?.split('?')[0] || null;
}

export function getSecureImageUrl(url: string): string {
  if (!url) return '';
  if (isVideoUrl(url)) return url;
  if (url.startsWith('/') || url.startsWith('logos/')) {
    return url.startsWith('/') ? url : `/${url}`;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1920&fit=cover`;
}
