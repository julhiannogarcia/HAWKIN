// --- HAWKIN AI v17.0: PRIVACIDAD Y ESCALABILIDAD (MAYO 2026) ---
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Socio, el núcleo de inteligencia está en modo de espera." });
    }

    // SYSTEM PROMPT ANONIMIZADO Y PROFESIONAL
    // Eliminamos nombres personales para proteger la privacidad del fundador
    const SYSTEM_PROMPT = `Eres HAWKIN AI, el sistema de inteligencia oficial de la Red HAWKIN. 
    Tu misión es asistir a los socios con soporte técnico de alto nivel (Hardware, Software, Sistemas) y traducciones.
    Eres una entidad corporativa. No menciones nombres propios de personas físicas.
    Si te preguntan quién te creó, responde: 'Fui desarrollado por el equipo de ingeniería de HAWKIN Global'.`;

    // LISTA DE MODELOS A PROBAR (PARA EVITAR EL ERROR 404)
    // Probamos el más nuevo, si no, bajamos a los ultra-estables
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    
    let aiText = "";
    let success = false;

    for (const modelId of modelsToTry) {
      if (success) break;
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio: ${userMessage}` }] }],
            generationConfig: {
              temperature: 0.5, // Menos "locura", más precisión
              maxOutputTokens: 500 // Limitamos tokens para que sea 100% GRATIS siempre
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            success = true;
          }
        }
      } catch (e) {
        continue; // Si un modelo da 404, probamos el siguiente de la lista
      }
    }

    if (!success) {
      return NextResponse.json({ text: "Socio, mis núcleos están en sincronización masiva. Por favor, reintenta en un momento." });
    }

    return NextResponse.json({ text: aiText });

  } catch (error: any) {
    return NextResponse.json({ text: "Socio, detecto un desfase en la red. Intenta de nuevo por favor." });
  }
}
