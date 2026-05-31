const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const ads = await prisma.adCampaign.findMany();
    console.log("Campaña publicitarias encontradas:", ads);
    
    const activeAds = await prisma.adCampaign.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      }
    });
    console.log("Campaña ACTIVAS encontradas:", activeAds);
  } catch (e) {
    console.error("Error al consultar pautas:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
