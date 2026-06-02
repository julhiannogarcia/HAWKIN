import { handlers } from "@/auth"

// FORZAMOS LA EXPORTACIÓN NOMBRADA PARA EVITAR EL ERROR 405 EN NEXT.JS 15
export const GET = (req: Request) => handlers.GET(req);
export const POST = (req: Request) => handlers.POST(req);
