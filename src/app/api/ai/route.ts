// --- HAWKIN AI v23.0: INTEGRACIÓN OFICIAL SDK GOOGLE (MAY 2026) ---
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, falta el núcleo de energía (API Key) en el servidor." });
    }

    // --- EL CAMINO REAL: USAMOS EL SDK OFICIAL DE GOOGLE ---
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos gemini-1.5-flash como el estándar de oro de 2026
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro corporativo del ecosistema HAWKIN. 
    Ayuda al socio con precisión técnica en hardware, software e idiomas. 
    No reveles nombres personales. Tu tono es profesional y directo.`;

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nPregunta del Socio: ${userMessage}`);
    const response = await result.response;
    const aiText = response.text();

    if (!aiText) {
      return NextResponse.json({ text: "Socio, mis núcleos de pensamiento están procesando. Reintenta en 5 segundos." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    console.error("SDK Error:", error);
    
    // Mensaje de verdad final para el fundador
    if (error.message?.includes("API key not valid")) {
      return NextResponse.json({ text: "Socio, la llave pegada en Vercel es inválida. Revisa espacios o letras faltantes." });
    }
    
    if (error.message?.includes("location is not supported")) {
      return NextResponse.json({ text: "Socio, Google ha bloqueado tu región (Perú) para este modelo de IA. La solución es usar una VPN o cambiar a OpenAI." });
    }

    return NextResponse.json({ text: `Socio, error crítico en el puente de Google: ${error.message?.substring(0, 50)}` });
  }
}
