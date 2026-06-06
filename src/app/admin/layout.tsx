import Link from 'next/link';
import { 
  LayoutDashboard, Activity, Target, Users, DollarSign, 
  CreditCard, BrainCircuit, HeartPulse, ShieldAlert, 
  TrendingUp, FileText, UserCircle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { name: 'Executive Overview', href: '/admin', icon: <LayoutDashboard size={16} /> },
    { name: 'Live Traffic Center', href: '/admin/traffic', icon: <Activity size={16} /> },
    { name: 'Advertising Center', href: '/admin/b2b', icon: <Target size={16} /> },
    { name: 'Client Management', href: '/admin/clients', icon: <Users size={16} /> },
    { name: 'Financial Center', href: '/admin/financial', icon: <DollarSign size={16} /> },
    { name: 'Subscription Center', href: '/admin/subscriptions', icon: <CreditCard size={16} /> },
    { name: 'Intelligence Ops', href: '/admin/intelligence', icon: <BrainCircuit size={16} /> },
    { name: 'System Health', href: '/admin/system', icon: <HeartPulse size={16} /> },
    { name: 'Security Shield', href: '/admin/security', icon: <ShieldAlert size={16} /> },
    { name: 'Business Valuation', href: '/admin/valuation', icon: <TrendingUp size={16} /> },
    { name: 'Audit Logs', href: '/admin/audit', icon: <FileText size={16} /> },
    { name: 'Master Dashboard', href: '/admin/ceo', icon: <UserCircle size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar Administrativo Institucional */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#020202] shadow-2xl relative z-20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
             <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Global Control Center</span>
          </div>
          <div className="text-2xl font-black tracking-tighter uppercase italic leading-none">
            HAWKIN <span className="text-gray-600">ADMIN.</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 scrollbar-hide">
          {navLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.href} 
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white group border border-transparent hover:border-white/5"
            >
              <div className="text-gray-600 group-hover:text-cyan-400 transition-colors">
                {link.icon}
              </div>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white">ADMIN_ALPHA_NODE</p>
               <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Soberano del Sistema</p>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 shadow-lg">
               <UserCircle size={20} />
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#050505] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
        <div className="p-10 md:p-16 max-w-screen-2xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
