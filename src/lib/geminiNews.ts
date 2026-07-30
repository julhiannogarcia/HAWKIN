import { GoogleGenerativeAI } from '@google/generative-ai';

const SUMMARY_PROMPT = `Eres analista de inteligencia tech global de AI HAWKIN.
Resume la noticia en español, máximo 2 frases, tono profesional.
Responde SOLO JSON: {"title":"titulo corto","summary":"resumen","category":"ETIQUETA","importance":8.5}`;

export async function enrichWithGemini(title: string, snippet: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `${SUMMARY_PROMPT}\n\nNoticia:\n${title}\n${snippet}`.slice(0, 3000)
    );
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as {
      title?: string;
      summary?: string;
      category?: string;
      importance?: number;
    };
  } catch {
    return null;
  }
}
