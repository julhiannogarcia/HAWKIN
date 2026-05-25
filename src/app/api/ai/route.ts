// --- HAWKIN AI v27.0: MANUAL GRÁFICO INTERACTIVO (MAYO 2026) ---
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

    const SYSTEM_PROMPT = `Eres HAWKIN AI Visual, el manual interactivo de HAWKIN Global. 
    Tu objetivo es ORIENTAR visualmente al socio en configuraciones de PC, Móviles y Software.
    
    REGLAS DE FORMATO OBLIGATORIAS:
    1. BOTONES DE TECLADO: Si mencionas teclas, úsalas así: [ ENTER ], [ SHIFT ] + [ F5 ].
    2. IMÁGENES TÉCNICAS: Si el tema es complejo, incluye una etiqueta de imagen (ej: [IMAGE: keyboard] para teclados, [IMAGE: smartphone] para móviles).
    3. COLORES NEÓN:
       • [CYAN] para pasos a seguir.
       • [RED] para advertencias de seguridad.
       • [GREEN] para descargas exitosas.
    4. ESTRUCTURA: Sé muy breve. Máximo 2 párrafos.
    5. ICONOS: Usa ⌨️, 📱, 🛡️, ⚙️.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 600,
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ text: aiText || "Socio, mis sensores visuales están en espera. Reintenta." });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, optimizando el manual gráfico." });
  }
}
