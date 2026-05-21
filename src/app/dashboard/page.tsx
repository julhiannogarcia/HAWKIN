'use client';

export default function UserDashboard() {
  const myCourses = [
    { title: 'Maestría en Prompt Engineering', progress: 35, icon: '🤖' },
    { title: 'Excel para el Futuro', progress: 0, icon: '📊' },
  ];

  const savedNews = [
    { title: 'GPT-5: Rumores sobre la fecha de lanzamiento', date: 'Hace 2 horas' },
    { title: 'NVIDIA presenta nuevos chips Blackwell', date: 'Ayer' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Saludo Inicial */}
      <header>
        <h1 className="text-4xl font-black tracking-tight">Hola, Socio.</h1>
        <p className="text-gray-500 mt-2 uppercase tracking-widest text-[10px] font-bold">Bienvenido a tu Ecosistema Inteligente</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Mis Cursos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-cyan-400">●</span> Mis Aprendizajes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map((course, i) => (
              <div key={i} className="glass-card p-6 hover:border-cyan-500/30 transition-all cursor-pointer group">
                <div className="text-3xl mb-4">{course.icon}</div>
                <h3 className="font-bold text-sm group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    <span>Progreso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.5)] transition-all duration-1000" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Noticias Guardadas y Estado */}
        <div className="space-y-8">
          {/* Estado de Suscripción */}
          <div className="glass-card border-cyan-500/20 bg-cyan-500/5 p-6">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mb-1">Membresía Activa</p>
            <p className="text-lg font-bold">Plan Anual Élite</p>
            <p className="text-[10px] text-gray-500 mt-4 uppercase">Próximo cobro: 19 Mayo, 2027</p>
            <button className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Gestionar Facturación
            </button>
          </div>

          {/* Noticias Guardadas */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-purple-500">●</span> Guardado
            </h2>
            <div className="space-y-3">
              {savedNews.map((news, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all cursor-pointer">
                  <p className="text-xs font-bold leading-tight">{news.title}</p>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-tighter">{news.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
