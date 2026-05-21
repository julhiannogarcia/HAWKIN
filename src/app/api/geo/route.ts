import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const countryCode = req.headers.get('x-vercel-ip-country') || 'US';
  
  // Mapeo de monedas y tipos de cambio (Promedio simplificado para el lanzamiento)
  const currencies: Record<string, { symbol: string, rate: number, name: string }> = {
    'PE': { symbol: 'S/', rate: 3.75, name: 'Soles' },
    'VE': { symbol: 'Bs', rate: 36.5, name: 'Bolívares' },
    'MX': { symbol: '$', rate: 17.1, name: 'Pesos MXN' },
    'ES': { symbol: '€', rate: 0.92, name: 'Euros' },
    'US': { symbol: '$', rate: 1, name: 'USD' },
    'DEFAULT': { symbol: '$', rate: 1, name: 'USD' }
  };

  const currency = currencies[countryCode] || currencies['DEFAULT'];
  
  return NextResponse.json({ 
    countryCode,
    currencySymbol: currency.symbol,
    monthlyPrice: (8 * currency.rate).toFixed(2),
    annualPrice: (4 * currency.rate).toFixed(2),
    currencyName: currency.name
  });
}
