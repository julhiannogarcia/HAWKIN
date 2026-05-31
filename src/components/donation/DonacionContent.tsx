'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { useSession } from 'next-auth/react';
import { Heart, Globe, Users, Zap, Mail, ShieldCheck, Info, Loader2 } from 'lucide-react';

export default function DonacionPage() {
  const { data: session } = useSession();
  const [geoData, setGeoData] = useState<any>(null);
  const [amount, setAmount] = useState('10.00');
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  useEffect(() => {
    // 1. Detectar Localización con Prioridad Absoluta
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
        
        // Ajustar el monto inicial según la moneda local (equivalente a $10)
        const rate = data.rate || 1;
        setAmount((10 * rate).toFixed(0) + ".00");
        setIsLoadingGeo(false);
      } catch (e) { 
        console.error(e);
        setIsLoadingGeo(false);
      }
    };
    fetchGeo();

    // 2. Cargar PayPal SDK
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';
    if (!document.getElementById('paypal-sdk-donacion')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk-donacion';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => setIsPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalLoaded(true);
    }
  }, []);

  const isEnglish = geoData?.countryCode === 'US' || geoData?.countryCode === 'GB';
  const title = isEnglish ? "CROWDFUNDING" : "DONACIÓN";

  const PaypalDonationButtons = ({ value }: { value: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isPaypalLoaded && containerRef.current && window.paypal) {
        containerRef.current.innerHTML = '';
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'donate' },
          createOrder: (data: any, actions: any) => {
            // Siempre enviamos el valor convertido a USD para PayPal
            const usdValue = (parseFloat(value) / (geoData?.rate || 1)).toFixed(2);
            return actions.order.create({
              purchase_units: [{
                description: `Donación HAWKIN Social - Impacto Tecnológico`,
                amount: { value: usdValue }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            const donorName = order.payer.name.given_name + " " + order.payer.name.surname;
            const donorEmail = order.payer.email_address;
            const subject = encodeURIComponent(`NUEVA DONACIÓN HAWKIN - ${donorName}`);
            const body = encodeURIComponent(`Hola Julhianno,\n\nSe ha recibido una nueva donación para la fundación.\n\nDonante: ${donorName}\nCorreo: ${donorEmail}\nMonto: ${geoData?.currencySymbol}${value}\nID Transacción: ${order.id}`);
            
            window.location.href = `mailto:julhianno@aihawkin.com?subject=${subject}&body=${body}`;
            setTimeout(() => {
                window.location.href = "/?success=true";
            }, 1000);
          }
        }).render(containerRef.current);
      }
    }, [isPaypalLoaded, value]);

    return <div ref={containerRef} className="mt-8 min-h-[150px]" />;
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-pink-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <section className="text-center space-y-10 mb-24">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(236,72,153,0.2)]">
            <Heart size={48} className="text-pink-500 animate-pulse" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">HAWKIN <span className="text-pink-500">{title}</span></h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto uppercase tracking-widest font-bold">
              {isEnglish ? "Empowering the future through technology" : "Impulsando el desarrollo a través de la tecnología"}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           <div className="space-y-12">
              <div className="p-10 glass-card bg-white/[0.02] border-white/5 rounded-[50px] space-y-8">
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter">Nuestra <span className="text-pink-500">Misión Social.</span></h2>
                 <p className="text-gray-400 text-lg leading-relaxed font-light italic">"Tu apoyo no es solo una cifra, es una herramienta. Donamos tecnología y capacitación a personas con talento que desean trabajar pero carecen de recursos."</p>
                 <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400"><Zap size={20} /></div>
                       <p className="text-sm text-gray-300"><b>Impulso de Trabajo:</b> Equipos y software para nuevos talentos.</p>
                    </div>
                 </div>
              </div>

              {/* PUBLICIDAD DE IMPACTO B2B */}
              <div className="pt-10">
                 <AdSpace isPremium={!!session} type="inline" />
              </div>
           </div>

           <div className="glass-card bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20 p-12 rounded-[60px] shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-widest text-center mb-10">Monto de la {title}</h3>
              
              <div className="space-y-8">
                 <div className="relative">
                    {/* Símbolo de Moneda Inteligente */}
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#FFD700]">
                      {isLoadingGeo ? <Loader2 className="animate-spin" size={20} /> : (geoData?.currencySymbol || '$')}
                    </span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setAmount(val);
                      }}
                      onBlur={() => {
                        // REGLA DE ORO: Monto mínimo de 20 al perder el foco
                        if (parseFloat(amount) < 20) {
                          setAmount("20.00");
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-[25px] py-6 pl-16 pr-6 text-3xl font-black outline-none focus:border-pink-500 transition-all text-white appearance-none"
                      style={{ MozAppearance: 'textfield' }} // Ocultar flechas en Firefox
                      placeholder="20.00"
                    />
                    <style jsx>{`
                      input::-webkit-outer-spin-button,
                      input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                    `}</style>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    {[20, 50, 100].map((val) => {
                      const rate = geoData?.rate || 1;
                      const localVal = (val * rate).toFixed(0);
                      return (
                        <button key={val} onClick={() => setAmount(localVal + ".00")}
                          className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${amount === localVal + ".00" ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}>
                          {isLoadingGeo ? '...' : `${geoData?.currencySymbol || '$'}${localVal}`}
                        </button>
                      );
                    })}
                 </div>

                 <div className="pt-10 border-t border-white/5 text-center">
                    {parseFloat(amount) < 20 && (
                      <p className="text-[10px] font-black text-red-500 uppercase mb-4 animate-pulse">
                         Monto mínimo permitido: {geoData?.currencySymbol || '$'}20.00
                      </p>
                    )}
                    <p className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest">
                       Moneda Detectada: {geoData?.currencyName || 'Cargando...'}
                    </p>
                    {isPaypalLoaded ? (
                      <PaypalDonationButtons value={parseFloat(amount) >= 20 ? amount : "20.00"} />
                    ) : (
                      <div className="w-full h-16 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[10px] text-gray-600 font-black uppercase">Sincronizando Pasarela...</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
      <Footer /><GlobalTicker />
    </main>
  );
}
