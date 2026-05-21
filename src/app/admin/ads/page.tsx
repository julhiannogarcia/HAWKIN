'use client';

export default function AdminAds() {
  const campaigns = [
    { id: 1, company: 'NVIDIA Global', placement: 'TOP_BANNER', status: 'ACTIVE', clicks: 1250 },
    { id: 2, company: 'Future AI Corp', placement: 'SIDEBAR', status: 'PENDING', clicks: 0 },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-purple-400">Publicidad B2B</h1>
        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Moderación de Campañas Corporativas</p>
      </header>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <tr>
              <th className="p-6 text-white">Empresa</th>
              <th className="p-6">Ubicación</th>
              <th className="p-6">Estado</th>
              <th className="p-6">Clicks</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300">
            {campaigns.map((ad) => (
              <tr key={ad.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold">{ad.company}</td>
                <td className="p-6 text-xs">{ad.placement}</td>
                <td className="p-6">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black ${ad.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {ad.status}
                  </span>
                </td>
                <td className="p-6 font-mono text-cyan-400">{ad.clicks}</td>
                <td className="p-6 text-right">
                  <button className="text-[10px] font-black text-cyan-400 hover:underline">Ver Arte</button>
                  <button className="ml-4 text-[10px] font-black text-red-500 hover:underline italic uppercase">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
