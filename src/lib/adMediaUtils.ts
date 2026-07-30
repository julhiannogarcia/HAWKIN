export type AdMediaType =
  | 'youtube'
  | 'vimeo'
  | 'video'
  | 'image'
  | 'social'
  | 'upload'
  | 'invalid';

export interface BannerValidation {
  valid: boolean;
  type: AdMediaType;
  message: string;
}

export function isVideoUrl(url: string): boolean {
  const type = getMediaType(url);
  return type === 'youtube' || type === 'vimeo' || type === 'video';
}

export function isSocialMediaUrl(url: string): boolean {
  if (!url) return false;
  return /instagram\.com|tiktok\.com|facebook\.com|fb\.watch|twitter\.com|x\.com/i.test(url);
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  if (url.startsWith('/uploads/')) return true;
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(url);
}

export function getMediaType(url: string): AdMediaType {
  if (!url?.trim()) return 'invalid';
  const u = url.trim();

  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('vimeo.com')) return 'vimeo';
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return 'video';
  if (isSocialMediaUrl(u)) return 'social';
  if (isImageUrl(u) || u.startsWith('http')) return 'image';
  if (u.startsWith('/')) return 'upload';
  return 'invalid';
}

export function validateBannerUrl(url: string): BannerValidation {
  if (!url?.trim()) {
    return { valid: false, type: 'invalid', message: 'Pega una URL o sube un archivo.' };
  }

  const type = getMediaType(url);

  switch (type) {
    case 'youtube':
      return getYoutubeEmbedId(url)
        ? { valid: true, type, message: 'Video de YouTube — se reproducirá en el banner.' }
        : { valid: false, type: 'invalid', message: 'URL de YouTube no válida.' };
    case 'vimeo':
      return getVimeoEmbedId(url)
        ? { valid: true, type, message: 'Video de Vimeo — se reproducirá en el banner.' }
        : { valid: false, type: 'invalid', message: 'URL de Vimeo no válida.' };
    case 'video':
      return { valid: true, type, message: 'Video MP4/WebM — se reproducirá directamente.' };
    case 'image':
      return { valid: true, type, message: 'Imagen — se mostrará como banner.' };
    case 'social':
      return {
        valid: true,
        type,
        message: 'Red social — se mostrará tarjeta con enlace externo (Instagram/TikTok/Facebook).',
      };
    case 'upload':
      return { valid: true, type, message: 'Archivo subido desde tu PC.' };
    default:
      return { valid: false, type: 'invalid', message: 'URL no compatible. Usa YouTube, Vimeo, MP4, JPG/PNG o sube un archivo.' };
  }
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
  if (isVideoUrl(url) || isSocialMediaUrl(url)) return url;
  if (url.startsWith('data:image/')) return url;
  if (url.startsWith('/') || url.startsWith('uploads/')) {
    return url.startsWith('/') ? url : `/${url}`;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1920&fit=cover`;
}

export function normalizeYoutubeUrl(url: string): string {
  const id = getYoutubeEmbedId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
}
