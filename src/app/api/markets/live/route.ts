import { NextResponse } from 'next/server';
import { getLiveMarketAssets } from '@/lib/marketData';

export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function GET() {
  const assets = await getLiveMarketAssets();
  return NextResponse.json({
    assets,
    refreshedAt: new Date().toISOString(),
    source: 'CoinGecko + Yahoo Finance',
  });
}
