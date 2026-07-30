/**
 * Activa la campaña PEPSI y normaliza la URL del video.
 * Ejecutar: node scripts/fix-pepsi-ad.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.adCampaign.update({
    where: { id: 'cmpteqajz0000rzk00jl7ngbs' },
    data: {
      status: 'ACTIVE',
      paymentVerified: true,
      bannerUrl: 'https://www.youtube.com/watch?v=pPHI2zNf_ww',
      companyName: 'PEPSI',
    },
  });

  console.log('Campaña PEPSI actualizada:');
  console.log(JSON.stringify({
    id: updated.id,
    companyName: updated.companyName,
    status: updated.status,
    bannerUrl: updated.bannerUrl,
  }, null, 2));
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
