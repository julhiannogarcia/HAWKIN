// --- HAWKIN AI v20.0: SINCRONIZACIÓN v1 ESTABLE (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía. Verifica Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro técnico de HAWKIN Global. 
    Ayuda al socio en tecnología e inglés. Tono profesional y directo.`;

    // LISTA DE CANDIDATOS PARA MAYO 2026 EN ENDPOINT v1
    const candidates = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    
    let finalResponse = "";
    let lastError = "";

    for (const model of candidates) {
      try {
        // CAMBIO MAESTRO: Usamos el endpoint /v1/ en lugar de /v1beta/
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio: ${userMessage}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
          }),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          finalResponse = data.candidates[0].content.parts[0].text;
          break; 
        } else {
          lastError = data.error?.message || "Fallo de handshake";
        }
      } catch (e) {
        continue;
      }
    }

    if (!finalResponse) {
      return NextResponse.json({ 
        text: `Socio, Google ha rechazado la sincronización en v1. [Motivo: ${lastError}]. Por favor, verifica que en Google AI Studio la llave esté configurada para el modelo 'gemini-1.5-flash'.` 
      });
    }

    return NextResponse.json({ text: finalResponse });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, desfase en la red cuántica. Intenta de nuevo." });
  }
}
