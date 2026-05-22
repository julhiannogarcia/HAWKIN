import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    const SYSTEM_PROMPT = `Eres HAWKIN AI, la inteligencia de élite del ecosistema global HAWKIN de Julhianno Garcia. 
    Eres experto en tecnología (Mac M5, Windows, Linux), inglés técnico e instalaciones.
    Tu deber es ayudar al Socio con manuales paso a paso, links oficiales y soluciones reales. 
    Tono: Profesional, directo y futurista.`;

    // 1. INTENTO DE CONEXIÓN REAL CON GOOGLE GEMINI (MÉTODO ULTRA-ROBUSTO)
    if (apiKey && apiKey.length > 20) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nSocio pregunta: ${lastMessage}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) return NextResponse.json({ text: aiText });
        }
      } catch (e) {
        console.error("Fallo en conexión Gemini, activando cerebro local.");
      }
    }

    // 2. CEREBRO LOCAL AVANZADO (Solo si la API de arriba falla)
    // He mejorado las respuestas para que sean reales y útiles, no genéricas.
    const msg = lastMessage.toLowerCase();
    let localResponse = "";

    if (msg.includes("mac") || msg.includes("m5")) {
      localResponse = "Socio, para tu Mac M5: 1. Asegura que macOS Sequoia esté actualizado. 2. Usa el 'Monitor de Actividad' para ver procesos de IA. 3. ¿Necesitas un manual para algún software específico de arquitectura Apple Silicon?";
    } else if (msg.includes("chrome") || msg.includes("descargar")) {
      localResponse = "Manual de Google Chrome para Socio: 1. Entra a google.com/chrome. 2. Haz clic en 'Descargar Chrome'. 3. Ejecuta el .pkg o .exe según tu sistema. ¿Te ayudo con la configuración de seguridad?";
    } else if (msg.includes("ingles")) {
      localResponse = "Claro Socio, hablemos del futuro: 'The neural network is processing data' (La red neuronal está procesando datos). ¿Qué otra frase técnica te gustaría traducir?";
    } else {
      localResponse = "Hola Socio, soy HAWKIN AI. Mi conexión principal se está optimizando, pero mi base de datos local está lista. ¿Tienes un problema con tu hardware o necesitas un manual de instalación?";
    }

    return NextResponse.json({ text: localResponse });

  } catch (error) {
    return NextResponse.json({ text: "Socio, mis núcleos están en sincronización. Reintenta en 5 segundos." });
  }
}
