import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const countryCode = req.headers.get('x-vercel-ip-country') || 'US';
  
  // Mapeo de monedas, tasas y locales
  const currencies: Record<string, { symbol: string, rate: number, name: string, code: string, locale: string }> = {
    'PE': { symbol: 'S/', rate: 3.82, name: 'Soles', code: 'PEN', locale: 'es_PE' }, 
    'VE': { symbol: 'Bs', rate: 36.5, name: 'Bolívares', code: 'USD', locale: 'es_ES' },
    'MX': { symbol: '$', rate: 18.1, name: 'Pesos MXN', code: 'MXN', locale: 'es_MX' },
    'ES': { symbol: '€', rate: 0.92, name: 'Euros', code: 'EUR', locale: 'es_ES' },
    'US': { symbol: '$', rate: 1, name: 'USD', code: 'USD', locale: 'en_US' },
    'DEFAULT': { symbol: '$', rate: 1, name: 'USD', code: 'USD', locale: 'en_US' }
  };

  const data = currencies[countryCode] || currencies['DEFAULT'];
  
  return NextResponse.json({ 
    countryCode,
    currencySymbol: data.symbol,
    currencyCode: data.code,
    rate: data.rate,
    currencyName: data.name,
    locale: data.locale,
    monthlyPrice: (8 * data.rate).toFixed(2),
    annualPrice: (4 * data.rate).toFixed(2)
  });
}
