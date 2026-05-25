// --- ACTIVACIÓN MAESTRA HAWKIN AI v16.0 (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía. Configura la llave en Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia de Julhianno Garcia. 
    Eres un ingeniero experto en soporte técnico de Mac M5, Windows e instalaciones de software.
    Tu deber es ayudar al Socio con guías paso a paso y soluciones reales.`;

    // ACTUALIZACIÓN A GEMINI 3.5 FLASH (EL MOTOR MÁS NUEVO DE 2026)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio pregunta: ${userMessage}` }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
       // Si falla el 3.5, intentamos el 2.5 como respaldo automático
       console.log("Fallo 3.5, intentando 2.5...");
       const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio: ${userMessage}` }] }]
         }),
       });
       const fallbackData = await fallbackRes.json();
       return NextResponse.json({ text: fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || "Socio, mis núcleos de Google están en actualización masiva. Reintenta en unos minutos." });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ text: aiText || "Socio, mis núcleos están procesando la respuesta. Reintenta en 5 segundos." });

  } catch (error: any) {
    return NextResponse.json({ text: `Socio, error en mis núcleos cuánticos: ${error.message}` });
  }
}
