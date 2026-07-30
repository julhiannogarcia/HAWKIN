'use client';

import { ExternalLink } from 'lucide-react';
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
}: NewsCardProps) {
  const hasVideo = Boolean(videoEmbed && isVideoUrl(url || videoEmbed || ''));
  const hasImage = Boolean(image && !image.includes('unsplash.com'));

  return (
    <article className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
      {/* Media */}
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
        {category === 'BREAKING' && (
          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
            Breaking
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-3">{title}</h3>

        {excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{excerpt}</p>
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
