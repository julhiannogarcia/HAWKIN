'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import EditorialMedia from '@/components/news/EditorialMedia';
import { isVideoUrl } from '@/lib/adMediaUtils';
import { useState } from 'react';

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
  /** Destino interno HAWKIN. Default: rumor → /rumors/id, else → /news/id */
  detailHref?: string;
}

export default function NewsCard({
  id,
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
  detailHref,
}: NewsCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const isRumor = category === 'RUMOR' || Boolean(badge?.includes('RUMOR'));
  const rumorLabel = badge || (isCeoRumor ? 'RUMOR · CEO' : isRumor ? 'RUMOR' : null);
  const href = detailHref || (isRumor ? `/rumors/${id}` : `/news/${id}`);
  const hasVideo = Boolean(videoEmbed && isVideoUrl(url || videoEmbed || ''));
  const hasImage = Boolean(image && !image.includes('unsplash.com') && !imgFailed);

  return (
    <Link
      href={href}
      className={`flex flex-col h-full bg-[#0c0c0c] border rounded-xl overflow-hidden transition-colors group ${
        isRumor
          ? 'border-amber-500/30 hover:border-amber-500/55'
          : 'border-white/10 hover:border-cyan-500/35'
      }`}
    >
      <div className="relative aspect-[16/9] border-b border-white/5 overflow-hidden">
        {hasVideo && videoEmbed ? (
          <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Video · abrir para ver
            </span>
          </div>
        ) : hasImage ? (
          <img
            src={image!}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <EditorialMedia source={source} />
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
            No confirmado · leer en HAWKIN
          </p>
        )}

        <h3 className="text-base font-semibold text-white leading-snug line-clamp-3 group-hover:text-cyan-100">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{excerpt}</p>
        )}

        {disclaimer && (
          <p className="text-[10px] text-amber-700/80 italic line-clamp-2">{disclaimer}</p>
        )}

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 truncate">
            <span className="font-medium text-gray-400">{source}</span>
            {date && <span className="text-gray-600"> · {date}</span>}
          </p>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-cyan-500/80 group-hover:text-cyan-400">
            Leer →
          </span>
        </div>
      </div>
    </Link>
  );
}
