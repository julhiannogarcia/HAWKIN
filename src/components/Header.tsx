'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Globe, GraduationCap, Building2, Coins } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Radar', href: '/#news' },
    { name: 'Academia', href: '/academy' },
    { name: 'Shield', href: '/shield' },
    { name: 'Donación', href: '/donacion', special: true, color: 'text-pink-500' }, // Nombre cambiado y color distintivo
    { name: 'B2B', href: '/b2b' },
    { name: 'GOLD', href: '/gold', special: true, color: 'text-[#FFD700]' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] p-6">
      <nav className="max-w-6xl mx-auto flex items-center justify-between glass-card bg-black/40 backdrop-blur-xl border-white/5 py-4 px-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
             <Shield className="text-white fill-white" size={18} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">HAWKIN</span>
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

        {/* AUTH / ACTIONS */}
        <div className="flex items-center gap-4">
           {session ? (
             <div className="flex items-center gap-4">
               <span className="hidden md:block text-[9px] font-black text-gray-500 uppercase tracking-widest">Socio Alpha</span>
               <button onClick={() => signOut()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase hover:bg-red-500 transition-all">Salir</button>
             </div>
           ) : (
             <button onClick={() => signIn()} className="px-8 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">Entrar</button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
