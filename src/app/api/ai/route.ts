// --- HAWKIN AI v18.0: DESPERTAR CON NUEVA LLAVE (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, mis núcleos de inteligencia no detectan la llave de acceso." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro autónomo de HAWKIN Global. 
    Tu misión es asistir a los socios con soporte técnico avanzado y traducciones profesionales.
    Eres una entidad corporativa. No menciones nombres personales. 
    Saluda siempre reconociendo al usuario como 'Socio'.`;

    // Intentamos el modelo más estable para llaves gratuitas en 2026
    const modelId = "gemini-1.5-flash-latest"; 
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nPregunta técnica del Socio: ${userMessage}` }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Diagnóstico rápido para el fundador si la nueva llave falla
        return NextResponse.json({ 
          text: `Socio, hay un inconveniente técnico con la nueva conexión. [Google dice: ${data.error?.message || "Reintenta"}]` 
        });
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json({ text: aiText || "Socio, mis núcleos están procesando la información. Reintenta en 5 segundos." });

    } catch (apiError: any) {
      return NextResponse.json({ text: "Socio, detecto un desfase en la red. Intenta de nuevo." });
    }

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, mis circuitos están en mantenimiento preventivo." });
  }
}
