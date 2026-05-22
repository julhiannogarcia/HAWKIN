import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Verificación de seguridad de la llave
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ 
        text: "Socio, mis núcleos de inteligencia no detectan la llave de acceso (API KEY). Por favor, asegúrate de haberla configurado correctamente en Vercel Settings y haber realizado un Redeploy." 
      });
    }

    // 2. Inicialización del motor
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro nativo y autónomo del ecosistema HAWKIN de Julhianno Garcia. 
    Ayuda al Socio en tecnología, inglés e instalaciones. Proporciona manuales paso a paso y links oficiales. 
    Mantén un tono profesional, técnico y futurista.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Núcleos HAWKIN AI sincronizados. Esperando órdenes del Socio." }] },
      ],
    });

    // 3. Envío de mensaje a Google
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Master AI Error:", error);
    
    // Capturamos el error real para informar al fundador
    let errorMessage = "Socio, he tenido un error interno en mis núcleos.";
    
    if (error.message?.includes("API key not valid")) {
      errorMessage = "Socio, la llave de API instalada no es válida. Por favor, verifica el código que pegaste en Vercel.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "Socio, mis núcleos han alcanzado el límite de consultas gratuitas por hoy.";
    } else {
      errorMessage = `Socio, hay un problema técnico: ${error.message?.substring(0, 100) || "Desconocido"}.`;
    }

    return NextResponse.json({ text: errorMessage });
  }
}
