import { GoogleGenerativeAI } from '@google/generative-ai';

const SUMMARY_PROMPT = `Eres editor de HAWKIN. Reglas estrictas:
- Resume SOLO hechos presentes en el texto dado. NO inventes empresas, cifras, fechas, leaks, predicciones ni porcentajes.
- Máximo 2-3 frases en español, tono profesional y neutro.
- NO cambies el titular. NO añadas contexto externo.
- Si el texto es insuficiente para resumir sin inventar, responde exactamente: {"insufficient":true}
- Si puedes resumir con seguridad, responde: {"summary":"tu resumen aquí"}`;

export type GeminiSummaryResult =
  | { summary: string; insufficient?: false }
  | { insufficient: true }
  | null;

export async function summarizeWithGemini(title: string, snippet: string): Promise<GeminiSummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !snippet.trim()) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `${SUMMARY_PROMPT}\n\nTitular:\n${title}\n\nTexto:\n${snippet}`.slice(0, 3000)
    );
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as { summary?: string; insufficient?: boolean };
    if (parsed.insufficient) return { insufficient: true };
    if (parsed.summary?.trim()) return { summary: parsed.summary.trim() };
    return null;
  } catch {
    return null;
  }
}

/** @deprecated Use summarizeWithGemini — no altera titular ni inventa scores */
export async function enrichWithGemini(title: string, snippet: string) {
  const result = await summarizeWithGemini(title, snippet);
  if (!result || 'insufficient' in result) return null;
  return { summary: result.summary };
}
