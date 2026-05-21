export default function AdminDashboard() {
  const stats = [
    { label: 'Suscriptores Activos', value: '0', color: 'text-cyan-400' },
    { label: 'Ingresos Mensuales', value: '$0.00', color: 'text-purple-500' },
    { label: 'Noticias Publicadas', value: '0', color: 'text-white' },
    { label: 'Anuncios Pendientes', value: '0', color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 mt-2">Bienvenido de nuevo, Julhianno. Aquí tienes un resumen de HAWKIN.</p>
      </header>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
            <p className={`text-4xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <h2 className="text-xl font-bold mb-4">Últimas Noticias</h2>
          <div className="text-gray-600 text-sm italic">No hay noticias publicadas todavía.</div>
          <button className="mt-6 text-sm font-bold text-cyan-400 hover:underline">
            + Crear nueva noticia
          </button>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-bold mb-4">Solicitudes Publicitarias</h2>
          <div className="text-gray-600 text-sm italic">No hay anuncios pendientes de revisión.</div>
          <button className="mt-6 text-sm font-bold text-purple-500 hover:underline">
            Ver todas las solicitudes
          </button>
        </div>
      </div>
    </div>
  );
}
