'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 7.2 }}
        className="text-5xl md:text-8xl font-black tracking-tighter leading-tight"
      >
        Descubre la IA que <br />
        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          otros no ven.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 7.5 }}
        className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
      >
        El primer ecosistema global de noticias, cursos y visión del futuro, 
        adaptado a tu región y moneda local.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 7.8 }}
        className="mt-12"
      >
        <a href="#planes" className="btn-glow">
          Comenzar Ahora
        </a>
      </motion.div>
    </section>
  );
}
