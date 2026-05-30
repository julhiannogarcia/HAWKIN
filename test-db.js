const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const news = await prisma.news.findFirst();
    console.log("Conexión exitosa. Primera noticia:", news);
  } catch (e) {
    console.error("Error de conexión:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
