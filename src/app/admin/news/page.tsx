'use client';

import { useState } from 'react';

export default function CreateNews() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Big Tech');
  const [isUrgent, setIsUrgent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Crear Nueva Noticia</h1>
          <p className="text-gray-500 mt-2">Publica contenido exclusivo para el ecosistema HAWKIN.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors">
            Guardar Borrador
          </button>
          <button className="btn-glow text-sm">
            Publicar Ahora
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-black mb-2 block">Título de la Noticia</label>
              <input 
                type="text" 
                placeholder="Ej: Sam Altman revela el futuro de la IA..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xl font-bold focus:border-cyan-500 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-black mb-2 block">Contenido de la Noticia</label>
              <textarea 
                placeholder="Escribe tu análisis aquí..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[400px] text-gray-300 leading-relaxed focus:border-cyan-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Columna Lateral: Ajustes */}
        <div className="space-y-6">
          <div className="glass-card space-y-6">
            <h3 className="text-lg font-bold border-b border-white/10 pb-4">Configuración</h3>
            
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2 block">Categoría</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-cyan-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Big Tech</option>
                <option>CEO Radar</option>
                <option>Exclusivo HAWKIN</option>
                <option>Noticias del Futuro</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-sm font-medium">¿Noticia Urgente?</span>
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-cyan-500"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
            </div>
            <p className="text-[10px] text-gray-600">Las noticias urgentes aparecerán en el "Live Radar" inferior de forma prioritaria.</p>

            <div className="pt-4 border-t border-white/10">
              <button className="w-full py-4 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400 text-sm font-bold hover:bg-purple-600/30 transition-all flex items-center justify-center gap-2">
                <span>✨</span> Generar Resumen IA
              </button>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-cyan-500/10 to-transparent">
            <h3 className="text-sm font-bold mb-2">Visibilidad Global</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Al publicar, esta noticia será traducida y distribuida en todas las regiones configuradas en HAWKIN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
