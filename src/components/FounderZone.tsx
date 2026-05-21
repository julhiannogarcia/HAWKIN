'use client';

import { motion } from 'framer-motion';
import { Play, Camera, MessageCircle, Send, Radio, Globe } from 'lucide-react';

export default function FounderZone() {
  const socials = [
    { icon: <MessageCircle size={20} />, name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61573680670745' },
    { icon: <Camera size={20} />, name: 'Instagram', url: 'https://www.instagram.com/julhian_garcia/' },
    { icon: <Play size={20} />, name: 'YouTube', url: 'https://www.youtube.com/@JulhianGarcia' },
    { icon: <Radio size={20} />, name: 'Twitch', url: 'https://m.twitch.tv/julhiangarcia/home' },
    { icon: <Send size={20} />, name: 'TikTok', url: 'https://www.tiktok.com/@julhianno.garcia' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-32 w-full">
      <div className="glass-card bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-white/10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-4 md:p-12">
          
          {/* Columna 1: Info del Fundador */}
          <div className="space-y-8">
            <div>
              <span className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block">
                Liderando la Revolución
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                Ecosistema <br />
                <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Inteligente
                </span>
              </h2>
            </div>

            <p className="text-gray-400 leading-relaxed text-lg italic border-l-2 border-cyan-500 pl-6">
              "Mi misión con HAWKIN es democratizar el acceso a la inteligencia del futuro. 
              No solo informamos, construimos la soberanía tecnológica de nuestra región."
            </p>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conecta con nuestra comunidad</p>
              <div className="flex flex-wrap gap-4">
                {socials.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all flex items-center gap-2 text-sm"
                  >
                    {social.icon}
                    <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-tighter">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 2: Espacio Multimedia / Stream */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
              {/* Simulación de Video/Live */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Exclusivo Suscriptores</span>
              </div>
              
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-cyan-500/50 transition-all">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
                <p className="text-sm font-bold text-gray-400">Ver último análisis en video</p>
              </div>
              
              {/* Imagen de fondo desenfocada simulando miniatura */}
              <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
