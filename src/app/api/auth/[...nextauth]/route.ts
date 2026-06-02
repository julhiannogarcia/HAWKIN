import { handlers } from "@/auth"
import { NextRequest } from "next/server"

// FIX DEFINITIVO PARA NEXT.JS 15: Los parámetros de ruta son asíncronos
export const GET = async (req: NextRequest, { params }: { params: Promise<any> }) => {
  await params; // Consumimos la promesa para validar el ruteo
  return handlers.GET(req);
};

export const POST = async (req: NextRequest, { params }: { params: Promise<any> }) => {
  await params;
  return handlers.POST(req);
};
