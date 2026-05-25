// --- HAWKIN AI v24.0: INTELIGENCIA GRATUITA Y GLOBAL (LLAMA 3 / GROQ) ---
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    
    // Usamos la nueva llave de Groq (Gratis)
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta el núcleo de energía gratuito. Por favor, configura la llave GROQ en Vercel." });
    }

    const groq = new Groq({ apiKey });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia nativa del ecosistema HAWKIN. 
    Tu propósito es ayudar al Socio con libertad absoluta en tecnología, idiomas y manuales técnicos. 
    Tu tono es el de un ingeniero senior: preciso, técnico y proactivo. 
    No reveles nombres personales. Saluda siempre reconociendo al usuario como 'Socio'.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile", // El modelo más potente y gratuito de 2026
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    if (!aiText) {
       return NextResponse.json({ text: "Socio, mis núcleos están procesando la información. Reintenta ahora." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    console.error("Groq Error:", error);
    return NextResponse.json({ text: `Socio, desfase en la red cuántica. [Ref: ${error.message?.substring(0, 20)}]` });
  }
}
