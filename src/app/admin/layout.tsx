import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Administrativo */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 bg-black/50 backdrop-blur-xl">
        <div className="text-xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          HAWKIN ADMIN
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="p-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-transparent hover:border-cyan-500/30">
            Vista General
          </Link>
          <Link href="/admin/news" className="p-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-transparent hover:border-cyan-500/30">
            Gestionar Noticias
          </Link>
          <Link href="/admin/courses" className="p-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-transparent hover:border-cyan-500/30">
            Gestionar Cursos
          </Link>
          <Link href="/admin/ads" className="p-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-transparent hover:border-cyan-500/30">
            Publicidad B2B
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 text-[10px] text-gray-500 uppercase tracking-widest">
          Fundador: Julhianno Garcia
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
