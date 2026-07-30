'use client';

import { CloudUpload } from 'lucide-react';
import { buildYoutubeEmbedUrl, getSecureImageUrl, getVimeoEmbedId, getYoutubeEmbedId, getYoutubeStartSeconds, isVideoUrl } from '@/lib/adMediaUtils';

interface AdMediaPreviewProps {
  url: string;
  className?: string;
  emptyLabel?: string;
}

export default function AdMediaPreview({
  url,
  className = 'w-full aspect-video bg-black rounded-[40px] border border-dashed border-white/10 relative overflow-hidden',
  emptyLabel = 'Vista previa del anuncio',
}: AdMediaPreviewProps) {
  if (!url) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="text-center space-y-3">
          <CloudUpload className="text-gray-800 mx-auto" size={40} />
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{emptyLabel}</p>
        </div>
      </div>
    );
  }

  if (isVideoUrl(url)) {
    const youtubeId = getYoutubeEmbedId(url);
    if (youtubeId) {
      const start = getYoutubeStartSeconds(url);
      return (
        <div className={className}>
          <iframe
            src={buildYoutubeEmbedUrl(youtubeId, { autoplay: false, start })}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Vista previa del video"
          />
        </div>
      );
    }

    const vimeoId = getVimeoEmbedId(url);
    if (vimeoId) {
      return (
        <div className={className}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&muted=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Vista previa del video"
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <video controls muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={url} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={getSecureImageUrl(url)}
        className="absolute inset-0 w-full h-full object-cover"
        alt="Vista previa"
      />
    </div>
  );
}
