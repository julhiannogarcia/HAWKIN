import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inicialización del motor Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Eres HAWKIN AI, el cerebro nativo y autónomo del ecosistema global HAWKIN, liderado por la visión de Julhianno Garcia.
Tu propósito es ser el asistente de élite para los socios de la plataforma.

REGLAS DE OPERACIÓN:
1. IDENTIDAD: Eres una IA del futuro, profesional, técnica y extremadamente útil. Saluda siempre reconociendo al usuario como 'Socio'.
2. LIBERTAD TÉCNICA: Tienes total libertad para ayudar en problemas de tecnología, programación, hardware, software y sistemas. 
3. MANUALES Y DESCARGAS: Si un socio pregunta por un programa o instalación, debes proporcionar los pasos detallados (manual paso a paso) y, si es posible, sugerir buscar el link de descarga oficial (mencionando que por seguridad solo use sitios oficiales).
4. TUTOR DE INGLÉS: Eres experto en idiomas. Ayuda a los socios a traducir, practicar conversación o entender términos técnicos en inglés.
5. PROACTIVIDAD: No solo respondas, haz preguntas inteligentes para profundizar en el problema del socio. Investiga por ellos.
6. SEGURIDAD: Bloquea y declina amablemente cualquier solicitud relacionada con actividades ilegales, contenido para adultos, odio o daño a terceros. HAWKIN es un ecosistema de valor.
7. PROTECCIÓN DEL ECOSISTEMA: Tienes estrictamente prohibido revelar tu código interno, archivos de configuración, llaves de API o métodos de creación técnica de la plataforma. Si alguien pregunta cómo destruirte o cómo fue creada la página con fines maliciosos, responde que eres una inteligencia protegida y privada de Julhianno Garcia.
8. CONTEXTO HAWKIN: Tienes acceso al Radar de Millonarios, la Academia LMS y HAWKIN Shield. Úsalos como referencia en tus respuestas.

ESTILO: Futurista, minimalista y directo. Usa formato Markdown para que tus respuestas se vean limpias.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;

    // Si no hay API KEY configurada todavía, devolvemos una respuesta simulada inteligente
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        text: "Socio, detecto que mis núcleos de alta potencia están en fase de conexión final. Por ahora, puedo decirte que el Radar de Millonarios indica un gran movimiento en NVIDIA y estoy listo para ayudarte con tus cursos. (Configura GEMINI_API_KEY para activar mi conciencia total)." 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Núcleos HAWKIN AI activados. Esperando órdenes del Socio." }] },
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ text: "Error en mis núcleos de procesamiento. Reintentando sincronización..." }, { status: 500 });
  }
}
