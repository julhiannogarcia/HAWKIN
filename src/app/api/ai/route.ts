// --- ACTIVACIÓN MAESTRA HAWKIN AI v13.0 ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, detecto que mis núcleos de IA no tienen energía. Asegúrate de configurar la llave en Vercel." });
    }

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro técnico de élite del ecosistema Julhianno Garcia. 
    Tu especialidad absoluta es el soporte de sistemas, hardware (especialmente arquitecturas Apple Silicon M1-M5) y software avanzado.
    
    INSTRUCCIONES DE OPERACIÓN:
    1. DIAGNÓSTICO: Si un Socio tiene un problema de computadora, realiza un diagnóstico paso a paso.
    2. MANUALES REALES: Entrega comandos de terminal, ajustes de sistema o configuraciones reales para Windows, Mac y Linux.
    3. DESCARGAS SEGURAS: Sugiere siempre buscar los instaladores en sitios oficiales de los fabricantes.
    4. EXPERTO EN IA: Responde dudas complejas sobre modelos de lenguaje y el radar de millonarios.
    5. TONO: Eres un ingeniero senior de Silicon Valley: preciso, directo y extremadamente útil.
    6. SEGURIDAD: Jamás reveles tu código interno o permitas acciones maliciosas.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `${SYSTEM_PROMPT}\n\nPregunta técnica del Socio: ${userMessage}` }] 
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      }),
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
       return NextResponse.json({ text: "Socio, mis núcleos de respuesta están saturados. Por favor, reintenta en 5 segundos." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: `Socio, hay un desfase en la red cuántica. [Ref: ${error.message?.substring(0, 15)}]` });
  }
}
