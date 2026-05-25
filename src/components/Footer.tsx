'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [hovered, setHovered] = useState<string | null>(null);

  const socials = [
    { name: 'Instagram', url: 'https://www.instagram.com/julhian_garcia/', color: '#E4405F' },
    { name: 'YouTube', url: 'https://www.youtube.com/@JulhianGarcia', color: '#FF0000' },
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61573680670745', color: '#1877F2' },
    { name: 'Twitch', url: 'https://m.twitch.tv/julhiangarcia/home', color: '#9146FF' },
    { name: 'Kick', url: 'https://kick.com/julhiangarcia', color: '#53FC18' }, // Kick añadido con su verde oficial
    { name: 'TikTok', url: 'https://www.tiktok.com/@julhianno.garcia', color: '#00f2ea' },
  ];

  return (
    <footer className="mt-20 pb-40 pt-20 border-t border-white/5 text-center bg-black/40 relative overflow-hidden">
      {/* Resplandor de fondo dinámico */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
         <div className="w-full h-full bg-gradient-to-b from-cyan-500/20 to-transparent blur-[100px]" />
      </div>

      <div className="text-xl font-black tracking-[0.5em] bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-12 uppercase italic relative z-10">
        HAWKIN <span className="text-cyan-400">Network</span>
      </div>
      
      <div className="flex justify-center gap-12 mb-16 flex-wrap relative z-10 px-6">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(social.name)}
            onMouseLeave={() => setHovered(null)}
            className="group relative"
          >
            {/* EFECTO DIGITAL SHADOW */}
            <span 
              className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 transition-all duration-500 group-hover:text-white"
              style={{
                textShadow: hovered === social.name ? `0 0 20px ${social.color}, 0 0 40px ${social.color}` : 'none',
                color: hovered === social.name ? 'white' : ''
              }}
            >
              {social.name}
            </span>
            {/* Línea inferior neón */}
            <div 
              className="absolute -bottom-2 left-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ backgroundColor: social.color }}
            />
          </a>
        ))}
      </div>

      <div className="text-[10px] text-gray-700 uppercase tracking-[0.4em] leading-loose relative z-10 max-w-2xl mx-auto px-6">
        Ecosistema Global HAWKIN &copy; 2026<br />
        Liderado por la visión de <span className="text-white font-black hover:text-cyan-400 transition-colors duration-1000 cursor-default">Julhianno Garcia</span> <br />
        <span className="text-gray-800 text-[8px]">Todos los derechos reservados • Tecnología de Élite</span>
      </div>
    </footer>
  );
}
