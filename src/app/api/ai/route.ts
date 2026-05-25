// --- HAWKIN AI v22.0: ESCÁNER DE CONEXIÓN TOTAL (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía. Configura la llave en Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia de HAWKIN Global. Ayuda al Socio en tecnología e inglés.`;

    // LISTA DE COMBINACIONES PARA ENCONTRAR LA PUERTA ABIERTA DE GOOGLE
    const config = [
      { ver: 'v1', mod: 'gemini-2.0-flash' },
      { ver: 'v1beta', mod: 'gemini-2.0-flash' },
      { ver: 'v1', mod: 'gemini-1.5-flash-latest' },
      { ver: 'v1beta', mod: 'gemini-1.5-flash-latest' },
      { ver: 'v1', mod: 'gemini-pro' },
      { ver: 'v1beta', mod: 'gemini-pro' }
    ];
    
    let finalAiText = "";
    let lastTechnicalError = "";

    for (const attempt of config) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/${attempt.ver}/models/${attempt.mod}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio pregunta: ${userMessage}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
          }),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          finalAiText = data.candidates[0].content.parts[0].text;
          break; // ¡CONEXIÓN EXITOSA!
        } else {
          lastTechnicalError = data.error?.message || "Sin respuesta";
        }
      } catch (e) {
        continue;
      }
    }

    if (!finalAiText) {
      return NextResponse.json({ 
        text: `Socio, mis núcleos de Google están cerrados. [Motivo: ${lastTechnicalError}]. Por favor, verifica que tu llave de API tenga activado el modelo 'Gemini 1.5 Flash' en AI Studio.` 
      });
    }

    return NextResponse.json({ text: finalAiText });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, detecto un desfase en la red. Intenta de nuevo." });
  }
}
