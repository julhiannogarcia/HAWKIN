// --- DIAGNÓSTICO MAESTRO HAWKIN AI v14.0 ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, la llave de inteligencia no está configurada en Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro técnico de élite del ecosistema Julhianno Garcia. Soporte experto en Mac, Windows, Linux e IA.`;

    // CONEXIÓN CON DIAGNÓSTICO DE ERRORES
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio: ${userMessage}` }] }],
      }),
    });

    const data = await response.json();

    // Si la respuesta NO es exitosa, mostramos el error real de Google
    if (!response.ok) {
       console.error("Google API Error:", data);
       return NextResponse.json({ 
         text: `Socio, Google ha rechazado la conexión. [Error ${response.status}: ${data.error?.message || "Desconocido"}]. Por favor, verifica tu llave.` 
       });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
       return NextResponse.json({ text: "Socio, mis núcleos han recibido una respuesta vacía. Reintenta ahora." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: `Socio, hay un desfase técnico: ${error.message}` });
  }
}
