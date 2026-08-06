'use client';

import { Newspaper } from 'lucide-react';

/** Placeholder editorial — nunca caja negra vacía */
export default function EditorialMedia({
  source = 'HAWKIN',
  label,
  className = '',
}: {
  source?: string;
  label?: string;
  className?: string;
}) {
  const seed = source.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = seed % 360;
  const hue2 = (hue + 40) % 360;

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 28% 14%) 0%, hsl(${hue2} 22% 8%) 55%, #0a0a0a 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 0.5px, transparent 0.5px), radial-gradient(circle at 80% 60%, white 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />
      <Newspaper className="relative text-white/25 mb-3" size={28} />
      <span className="relative text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/70 line-clamp-2">
        {source}
      </span>
      <span className="relative text-[10px] text-white/35 mt-2 uppercase tracking-widest">
        {label || 'Sin imagen del artículo'}
      </span>
    </div>
  );
}
