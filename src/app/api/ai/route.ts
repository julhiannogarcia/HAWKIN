import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, no detecto mi llave de inteligencia. Verifica Vercel Settings." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Cambiamos a un método más directo y robusto (generateContent)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = `Eres HAWKIN AI, el cerebro nativo de Julhianno Garcia. 
    Ayuda al Socio en tecnología, inglés e instalaciones con profesionalismo.`;

    const fullPrompt = `${SYSTEM_PROMPT}\n\nPregunta del Socio: ${lastMessage}`;

    // Llamada directa sin historial para evitar errores de transporte
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Master AI Error:", error);
    
    // DIAGNÓSTICO PROFUNDO: Si falla, le pedimos a la IA que nos diga el código de error real
    const rawError = error.toString();
    let diagnostic = "Error de conexión con Google.";

    if (rawError.includes("403")) diagnostic = "ERROR 403: La llave de API no tiene permisos o Google ha bloqueado la petición.";
    if (rawError.includes("400")) diagnostic = "ERROR 400: La petición es inválida o la llave está mal formateada.";
    if (rawError.includes("429")) diagnostic = "ERROR 429: Se ha agotado el límite gratuito de la llave por hoy.";
    if (rawError.includes("API_KEY_INVALID")) diagnostic = "ERROR: La llave de API es inválida. Socio, por favor genera una nueva.";

    return NextResponse.json({ 
      text: `Socio, mis circuitos detectan un inconveniente técnico: ${diagnostic} (Detalle: ${rawError.substring(0, 50)}...)` 
    });
  }
}
