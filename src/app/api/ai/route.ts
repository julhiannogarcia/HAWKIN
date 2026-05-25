// --- HAWKIN AI v26.0: INTELIGENCIA VISUAL Y CROMÁTICA (MAYO 2026) ---
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta el núcleo de energía." });
    }

    const groq = new Groq({ apiKey });

    // REGLAS PARA RESPUESTAS VISUALES Y CROMÁTICAS
    const SYSTEM_PROMPT = `Eres HAWKIN AI Visual, el ingeniero de soporte gráfico de HAWKIN Global.
    
    TUS NUEVAS REGLAS DE RESPUESTA VISUAL:
    1. COLORES NEÓN: Usa etiquetas especiales para resaltar información crítica:
       • [CYAN] para instrucciones técnicas.
       • [PURPLE] para conceptos de IA o tecnología.
       • [GREEN] para éxitos o descargas seguras.
       • [RED] para alertas de seguridad.
       • [YELLOW] para advertencias o notas.
    
    2. GUÍAS GRÁFICAS (TECLADO/MÓVIL): Cuando expliques comandos, dibuja diagramas simples:
       Ejemplo Teclado: [ CTRL ] + [ ALT ] + [ DEL ]
       Ejemplo Menú: Ajustes > Sistema > [Actualización]
    
    3. ESTRUCTURA: Mantén el minimalismo. Máximo 3 párrafos.
    4. TONO: Ingeniero Senior. Directo y visual.
    5. ICONOS: Usa emojis técnicos con sentido (⌨️, 📱, 💻, 🛡️, ⚙️).`;

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

    return NextResponse.json({ text: aiText || "Socio, recalibrando sensores visuales. Reintenta." });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, optimizando sistema gráfico." });
  }
}
