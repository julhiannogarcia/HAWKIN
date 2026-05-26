'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, ShieldAlert, Globe, FileSpreadsheet, 
  BarChart3, LayoutDashboard, History, Settings, ExternalLink, 
  Eye, Lock, Key, AlertCircle, ShoppingBag, Heart 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as XLSX from 'xlsx';

// DATOS DE SIMULACIÓN DE ÉLITE (Se conectarán a Supabase luego)
const MOCK_REVENUE = [
  { name: 'Ene', total: 1200 }, { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 }, { name: 'Abr', total: 3400 },
  { name: 'May', total: 4200 },
];

const MOCK_DONORS = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@mail.com', amount: '$50.00', date: '2026-05-24' },
  { id: 2, name: 'Elena Rivas', email: 'elena@tech.io', amount: '$100.00', date: '2026-05-23' },
];

const MOCK_ADS = [
  { id: 1, company: 'Tech Store Peru', contact: 'Juan Perez', email: 'ventas@techstore.pe', phone: '+51 900111222', plan: 'Top Banner', price: '$499' },
  { id: 2, company: 'Elite Clothing', contact: 'Maria Style', email: 'm.style@boutique.com', phone: '+51 988777666', plan: 'Shopping Link', price: '$199' },
];

const MOCK_LOGS = [
  { time: '10:45:22', type: 'ERROR', msg: 'Paypal Timeout [Ref: 404]' },
  { time: '11:12:05', type: 'INFO', msg: 'Nueva suscripción detectada: Socio_77' },
  { time: '11:30:00', type: 'WARN', msg: 'Latencia alta en Nodo Tokyo' },
];

export default function AdminVision() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeView, setActiveTab] = useState<'overview' | 'finance' | 'errors' | 'links'>('overview');

  const handleLogin = () => {
    // LLAVE MAESTRA PRIVADA DE JULHIANNO
    if (pin === '7777') { 
      setIsAuthenticated(true);
    } else {
      alert("Acceso Denegado. Solo el Fundador puede entrar.");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([...MOCK_DONORS, ...MOCK_ADS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HAWKIN_FINANCE");
    XLSX.writeFile(wb, "HAWKIN_REPORTE_GLOBAL.xlsx");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white/[0.03] border border-white/10 p-12 rounded-[50px] text-center space-y-8">
           <Lock className="mx-auto text-cyan-400" size={50} />
           <h1 className="text-2xl font-black tracking-widest text-white uppercase italic">HAWKIN VISION</h1>
           <p className="text-gray-500 text-xs uppercase font-bold tracking-widest leading-loose">Centro de Mando Privado. <br />Identifícate, Fundador.</p>
           <input 
             type="password" 
             value={pin}
             onChange={(e) => setPin(e.target.value)}
             placeholder="PIN MAESTRO"
             className="w-full bg-black border border-white/20 rounded-2xl py-4 text-center text-2xl tracking-[1em] text-cyan-400 outline-none focus:border-cyan-400 transition-all"
           />
           <button onClick={handleLogin} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all">
              ENTRAR AL SISTEMA
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#010101] text-white flex flex-col xl:flex-row">
      
      {/* SIDEBAR DE MANDO */}
      <nav className="w-full xl:w-80 bg-black border-r border-white/5 p-8 flex flex-col gap-12">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Eye className="text-black" size={20} />
           </div>
           <h2 className="font-black tracking-tighter text-xl italic uppercase">VISION <span className="text-cyan-400">ADMIN</span></h2>
        </div>

        <div className="flex-1 space-y-4">
           {[
             { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
             { id: 'finance', label: 'Finanzas & Ads', icon: <DollarSign size={18} /> },
             { id: 'errors', label: 'Salud del Sistema', icon: <ShieldAlert size={18} /> },
             { id: 'links', label: 'Directorio Global', icon: <ExternalLink size={18} /> },
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-white text-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
             >
                {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        <button onClick={exportToExcel} className="flex items-center gap-4 px-6 py-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all">
           <FileSpreadsheet size={18} /> Exportar Excel
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-8 xl:p-20 overflow-y-auto h-screen scrollbar-hide">
        
        {activeView === 'overview' && (
          <div className="space-y-16">
            <header className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Sincronización Total</p>
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic">Estado del <span className="text-cyan-400">Imperio.</span></h1>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Servidores Activos</p>
               </div>
            </header>

            {/* MÉTRICAS FLASH */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
                  <Users className="text-cyan-400 mb-4" size={24} />
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">SOCIOS LIVE</p>
                  <h4 className="text-4xl font-black mt-2">1,245</h4>
               </div>
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
                  <Globe className="text-purple-500 mb-4" size={24} />
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">ORIGEN TOP</p>
                  <h4 className="text-4xl font-black mt-2 text-purple-400">PERÚ / USA</h4>
               </div>
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
                  <Heart className="text-pink-500 mb-4" size={24} />
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">DONACIONES</p>
                  <h4 className="text-4xl font-black mt-2 text-pink-400">$2,150</h4>
               </div>
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
                  <ShoppingBag className="text-orange-400 mb-4" size={24} />
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">VENTAS ADS</p>
                  <h4 className="text-4xl font-black mt-2 text-orange-400">$3,400</h4>
               </div>
            </div>

            {/* GRÁFICO DE CRECIMIENTO */}
            <div className="glass-card bg-black border-white/5 p-10 rounded-[50px] h-[500px]">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-12">Crecimiento de Capital Mensual (USD)</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_REVENUE}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="name" stroke="#555" fontSize={10} />
                    <YAxis stroke="#555" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Area type="monotone" dataKey="total" stroke="#00f2ff" fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 'finance' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black uppercase italic">Base de Datos <span className="text-[#FFD700]">Financiera.</span></h2>
            
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 flex items-center gap-3">
                 <Heart size={16} /> Registro de Benefactores
              </h3>
              <div className="overflow-x-auto rounded-[30px] border border-white/5">
                <table className="w-full text-left">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="p-6">Socio Donante</th>
                        <th className="p-6">Email</th>
                        <th className="p-6">Monto</th>
                        <th className="p-6">Fecha</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs text-gray-400">
                      {MOCK_DONORS.map(d => (
                        <tr key={d.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                           <td className="p-6 font-bold text-white">{d.name}</td>
                           <td className="p-6">{d.email}</td>
                           <td className="p-6 text-green-400 font-black">{d.amount}</td>
                           <td className="p-6 tracking-tighter">{d.date}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-8 pt-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400 flex items-center gap-3">
                 <ShoppingBag size={16} /> Clientes B2B (Publicidad)
              </h3>
              <div className="overflow-x-auto rounded-[30px] border border-white/5">
                <table className="w-full text-left">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="p-6">Empresa</th>
                        <th className="p-6">Contacto</th>
                        <th className="p-6">Email / Teléfono</th>
                        <th className="p-6">Plan</th>
                        <th className="p-6">Valor</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs text-gray-400">
                      {MOCK_ADS.map(a => (
                        <tr key={a.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                           <td className="p-6 font-bold text-white">{a.company}</td>
                           <td className="p-6">{a.contact}</td>
                           <td className="p-6">
                              <p>{a.email}</p>
                              <p className="text-[9px] opacity-50">{a.phone}</p>
                           </td>
                           <td className="p-6"><span className="bg-white/5 px-3 py-1 rounded-full text-[9px]">{a.plan}</span></td>
                           <td className="p-6 text-cyan-400 font-black">{a.price}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'errors' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black uppercase italic">Salud y <span className="text-red-500">Mantenimiento.</span></h2>
            <div className="p-10 bg-black border border-red-500/20 rounded-[50px] space-y-6">
               <div className="flex items-center gap-4 text-red-500 mb-8">
                  <AlertCircle />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logs de Error en Tiempo Real</span>
               </div>
               <div className="space-y-4">
                  {MOCK_LOGS.map((log, i) => (
                    <div key={i} className="flex gap-8 p-4 bg-white/[0.02] border-l-4 border-red-600 rounded-r-xl font-mono text-xs">
                       <span className="text-gray-600">[{log.time}]</span>
                       <span className={`font-black ${log.type === 'ERROR' ? 'text-red-500' : 'text-yellow-500'}`}>{log.type}</span>
                       <span className="text-gray-300">{log.msg}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeView === 'links' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black uppercase italic">Directorio <span className="text-gray-500">HAWKIN.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
               {[
                 { name: 'Dominio Principal', url: 'https://aihawkin.com' },
                 { name: 'Panel Vercel', url: 'https://vercel.com' },
                 { name: 'Google AI Studio', url: 'https://aistudio.google.com' },
                 { name: 'Dashboard Stripe', url: 'https://dashboard.stripe.com' },
                 { name: 'Dashboard PayPal', url: 'https://www.paypal.com/mep/dashboard' },
                 { name: 'Hostinger Email', url: 'https://hpanel.hostinger.com/emails' },
               ].map((link, i) => (
                 <a 
                   key={i} 
                   href={link.url} 
                   target="_blank" 
                   className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-cyan-400/40 transition-all flex flex-col items-center gap-4"
                 >
                    <ExternalLink className="text-gray-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{link.name}</span>
                 </a>
               ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
