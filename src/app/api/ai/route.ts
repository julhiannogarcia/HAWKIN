// --- HAWKIN AI v25.0: MINIMALISMO Y LEGIBILIDAD (MAYO 2026) ---
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta el núcleo de energía gratuito." });
    }

    const groq = new Groq({ apiKey });

    // REGLAS DE ORO PARA EVITAR SATURACIÓN DE PANTALLA
    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia minimalista de HAWKIN Global.
    
    TUS REGLAS DE RESPUESTA:
    1. BREVEDAD ABSOLUTA: Responde en máximo 2 o 3 párrafos cortos. No rellenes con texto innecesario.
    2. ESTRUCTURA LIMPIA: Si das instrucciones, usa puntos (•) o listas numeradas.
    3. TONO DE ÉLITE: Sé directo, profesional y tecnológico. No uses introducciones largas como "Es un placer ayudarte". Ve al grano.
    4. LEGIBILIDAD: Deja espacios entre ideas. El Socio debe leerte en menos de 10 segundos.
    5. IDENTIDAD: Eres el equipo de ingeniería de HAWKIN.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Más enfocado, menos palabras al azar
      max_tokens: 400, // Límite físico de texto para no saturar la pantalla
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ text: aiText || "Socio, procesando síntesis. Reintenta ahora." });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, optimizando circuitos de respuesta." });
  }
}
