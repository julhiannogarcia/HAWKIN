'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-8 md:py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
      <Link href="/" className="text-xl md:text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        HAWKIN
      </Link>
      
      {/* Menu Desktop */}
      <nav className="hidden md:flex gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">Inicio</Link>
        <Link href="/news" className="hover:text-cyan-400 transition-colors">Radar</Link>
        <Link href="/academy" className="hover:text-cyan-400 transition-colors">Academia</Link>
        <Link href="/shield" className="hover:text-red-500 transition-colors">Shield</Link>
        <Link href="/philanthropy" className="hover:text-amber-500 transition-colors">Impacto</Link>
        <Link href="/b2b" className="hover:text-purple-400 transition-colors">B2B</Link>
        <Link href="/auth/signin" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white">
          Entrar
        </Link>
      </nav>

      {/* Botón Menu Móvil */}
      <button 
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay Menu Móvil */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[73px] bg-black/95 backdrop-blur-xl z-40 flex flex-col p-8 gap-8 md:hidden border-t border-white/5 overflow-y-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link href="/news" className="text-2xl font-black tracking-tighter" onClick={() => setIsMenuOpen(false)}>Radar IA</Link>
          <Link href="/academy" className="text-2xl font-black tracking-tighter" onClick={() => setIsMenuOpen(false)}>Academia</Link>
          <Link href="/shield" className="text-2xl font-black tracking-tighter text-red-500" onClick={() => setIsMenuOpen(false)}>Shield (Ciberseguridad)</Link>
          <Link href="/philanthropy" className="text-2xl font-black tracking-tighter text-amber-500" onClick={() => setIsMenuOpen(false)}>Impacto Social</Link>
          <Link href="/b2b" className="text-2xl font-black tracking-tighter text-purple-400" onClick={() => setIsMenuOpen(false)}>Anunciantes B2B</Link>
          <hr className="border-white/10" />
          <Link href="/auth/signin" className="btn-glow text-center py-4 uppercase text-[10px]" onClick={() => setIsMenuOpen(false)}>
            Entrar al Portal
          </Link>
        </div>
      )}
    </header>
  );
}
