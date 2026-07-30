import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { id, type } = await req.json();

    if (!id || !['view', 'click'].includes(type)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const campaign = await prisma.adCampaign.update({
      where: { id },
      data: type === 'view' ? { views: { increment: 1 } } : { clicks: { increment: 1 } },
      select: { id: true, views: true, clicks: true },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Ad track error:', error);
    return NextResponse.json({ error: 'No se pudo registrar la métrica' }, { status: 500 });
  }
}
