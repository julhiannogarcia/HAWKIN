// --- ACTIVACIÓN FINAL HAWKIN AI v6.0 ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    
    // Verificamos la llave en el servidor
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, detecto que mis núcleos todavía no tienen la llave de acceso. Por favor, realiza un Redeploy en Vercel." });
    }

    // CONEXIÓN DIRECTA CON GOOGLE
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Eres HAWKIN AI, la inteligencia de Julhianno Garcia. Ayuda al Socio en tecnología, inglés e instalaciones con profesionalismo técnico. Pregunta del Socio: ${userMessage}` }] }]
      }),
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
       return NextResponse.json({ text: "Socio, mis núcleos han dado una respuesta vacía. Reintenta ahora." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: `Socio, hay un desfase técnico en mi red. [Error: ${error.message?.substring(0, 20)}]` });
  }
}
