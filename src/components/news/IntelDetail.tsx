'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import EditorialMedia from '@/components/news/EditorialMedia';
import SponsorSpace from '@/components/SponsorSpace';
import {
  AlertTriangle,
  ChevronLeft,
  Clock,
  ExternalLink,
  LoaderCircle,
  Share2,
} from 'lucide-react';
import { isVideoUrl } from '@/lib/adMediaUtils';

export type IntelItem = {
  id: string;
  title: string;
  excerpt?: string;
  body?: string;
  category?: string;
  image?: string | null;
  date?: string;
  source?: string;
  url?: string;
  originalUrl?: string;
  videoEmbed?: string | null;
  badge?: string;
  disclaimer?: string | null;
  isRumor?: boolean;
  isCeoRumor?: boolean;
  ceoName?: string | null;
  ceoRegion?: string | null;
  feed?: string;
};

type Props = {
  itemId: string;
  feedHint?: 'rumors' | 'live' | 'gold' | 'auto';
  backHref?: string;
  backLabel?: string;
};

export default function IntelDetail({
  itemId,
  feedHint = 'auto',
  backHref = '/radar',
  backLabel = 'Volver',
}: Props) {
  const [item, setItem] = useState<IntelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/news/item?id=${encodeURIComponent(itemId)}&feed=${feedHint}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (!mounted) return;
        if (data.item) setItem(data.item);
      } catch {
        if (mounted) setItem(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
    return () => {
      mounted = false;
    };
  }, [itemId, feedHint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="animate-spin text-amber-500" size={36} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          Cargando en HAWKIN…
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#020202] text-white">
        <Header />
        <div className="max-w-3xl mx-auto px-6 pt-40 pb-20 text-center space-y-6">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sin datos nuevos</h1>
          <p className="text-sm text-gray-500">
            Este ítem ya no está en el radar actual o el enlace expiró.
          </p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400"
          >
            <ChevronLeft size={14} /> {backLabel}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const isRumor = Boolean(item.isRumor || item.badge?.includes('RUMOR'));
  const hasImage = Boolean(item.image && !item.image.includes('unsplash.com') && !imgFailed);
  const hasVideo = Boolean(item.videoEmbed && isVideoUrl(item.url || item.videoEmbed || ''));
  const body = (item.body || item.excerpt || '').trim();
  const sourceUrl = item.url || item.originalUrl;

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />

      <article className="max-w-3xl mx-auto px-5 sm:px-6 pt-36 sm:pt-40 pb-20">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white mb-8"
        >
          <ChevronLeft size={14} /> {backLabel}
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          {isRumor ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black px-3 py-1 rounded">
              <AlertTriangle size={12} />
              {item.badge || 'RUMOR'}
            </span>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded">
              {item.badge || item.category || 'INTEL'}
            </span>
          )}
          {item.ceoName && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {item.ceoName}
              {item.ceoRegion ? ` · ${item.ceoRegion}` : ''}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-white mb-6">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 mb-8 pb-6 border-b border-white/10">
          <span className="font-semibold text-gray-300">{item.source || 'Fuente'}</span>
          {item.date && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} /> {item.date}
            </span>
          )}
        </div>

        {isRumor && (
          <div className="mb-8 px-4 py-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.07]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              No confirmado — no es noticia verificada por HAWKIN
            </p>
            {item.disclaimer && (
              <p className="text-xs text-amber-700/90 mt-1">{item.disclaimer}</p>
            )}
          </div>
        )}

        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 mb-10">
          {hasVideo && item.videoEmbed ? (
            item.videoEmbed.includes('youtube') || item.videoEmbed.includes('vimeo') ? (
              <iframe
                src={item.videoEmbed}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={item.title}
                allowFullScreen
              />
            ) : (
              <video src={item.videoEmbed} className="w-full h-full object-cover" controls playsInline />
            )
          ) : hasImage ? (
            <img
              src={item.image!}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <EditorialMedia source={item.source || 'HAWKIN'} label="Cobertura editorial" />
          )}
        </div>

        <div className="prose-invert max-w-none space-y-5 mb-12">
          {body ? (
            body.split(/\n+/).map((para, i) => (
              <p key={i} className="text-lg sm:text-xl text-gray-200 leading-relaxed font-light">
                {para}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Sin datos nuevos en el extracto. Consulta la fuente original.</p>
          )}
        </div>

        <div className="space-y-4 p-6 rounded-xl border border-white/10 bg-white/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fuente</p>
          <p className="text-sm text-gray-300">
            {item.source || 'RSS'}
            {item.date ? ` · ${item.date}` : ''}
          </p>

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors"
            >
              Leer en la fuente original
              <ExternalLink size={14} />
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: item.title, url: window.location.href }).catch(() => {});
              } else if (typeof navigator !== 'undefined') {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white"
          >
            <Share2 size={14} /> Compartir en HAWKIN
          </button>
        </div>

        <div className="mt-16 pt-10 border-t border-white/5">
          <SponsorSpace isPremium={false} type="inline" />
        </div>
      </article>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
