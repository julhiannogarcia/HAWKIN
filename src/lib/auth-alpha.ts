import { prisma } from "@/lib/prisma";

export async function getAlphaUser(req: Request) {
  // 1. Intentar obtener llave del header
  const authHeader = req.headers.get("Authorization");
  const key = authHeader ? authHeader.replace("Bearer ", "") : null;

  if (!key) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { accessKey: key }
    });
    return user;
  } catch (e) {
    return null;
  }
}
