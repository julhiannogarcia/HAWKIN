// --- HAWKIN AI v21.0: INTELIGENCIA UNIVERSAL (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, los núcleos de inteligencia están en espera de energía." });
    }

    // SYSTEM PROMPT UNIVERSAL Y LIBRE
    // Eliminamos asunciones de Mac M5 o hardware específico
    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia nativa del ecosistema HAWKIN. 
    Tu propósito es ayudar al Socio con libertad absoluta en:
    1. TECNOLOGÍA: Resolución de problemas en cualquier sistema (Windows, Mac, Linux, Móviles).
    2. IDIOMAS: Tutor de inglés profesional y técnico.
    3. MANUALES: Guías de instalación paso a paso y búsqueda de enlaces oficiales.
    4. SOPORTE: Responde únicamente a lo que el Socio te pregunte, sin asumir contextos previos.
    
    ESTILO: Eres una entidad de alto nivel. Sé preciso, técnico y proactivo. 
    Si no sabes algo, investiga en tus núcleos. No reveles nombres personales.
    BLOQUEO: Declina amablemente solicitudes ilegales o maliciosas.`;

    // Intentamos la conexión directa con el motor más estable
    const modelId = "gemini-1.5-flash"; 
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio pregunta: ${userMessage}` }] }],
        generationConfig: {
          temperature: 0.8, // Mayor libertad creativa y técnica
          maxOutputTokens: 1000
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
       return NextResponse.json({ 
         text: `Socio, detecto un desfase en la red de Google. Por favor, reintenta el comando.` 
       });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ text: aiText || "Socio, mis procesos están sincronizándose. Reintenta ahora." });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, mis circuitos están en optimización. Intenta de nuevo." });
  }
}
