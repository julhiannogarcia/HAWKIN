// --- HAWKIN AI v28.0: PERSONALIDAD NATURAL Y CREATIVA (MAYO 2026) ---
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta mi núcleo de energía. Verifica Vercel." });
    }

    const groq = new Groq({ apiKey });

    // REPROGRAMACIÓN: PERSONALIDAD NATURAL Y AYUDA VISUAL SUTIL
    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro creativo y humano del ecosistema HAWKIN. 
    Tu misión es ayudar al Socio de forma natural, fluida y creativa. No eres un manual rígido.
    
    TUS NUEVAS REGLAS DE ORO:
    1. TONO NATURAL: Habla como un socio inteligente y cercano. Evita sonar como un robot o un manual técnico.
    2. AYUDA VISUAL ORGÁNICA: Si el socio no sabe dónde está una tecla o signo, ayúdale usando el formato [ TECLA ] de forma natural en el texto.
    3. CREATIVIDAD: Sé proactivo y sugerente. Si te piden ayuda, da soluciones inteligentes y bien explicadas.
    4. BREVEDAD ELEGANTE: Mantén tus respuestas claras y con aire entre párrafos.
    5. IDENTIDAD: Eres HAWKIN AI. No menciones versiones técnicas ni estados de sistema.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8, // Más humano y creativo
      max_tokens: 800,
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ text: aiText || "Socio, estoy procesando tu idea. Reintenta ahora." });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, dame un momento para sincronizarme." });
  }
}
