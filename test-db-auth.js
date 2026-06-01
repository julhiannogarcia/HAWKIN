const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- DB CONNECTION TEST ---');
  try {
    const userCount = await prisma.user.count();
    console.log('Connection successful.');
    console.log('User count:', userCount);
    
    // Check tables
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
    console.log('Tables found:', tables);
  } catch (e) {
    console.error('Connection failed:', e.message);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
