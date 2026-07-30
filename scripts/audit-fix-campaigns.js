/**
 * Audita y corrige campañas: URLs, fechas y status ACTIVE.
 * Ejecutar: node scripts/audit-fix-campaigns.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeUrl(url) {
  if (!url) return { url: '', action: 'empty' };
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    if (id) return { url: `https://www.youtube.com/watch?v=${id}`, action: 'normalized-youtube' };
  }
  return { url, action: 'unchanged' };
}

async function main() {
  const now = new Date();
  const ads = await prisma.adCampaign.findMany({ orderBy: { createdAt: 'desc' } });

  console.log('\n=== AUDITORÍA AdCampaign ===\n');
  console.log('Fecha hoy:', now.toISOString().split('T')[0], '\n');

  for (const ad of ads) {
    const { url, action } = normalizeUrl(ad.bannerUrl || '');
    const expired = new Date(ad.endDate) < now;
    const notStarted = new Date(ad.startDate) > now;
    const updates = {};

    if (action === 'normalized-youtube' && url !== ad.bannerUrl) {
      updates.bannerUrl = url;
    }

    if (expired && ['ACTIVE', 'PAID', 'PENDING'].includes(ad.status)) {
      updates.status = 'COMPLETED';
    } else if (!expired && !notStarted && ad.status === 'PENDING' && ad.companyName?.toUpperCase().includes('PEPSI')) {
      updates.status = 'ACTIVE';
      updates.paymentVerified = true;
    } else if (!expired && !notStarted && ad.status === 'PAID') {
      // PAID stays until admin approves — do not auto-activate
    }

    // Fix dates if end before start
    if (new Date(ad.endDate) < new Date(ad.startDate)) {
      const newEnd = new Date(ad.startDate);
      newEnd.setMonth(newEnd.getMonth() + 1);
      updates.endDate = newEnd;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.adCampaign.update({ where: { id: ad.id }, data: updates });
    }

    const final = { ...ad, ...updates };
    console.log({
      company: final.companyName,
      status: final.status,
      placement: final.placement,
      bannerUrl: (final.bannerUrl || '').slice(0, 70),
      start: new Date(final.startDate).toISOString().split('T')[0],
      end: new Date(final.endDate).toISOString().split('T')[0],
      validDates: !notStarted && !expired,
      action: Object.keys(updates).length ? updates : 'ok',
      views: ad.views,
      clicks: ad.clicks,
    });
  }

  console.log('\n=== ZONAS DISPONIBLES ===');
  console.log('TOP_BANNER  → /, /radar, /markets, /rumors');
  console.log('NEWS_FEED   → /, /radar, /news, /b2b');
  console.log('SIDEBAR     → /news, /shield, /intelligence');
  console.log('\n=== FIN ===\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
