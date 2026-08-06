'use client';

import { ExternalLink, AlertTriangle } from 'lucide-react';
import { isVideoUrl } from '@/lib/adMediaUtils';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt?: string;
  category?: string;
  image?: string | null;
  date?: string;
  source?: string;
  url?: string;
  videoEmbed?: string | null;
  isCeoRumor?: boolean;
  badge?: string;
  disclaimer?: string;
}

export default function NewsCard({
  title,
  excerpt = '',
  category = 'INTEL',
  image,
  date = '',
  source = 'RSS',
  url,
  videoEmbed,
  isCeoRumor = false,
  badge,
  disclaimer,
}: NewsCardProps) {
  const hasVideo = Boolean(videoEmbed && isVideoUrl(url || videoEmbed || ''));
  const hasImage = Boolean(image && !image.includes('unsplash.com'));
  const isRumor = category === 'RUMOR' || Boolean(badge?.includes('RUMOR'));
  const rumorLabel = badge || (isCeoRumor ? 'RUMOR · CEO' : isRumor ? 'RUMOR' : null);

  return (
    <article
      className={`flex flex-col h-full bg-[#0a0a0a] border rounded-lg overflow-hidden transition-colors ${
        isRumor
          ? 'border-amber-500/30 hover:border-amber-500/50'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="relative aspect-[16/9] bg-[#050505] border-b border-white/5">
        {hasVideo && videoEmbed ? (
          videoEmbed.includes('youtube') || videoEmbed.includes('vimeo') ? (
            <iframe
              src={videoEmbed}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={title}
              loading="lazy"
            />
          ) : (
            <video src={videoEmbed} className="w-full h-full object-cover" controls muted playsInline />
          )
        ) : hasImage ? (
          <img src={image!} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              {source}
            </span>
            <span className="text-[9px] text-gray-700 mt-1">Sin imagen del artículo</span>
          </div>
        )}

        {rumorLabel && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black px-2.5 py-1 rounded shadow">
            <AlertTriangle size={11} />
            {rumorLabel}
          </span>
        )}

        {!isRumor && category === 'BREAKING' && (
          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
            Breaking
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {isRumor && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/90">
            No confirmado · no es noticia verificada
          </p>
        )}

        <h3 className="text-base font-semibold text-white leading-snug line-clamp-3">{title}</h3>

        {excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{excerpt}</p>
        )}

        {disclaimer && (
          <p className="text-[10px] text-amber-700/80 italic">{disclaimer}</p>
        )}

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500">
            <span className="font-medium text-gray-400">{source}</span>
            {date && <span className="text-gray-600"> · {date}</span>}
          </p>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-cyan-400 hover:text-cyan-300"
            >
              Ver original
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
