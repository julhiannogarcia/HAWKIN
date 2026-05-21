'use client';

import { motion } from 'framer-motion';

export default function B2BPortal() {
  const adPlacements = [
    { name: 'Top Banner Premium', description: 'Máxima visibilidad global sobre el Hero principal.', price: '$150/semana' },
    { name: 'News Feed Placement', description: 'Integración fluida entre las noticias más leídas.', price: '$100/semana' },
    { name: 'Sidebar Exclusive', description: 'Visibilidad constante en el radar de noticias.', price: '$80/semana' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-8 flex justify-between items-center border-b border-white/5">
        <div className="text-2xl font-black tracking-widest text-cyan-400">HAWKIN B2B</div>
        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Volver al Portal</a>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <section className="text-center space-y-6 mb-20">
          <span className="text-purple-500 font-bold uppercase tracking-[0.3em] text-xs">Publicidad Global</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Impulsa tu Marca <br /> en la Élite de la IA.</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Posiciona tu empresa frente a miles de tomadores de decisiones, CEOs y entusiastas de la tecnología en todo el mundo.
          </p>
        </section>

        {/* Planes Publicitarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adPlacements.map((ad, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="glass-card flex flex-col justify-between border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{ad.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{ad.description}</p>
              </div>
              <div className="mt-10">
                <div className="text-3xl font-black text-white mb-6">{ad.price}</div>
                <button className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-bold text-sm hover:bg-purple-600 hover:text-white transition-all">
                  Reservar Espacio
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sección de Carga de Banner */}
        <section className="mt-32 glass-card border-dashed border-cyan-500/20 bg-cyan-500/5">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">¿Listo para publicar?</h2>
            <p className="text-gray-400 text-sm">Carga tu arte y selecciona las fechas de tu campaña.</p>
            <div className="mt-10 p-12 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all">
              <span className="text-3xl block mb-4">🖼️</span>
              <p className="font-bold text-cyan-400 uppercase text-xs tracking-widest">Arrastra tu Banner Aquí</p>
              <p className="text-[10px] text-gray-600 mt-2">Formatos sugeridos: 728x90px o 300x250px</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
