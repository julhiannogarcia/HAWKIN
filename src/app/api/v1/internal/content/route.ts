import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement');

  try {
    const ads = await prisma.adCampaign.findMany({
      where: {
        status: { in: ['ACTIVE', 'PAID'] },
        placement: placement || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (ads.length > 0) {
      return NextResponse.json(ads);
    }

    return NextResponse.json([
      {
        id: 'hawkin-academy-default',
        companyName: 'HAWKIN ACADEMY',
        bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000',
        targetUrl: '/academy',
        placement: placement || 'TOP_BANNER',
      },
    ]);
  } catch (error) {
    console.error('Ad content API error:', error);
    return NextResponse.json([
      {
        id: 'err-system-fallback',
        companyName: 'HAWKIN ACADEMY',
        bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000',
        targetUrl: '/academy',
        placement: 'TOP_BANNER',
      },
    ]);
  }
}
