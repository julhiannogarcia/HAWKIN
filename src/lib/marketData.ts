export type LiveAsset = {
  symbol: string;
  name: string;
  price: string;
  trend: string;
  volatility: string;
  impact: string;
  confidence: number;
  src: string;
};

function fmtUsd(value: number, decimals = 2) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function fmtTrend(change: number) {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}`;
}

async function fetchCryptoPrices() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
    { next: { revalidate: 120 } }
  );
  if (!res.ok) return null;
  return res.json() as Promise<{
    bitcoin?: { usd: number; usd_24h_change?: number };
    ethereum?: { usd: number; usd_24h_change?: number };
  }>;
}

async function fetchYahooQuote(symbol: string) {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
    {
      headers: { 'User-Agent': 'Mozilla/5.0 HAWKIN/1.0' },
      next: { revalidate: 120 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) return null;
  const change = meta.regularMarketChangePercent ?? 0;
  return { price: meta.regularMarketPrice as number, change: change as number };
}

const FALLBACK_ASSETS: LiveAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$—', trend: '0.0', volatility: 'HIGH', impact: 'Referencia del apetito de riesgo tech', confidence: 90, src: 'CoinGecko' },
  { symbol: 'NDX', name: 'NASDAQ 100', price: '$—', trend: '0.0', volatility: 'MEDIUM', impact: 'Flujo institucional hacia Big Tech', confidence: 90, src: 'Yahoo Finance' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$—', trend: '0.0', volatility: 'HIGH', impact: 'Infraestructura IA global', confidence: 90, src: 'Yahoo Finance' },
  { symbol: 'GOLD', name: 'Oro (GLD)', price: '$—', trend: '0.0', volatility: 'LOW', impact: 'Cobertura macro en mercados volátiles', confidence: 88, src: 'Yahoo Finance' },
];

export async function getLiveMarketAssets(): Promise<LiveAsset[]> {
  const assets = structuredClone(FALLBACK_ASSETS);

  try {
    const [crypto, qqq, nvda, gld] = await Promise.all([
      fetchCryptoPrices(),
      fetchYahooQuote('QQQ'),
      fetchYahooQuote('NVDA'),
      fetchYahooQuote('GLD'),
    ]);

    if (crypto?.bitcoin) {
      assets[0] = {
        ...assets[0],
        price: fmtUsd(crypto.bitcoin.usd, 0),
        trend: fmtTrend(crypto.bitcoin.usd_24h_change ?? 0),
        src: 'CoinGecko',
        confidence: 99,
      };
    }

    if (crypto?.ethereum) {
      // Keep BTC slot; ETH could replace if needed — using QQQ for NDX
    }

    if (qqq) {
      assets[1] = {
        ...assets[1],
        price: fmtUsd(qqq.price),
        trend: fmtTrend(qqq.change),
        src: 'Yahoo Finance',
        confidence: 98,
      };
    }

    if (nvda) {
      assets[2] = {
        ...assets[2],
        price: fmtUsd(nvda.price),
        trend: fmtTrend(nvda.change),
        src: 'Yahoo Finance',
        confidence: 99,
      };
    }

    if (gld) {
      assets[3] = {
        ...assets[3],
        price: fmtUsd(gld.price),
        trend: fmtTrend(gld.change),
        src: 'Yahoo Finance',
        confidence: 97,
      };
    }
  } catch {
    return FALLBACK_ASSETS;
  }

  return assets;
}
