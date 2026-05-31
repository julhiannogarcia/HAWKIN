const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const newsCount = await prisma.news.count();
  const adCount = await prisma.adCampaign.count();
  
  console.log('--- DATABASE STATS ---');
  console.log('Users:', userCount);
  console.log('News:', newsCount);
  console.log('Ads:', adCount);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
