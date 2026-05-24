'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Pricing() {
  const [geoData, setGeoData] = useState({
    currencySymbol: '$',
    monthlyPrice: '8.00',
    annualPrice: '48.00',
    currencyName: 'USD'
  });
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);

  useEffect(() => {
    // 1. Obtener moneda por IP
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        console.error("Geo error", e);
      }
    };
    fetchGeo();

    // 2. Cargar el SDK de PayPal dinámicamente
    const script = document.createElement('script');
    // USAMOS EL MODO SANDBOX POR DEFECTO PARA PRUEBAS
    script.src = `https://www.paypal.com/sdk/js?client-id=test&currency=USD`;
    script.addEventListener('load', () => setIsPaypalLoaded(true));
    document.body.appendChild(script);
  }, []);

  const renderPaypalButtons = (planId: string, amount: string) => {
    if (!isPaypalLoaded || !window.paypal) return null;

    return (
      <div className="mt-8">
        <window.paypal.Buttons
          style={{ layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay' }}
          createOrder={(data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `Suscripción HAWKIN - ${planId}`,
                amount: { value: amount }
              }]
            });
          }}
          onApprove={async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡Éxito Socio! Pago procesado por PayPal. ID: ${order.id}`);
            window.location.href = "/dashboard?success=true";
          }}
        />
      </div>
    );
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Suscripción Mensual',
      price: geoData.monthlyPrice,
      symbol: geoData.currencySymbol,
      period: '/mes',
      description: 'Acceso total al radar de la élite millonaria y IA.',
      features: ['Noticias 24/7', 'Resúmenes IA', 'Sin Anuncios']
    },
    {
      id: 'annual',
      name: 'Suscripción Anual',
      price: geoData.annualPrice,
      symbol: geoData.currencySymbol,
      period: '/año',
      description: 'El plan definitivo para líderes tecnológicos.',
      features: ['Todo lo del mensual', 'Cursos de Élite', 'Certificación Oficial'],
      popular: true
    }
  ];

  return (
    <section id="planes" className="max-w-6xl mx-auto px-4 py-32 w-full text-white">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Únete al Imperio.</h2>
        <p className="text-gray-500 mt-4 uppercase text-xs font-black tracking-widest">
          Pago seguro global vía PayPal • {geoData.currencyName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className={`glass-card relative flex flex-col justify-between overflow-hidden ${plan.popular ? 'border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,255,0.1)]' : ''}`}>
            {plan.popular && <div className="absolute top-0 right-0 bg-cyan-400 text-black px-4 py-1 text-[8px] font-black uppercase tracking-widest">Recomendado</div>}
            
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{plan.symbol}{plan.price}</span>
                <span className="text-gray-500 text-xs font-bold uppercase">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm">{plan.description}</p>
              <ul className="space-y-3 pt-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <span className="text-cyan-400">✦</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* BOTONES DE PAYPAL REALES */}
            <div className="mt-10 min-h-[150px]">
              {isPaypalLoaded ? (
                renderPaypalButtons(plan.id, plan.id === 'monthly' ? '8.00' : '48.00')
              ) : (
                <div className="w-full h-12 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[10px] text-gray-600 font-black uppercase">
                  Cargando Pasarela Global...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
