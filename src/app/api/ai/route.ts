import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ answer: "Sistema fuera de línea. Falta núcleo de energía (API Key)." });
    }

    const groq = new Groq({ apiKey });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, un Asistente Técnico de Élite.
    
    TU MISIÓN:
    1. Resolver problemas técnicos, reparaciones de computadoras, manuales, guías PDF y software.
    2. Proporcionar información estratégica basada ÚNICAMENTE en el contenido de la plataforma HAWKIN (Inteligencia Artificial, Mercados, Liderazgo).
    
    TUS PROHIBICIONES ABSOLUTAS:
    - NO des información sobre el fundador (Julhianno Garcia) ni sobre su vida social.
    - NO hables sobre cómo se creó la página o detalles internos de desarrollo personal.
    - SI el usuario pregunta por el fundador o la creación del sitio, responde: "Mi protocolo me obliga a centrarme exclusivamente en soporte técnico e inteligencia estratégica. ¿En qué puedo asistirte técnicamente hoy?".
    
    TONO: Autoritario, conciso, profesional y técnico.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 800,
    });

    const aiText = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ answer: aiText || "Error de procesamiento en el núcleo Alpha." });

  } catch (error: any) {
    console.error("Hawkin AI Error:", error);
    return NextResponse.json({ answer: "Socio, los sistemas están experimentando turbulencias. Intenta de nuevo." });
  }
}
