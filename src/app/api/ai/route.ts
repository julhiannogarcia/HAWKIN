// --- ACTIVACIÓN DEFINITIVA HAWKIN AI v15.0 ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía. Configura la llave en Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia de Julhianno Garcia. Soporte experto en Mac M5, Windows, Linux y descarga de programas.`;

    // CAMBIO TÉCNICO: Usamos la versión 'v1' estable (Adiós al error 404)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio pregunta: ${userMessage}` }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
       return NextResponse.json({ 
         text: `Socio, error en los núcleos de Google. [${response.status}: ${data.error?.message || "Reintenta"}]` 
       });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
       return NextResponse.json({ text: "Socio, mis núcleos han dado una respuesta vacía. Reintenta ahora." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: `Socio, desfase técnico: ${error.message}` });
  }
}
