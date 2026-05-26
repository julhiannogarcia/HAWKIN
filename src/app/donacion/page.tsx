'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { Heart, Globe, Users, Zap, Mail, ShieldCheck, Info, Loader2 } from 'lucide-react';

export default function DonacionPage() {
  const [geoData, setGeoData] = useState<any>(null);
  const [amount, setAmount] = useState('10.00');
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [isProcessing, setIsConnecting] = useState(false);

  useEffect(() => {
    // 1. Detectar Localización para el Idioma y Moneda
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) { console.error(e); }
    };
    fetchGeo();

    // 2. Cargar PayPal SDK
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => setIsPaypalLoaded(true);
    document.body.appendChild(script);
  }, []);

  const isEnglish = geoData?.countryCode === 'US' || geoData?.countryCode === 'GB';
  const title = isEnglish ? "CROWDFUNDING" : "DONACIÓN";

  // Componente de Botones PayPal para Donaciones
  const PaypalDonationButtons = ({ value }: { value: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isPaypalLoaded && containerRef.current && window.paypal) {
        containerRef.current.innerHTML = '';
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'donate' },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `Donación HAWKIN Social - Impacto Tecnológico`,
                amount: { value: value }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            
            // 3. Preparar el correo de confirmación al fundador
            const donorName = order.payer.name.given_name + " " + order.payer.name.surname;
            const donorEmail = order.payer.email_address;
            const subject = encodeURIComponent(`NUEVA DONACIÓN HAWKIN - ${donorName}`);
            const body = encodeURIComponent(`Hola Julhianno,\n\nSe ha recibido una nueva donación para la fundación.\n\nDonante: ${donorName}\nCorreo: ${donorEmail}\nMonto: $${value}\nID Transacción: ${order.id}\n\nEste socio apoya el desarrollo tecnológico social.`);
            
            // Abrir mailto y redirigir a celebración
            window.location.href = `mailto:julhianno@aihawkin.com?subject=${subject}&body=${body}`;
            setTimeout(() => {
                window.location.href = "/?success=true"; // Activa fuegos artificiales en la home
            }, 1000);
          }
        }).render(containerRef.current);
      }
    }, [isPaypalLoaded, value]);

    return <div ref={containerRef} className="mt-8 min-h-[150px]" />;
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-pink-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <section className="text-center space-y-10 mb-24">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(236,72,153,0.2)]"
          >
            <Heart size={48} className="text-pink-500 animate-pulse" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              HAWKIN <span className="text-pink-500">{title}</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto uppercase tracking-widest font-bold">
              {isEnglish ? "Empowering the future through technology" : "Impulsando el desarrollo a través de la tecnología"}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           {/* EXPLICACIÓN DE LA MISIÓN */}
           <div className="space-y-12">
              <div className="p-10 glass-card bg-white/[0.02] border-white/5 rounded-[50px] space-y-8">
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter">Nuestra <span className="text-pink-500">Misión Social.</span></h2>
                 <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                   "Tu apoyo no es solo una cifra, es una herramienta. Donamos tecnología y capacitación a personas con talento que desean trabajar pero carecen de recursos."
                 </p>
                 <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                          <Zap size={20} />
                       </div>
                       <p className="text-sm text-gray-300"><b>Impulso de Trabajo:</b> Equipos y software para nuevos talentos.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                          <Users size={20} />
                       </div>
                       <p className="text-sm text-gray-300"><b>Apoyo Humanitario:</b> Ayuda directa a familias en necesidad extrema.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* FORMULARIO DE DONACIÓN FLEXIBLE */}
           <div className="glass-card bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20 p-12 rounded-[60px] shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-widest text-center mb-10">Monto de la {title}</h3>
              
              <div className="space-y-8">
                 <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-[25px] py-6 pl-12 pr-6 text-3xl font-black outline-none focus:border-pink-500 transition-all"
                      placeholder="0.00"
                    />
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    {['10', '50', '100'].map((val) => (
                      <button 
                        key={val} 
                        onClick={() => setAmount(val + ".00")}
                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${amount === val + ".00" ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                      >
                        ${val}
                      </button>
                    ))}
                 </div>

                 <div className="pt-10 border-t border-white/5">
                    {isPaypalLoaded ? (
                      <PaypalDonationButtons value={amount} />
                    ) : (
                      <div className="w-full h-16 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[10px] text-gray-600 font-black uppercase">
                         Sincronizando Pasarela Social...
                      </div>
                    )}
                 </div>

                 <p className="text-[9px] text-gray-600 text-center uppercase font-bold tracking-[0.2em]">
                   🔒 Transacción Cifrada Protegida por HAWKIN Shield
                 </p>
              </div>
           </div>
        </div>

        <section className="mt-40 text-center space-y-8">
           <Info className="mx-auto text-pink-500 opacity-40" />
           <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] max-w-xl mx-auto leading-loose">
             Al realizar una donación, tu información será registrada en nuestra base de datos social para transparencia total. Recibirás un certificado de impacto en tu correo.
           </p>
        </section>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
