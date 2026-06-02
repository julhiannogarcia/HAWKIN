const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ads = await prisma.adCampaign.findMany();
  console.log('--- ALL ADS ---');
  console.log(JSON.stringify(ads, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
