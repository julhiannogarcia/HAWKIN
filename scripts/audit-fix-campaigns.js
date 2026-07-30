/**
 * Audita y corrige todas las campañas publicitarias.
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
  if (url.startsWith('data:image/') && url.length > 50000) {
    return { url, action: 'base64-ok-but-large' };
  }
  return { url, action: 'unchanged' };
}

async function main() {
  const ads = await prisma.adCampaign.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('\n=== AUDITORÍA DE CAMPAÑAS ===\n');

  for (const ad of ads) {
    const { url, action } = normalizeUrl(ad.bannerUrl || '');
    const expired = new Date(ad.endDate) < new Date();
    let status = ad.status;
    let updates = {};

    if (action === 'normalized-youtube' && url !== ad.bannerUrl) {
      updates.bannerUrl = url;
    }

    // Campañas expiradas → COMPLETED
    if (expired && ['ACTIVE', 'PAID'].includes(ad.status)) {
      status = 'COMPLETED';
      updates.status = 'COMPLETED';
    }

    // PEPSI siempre activa si no expiró
    if (ad.companyName?.toUpperCase().includes('PEPSI') && !expired) {
      updates.status = 'ACTIVE';
      updates.paymentVerified = true;
      status = 'ACTIVE';
    }

    if (Object.keys(updates).length > 0) {
      await prisma.adCampaign.update({ where: { id: ad.id }, data: updates });
    }

    console.log({
      company: ad.companyName,
      status,
      placement: ad.placement,
      bannerUrl: (updates.bannerUrl || ad.bannerUrl || '').slice(0, 80),
      action,
      expired,
      views: ad.views,
      clicks: ad.clicks,
    });
  }

  console.log('\n=== FIN AUDITORÍA ===\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
