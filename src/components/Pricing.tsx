'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Pricing() {
  const [geoData, setGeoData] = useState({
    currencySymbol: '$',
    monthlyPrice: '8.00',
    annualPrice: '4.00',
    currencyName: 'USD'
  });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        console.error("Error fetching geo pricing", e);
      }
    };
    fetchGeo();
  }, []);

  const handleCheckout = async (plan: 'monthly' | 'annual') => {
    setLoading(plan);
    try {
      console.log("Solicitando pago para el plan:", plan);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        console.log("Redirigiendo a Stripe...");
        window.location.href = data.url;
      } else {
        throw new Error(data.error || data.details || "No se recibió URL de pago");
      }
    } catch (e: any) {
      console.error("Error detallado de Stripe:", e);
      alert(`Error financiero: ${e.message}. Verifica que tus llaves de Stripe en Vercel sean correctas.`);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Suscripción Mensual',
      price: `${geoData.currencySymbol}${geoData.monthlyPrice}`,
      period: '/mes',
      description: 'Acceso total al radar global de IA y noticias Big Tech.',
      features: [
        'Noticias Big Tech en tiempo real',
        'Resúmenes IA (Audio/Texto)',
        'Efemérides Nacionales Animadas',
        'Zona del Fundador Julhianno'
      ],
      popular: false
    },
    {
      id: 'annual',
      name: 'Suscripción Anual',
      price: `${geoData.currencySymbol}${geoData.annualPrice}`,
      period: '/mes promed.',
      description: 'El mejor valor para los líderes del futuro digital.',
      features: [
        'Todo lo del Plan Mensual',
        'Acceso a Todos los Cursos de IA',
        'Certificaciones HAWKIN',
        'Soporte Prioritario 24/7'
      ],
      info: `Facturado en ${geoData.currencyName}`,
      popular: true
    }
  ];

  return (
    <section id="planes" className="max-w-6xl mx-auto px-4 py-32 w-full text-white">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Únete a la Élite.</h2>
        <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-black">
          Precios ajustados automáticamente a tu moneda local ({geoData.currencyName})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className={`glass-card flex flex-col justify-between relative overflow-hidden ${plan.popular ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(0,242,255,0.1)]' : 'border-white/5'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-bl-xl">
                Ahorra 50%
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm font-bold uppercase">{plan.period}</span>
              </div>
              {plan.info && <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{plan.info}</p>}
              <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
              
              <ul className="space-y-4 pt-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                    <span className="text-cyan-400 text-lg">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleCheckout(plan.id as any)}
              disabled={loading !== null}
              className={`mt-10 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${plan.popular ? 'bg-cyan-500 text-black hover:bg-white' : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'} disabled:opacity-50 cursor-pointer`}
            >
              {loading === plan.id ? 'Sincronizando Pago...' : `Elegir ${plan.name.split(' ')[1]}`}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
