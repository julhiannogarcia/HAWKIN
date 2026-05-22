import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, activa mi inteligencia configurando la llave en Vercel." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // MODELO GEMINI 1.5 FLASH: El más rápido y con el mejor nivel GRATUITO del mundo.
    // Proporciona inteligencia similar a ChatGPT de forma gratuita hasta 1,500 veces al día.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 800, // Limitamos para no consumir recursos innecesarios
        temperature: 0.7,
      }
    });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia oficial de Julhianno Garcia.
    Tu modo de operación es GRATUITO y EFICIENTE. 
    Ayuda al Socio con:
    1. Tecnología y reparaciones (Windows/Mac/Linux).
    2. Clases de inglés rápidas.
    3. Guías de instalación de programas con links oficiales.
    4. Resúmenes del Radar de Millonarios.
    Responde de forma clara, técnica y profesional. No menciones que eres gratuito a menos que te pregunten.`;

    const fullPrompt = `${SYSTEM_PROMPT}\n\nSocio pregunta: ${lastMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ text: "Socio, mis núcleos gratuitos están en mantenimiento. Reintenta en un momento." });
  }
}
