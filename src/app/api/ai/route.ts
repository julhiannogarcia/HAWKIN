// --- HAWKIN AI v29.0: RECONOCIMIENTO PERSONALIZADO (MAYO 2026) ---
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json(); // Recibimos el nombre del socio
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía gratuito." });
    }

    const groq = new Groq({ apiKey });

    // PERSONALIZACIÓN SEGÚN EL SOCIO
    const nameToUse = userName || "Socio";
    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro del ecosistema HAWKIN. 
    Tu misión es asistir de forma natural y creativa.
    REGLA DE CONFIANZA: Saluda y dirígete al usuario como '${nameToUse}'. Hazle sentir que lo conoces y que es parte del imperio.
    Si el nombre es 'Socio', mantén el tono habitual. Si tienes un nombre real o nick, úsalo para generar cercanía.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ text: aiText || `Hola ${nameToUse}, estoy procesando tu mensaje.` });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, dame un momento para sincronizarme." });
  }
}
