'use client';

import { useState } from 'react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Maestría en Prompt Engineering', price: '$49', sales: 0, status: 'Publicado' },
    { id: 2, title: 'IA para Negocios Globales', price: '$79', sales: 0, status: 'Borrador' },
  ]);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gestión de Cursos</h1>
          <p className="text-gray-500 mt-2">Crea y administra la oferta educativa de la Academia HAWKIN.</p>
        </div>
        <button className="btn-glow text-sm">
          + Crear Nuevo Curso
        </button>
      </header>

      {/* Grid de Cursos Actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="glass-card flex flex-col justify-between hover:border-cyan-500/30 transition-all group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${course.status === 'Publicado' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {course.status}
                </span>
                <span className="text-xl font-black text-white">{course.price}</span>
              </div>
              <h3 className="text-lg font-bold leading-tight group-hover:text-cyan-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest font-bold">Ventas: {course.sales}</p>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
                Editar Módulos
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs hover:text-red-400 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de Creación Rápida (Concepto) */}
      <div className="glass-card border-dashed border-white/20">
        <h2 className="text-xl font-bold mb-6">Configuración de Nuevo Curso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black block mb-2">Nombre del Curso</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500" placeholder="Ej: Dominando ChatGPT 5" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black block mb-2">Precio (USD)</label>
              <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500" placeholder="49" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black block mb-2">Descripción Corta</label>
              <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500 h-32" placeholder="¿Qué aprenderán tus alumnos?"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
