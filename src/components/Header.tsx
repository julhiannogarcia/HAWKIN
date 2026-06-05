'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Globe, Terminal, User, Power, Bookmark } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAlpha();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Radar', href: '/radar', special: true, color: 'text-cyan-400' }, 
    { name: 'Shield', href: '/shield', special: true, color: 'text-purple-500' },
    { name: 'Donación', href: '/donacion', special: true, color: 'text-pink-500' }, 
    { name: 'B2B', href: '/b2b' },
    { name: 'Trading', href: '/gold', special: true, color: 'text-[#FFD700]' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] p-6">
      <nav className="max-w-6xl mx-auto flex items-center justify-between glass-card bg-black/40 backdrop-blur-xl border-white/5 py-4 px-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* LOGO INSTITUCIONAL */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]">
             <Shield className="text-white fill-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">HAWKIN</span>
        </Link>

        {/* NAV LINKS DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:scale-110 ${
                link.special 
                  ? `${link.color} hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]` 
                  : pathname === link.href ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* AUTH / ACTIONS - SISTEMA ALPHA ID */}
        <div className="flex items-center gap-4">
           {user ? (
             <div className="flex items-center gap-4 border-l border-white/10 pl-6">
               <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <Link href="/vault" className="p-2 bg-white/5 rounded-lg hover:bg-cyan-500/20 text-gray-500 hover:text-cyan-400 transition-all">
                       <Bookmark size={12} />
                    </Link>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter italic">
                      { user.nickname || 'ALPHA_MEMBER' }
                    </span>
                  </div>
                  <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">Socio Nivel {Math.floor((user.xp || 0) / 1000) + 1}</span>
               </div>
               <button 
                 onClick={logout}
                 className="p-3 bg-red-600/10 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
               >
                 <Power size={14} />
               </button>
             </div>
           ) : (
             <Link href="/auth/signin">
                <button className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all shadow-xl flex items-center gap-3 group">
                  <Terminal size={14} className="group-hover:animate-pulse" /> ACCESO
                </button>
             </Link>
           )}
           <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white"><Menu size={24} /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 bg-black/95 z-[2000] p-12 flex flex-col gap-8 text-center"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-black uppercase italic ${link.special ? link.color : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link 
                href="/vault" 
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black uppercase italic text-cyan-400"
              >
                Bóveda
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
