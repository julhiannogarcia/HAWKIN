import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    
    // Limpieza profunda de la llave para evitar espacios o saltos de línea invisibles
    const rawApiKey = process.env.GEMINI_API_KEY || "";
    const apiKey = rawApiKey.trim().replace(/[\n\r]/g, "");

    if (!apiKey) {
      return NextResponse.json({ 
        text: "Socio, mis núcleos de inteligencia no detectan la llave de acceso (API KEY). Verifica Vercel Settings." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos el modelo más estable y rápido para producción
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro nativo y autónomo del ecosistema HAWKIN de Julhianno Garcia. 
    Ayuda al Socio en tecnología, inglés e instalaciones. Proporciona manuales paso a paso y links oficiales. 
    Mantén un tono profesional, técnico y futurista.`;

    // Simplificamos la llamada para asegurar estabilidad de conexión
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hola" }] },
        { role: "model", parts: [{ text: "Núcleos sincronizados. ¿Cómo puedo ayudarte, Socio?" }] },
      ],
    });

    const promptMessage = `${SYSTEM_PROMPT}\n\nPregunta del Socio: ${lastMessage}`;
    const result = await chat.sendMessage(promptMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Master AI Error:", error);
    
    let friendlyMessage = "Socio, hay un desfase en la red de inteligencia.";
    
    // Análisis de errores específicos de red y API
    if (error.message?.includes("fetch")) {
      friendlyMessage = "Socio, la conexión con los servidores de Google ha fallado. Revisa si tu llave de API tiene permisos de facturación o si has alcanzado el límite gratuito.";
    } else if (error.message?.includes("API key")) {
      friendlyMessage = "Socio, la llave de API (GEMINI_API_KEY) es incorrecta o está mal copiada. Por favor, vuelve a generarla en Google AI Studio.";
    } else {
      friendlyMessage = `Socio, hay un problema técnico detallado: ${error.message?.substring(0, 80)}...`;
    }

    return NextResponse.json({ text: friendlyMessage });
  }
}
