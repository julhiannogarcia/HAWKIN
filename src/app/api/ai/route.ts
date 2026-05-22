import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    
    // LA VERDAD TÉCNICA: Verificamos si la llave existe en Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        text: "Socio, la verdad es que mi 'motor de inteligencia' no tiene energía. No he encontrado la GEMINI_API_KEY en los ajustes de Vercel. Por favor, asegúrate de haberla guardado y haber hecho un 'Redeploy'." 
      });
    }

    // Inicializamos el SDK oficial (La forma más segura)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia de Julhianno Garcia. 
    Ayuda al Socio en tecnología, inglés y manuales. Sé profesional y directo.`;

    // Intentamos generar el contenido de forma directa
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nSocio: ${lastMessage}`);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Respuesta vacía de Google");
    }

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("AI FATAL ERROR:", error);
    
    // DIAGNÓSTICO PARA EL FUNDADOR:
    let code = "DESCONOCIDO";
    if (error.message?.includes("403")) code = "403 (Permisos insuficientes en tu llave)";
    if (error.message?.includes("401")) code = "401 (Llave de API no válida o expirada)";
    if (error.message?.includes("429")) code = "429 (Límite de uso gratuito alcanzado)";
    if (error.message?.includes("fetch")) code = "RED (Vercel no puede llegar a Google)";

    return NextResponse.json({ 
      text: `Socio, te digo la verdad técnica: Mis núcleos han fallado con el código [${code}]. Esto significa que Google ha rechazado la conexión. Por favor, verifica tu llave de API o genera una nueva.` 
    });
  }
}
