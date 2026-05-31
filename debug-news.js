const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('--- NEWS DATA ---');
  console.log(JSON.stringify(news, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
