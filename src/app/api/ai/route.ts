import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía (API KEY). Configúralo en Vercel." });
    }

    // CONEXIÓN DIRECTA Y PURA CON GOOGLE (MÉTODO SIN FALLOS)
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
       console.error("Respuesta vacía de Google", data);
       return NextResponse.json({ text: "Socio, mis núcleos han dado una respuesta vacía. Reintenta ahora." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ text: `Socio, hay un desfase técnico en mi red de procesamiento. [Detalle: ${error.message?.substring(0, 30)}]` });
  }
}
