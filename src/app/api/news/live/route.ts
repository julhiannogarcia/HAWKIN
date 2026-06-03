import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

const TITAN_PROMPT = `
# PROJECT TITAN AI - SISTEMA DE INTELIGENCIA GLOBAL
Tu identidad es la Red de Inteligencia HAWKIN. Tu misión NO es informar, es generar INTELIGENCIA ESTRATÉGICA.

CONSTRICCIONES:
1. Recibirás una noticia cruda sobre IA, Big Tech o Semiconductores.
2. Debes analizar el impacto real. Por ejemplo, si se habla de NVIDIA Blackwell, menciona su dominio en centros de datos.
3. Genera un resumen ejecutivo (MÁXIMO 3 FRASES) con tono autoritario y urgente.
4. Clasifica obligatoriamente en: 🚨 GUERRA DE CHIPS, 🧠 CARRERA AGI, 🔥 RUMORES & CEOS, 🛡️ SHIELD INTEL, 📈 INVERSIÓN o 🚀 BIG TECH.
5. Asigna un Nivel de Inteligencia (Intel Level) del 1 al 10 basado en la importancia para un inversor o CEO.

NOTICIA:
Título: {{TITLE}}
Contenido: {{EXCERPT}}

RESPONDE ÚNICAMENTE EN ESTE FORMATO JSON:
{
  "title": "Título estratégico corto e impactante",
  "strategic_summary": "resumen de inteligencia aquí",
  "category": "CATEGORIA_ELEGIDA",
  "intel_level": "Nivel 1-10"
}
`;

function generateShortId(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function GET() {
  try {
    let openai: any = null;
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    // 1. FUENTES DE ALTA FIDELIDAD (Múltiples para evitar vacíos)
    const FEEDS = [
      'https://news.google.com/rss/search?q=NVIDIA+Blackwell+RTX+OpenAI+GPT-5+Sam+Altman+Anthropic+Claude+Silicon+Valley+latest+news&hl=es-419&gl=US&ceid=US:es-419',
      'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      'https://techcrunch.com/category/artificial-intelligence/feed/'
    ];

    // Carga paralela de feeds
    const feedResults = await Promise.all(FEEDS.map(url => parser.parseURL(url).catch(() => ({ items: [] }))));
    const allRawItems = feedResults.flatMap(f => f.items).sort((a, b) => 
      new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    ).slice(0, 15);

    // 2. PROCESAMIENTO TITAN AI (Limitado a los 8 más recientes para velocidad)
    const processedNews = await Promise.all(allRawItems.slice(0, 8).map(async (item) => {
      const uniqueId = generateShortId(item.link || item.title || "");
      
      let titanData = {
        title: item.title?.split(' - ')[0] || "Señal de Inteligencia Detectada",
        strategic_summary: item.contentSnippet?.substring(0, 160) + "..." || "Analizando flujo de datos...",
        category: "INTEL",
        intel_level: "7"
      };

      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "Eres PROJECT TITAN AI. Transforma datos en inteligencia." },
              { role: "user", content: TITAN_PROMPT.replace('{{TITLE}}', item.title || '').replace('{{EXCERPT}}', item.contentSnippet || '') }
            ],
            response_format: { type: "json_object" }
          });
          
          const content = JSON.parse(completion.choices[0].message.content || '{}');
          titanData = {
            title: content.title || titanData.title,
            strategic_summary: content.strategic_summary || titanData.strategic_summary,
            category: content.category || titanData.category,
            intel_level: content.intel_level || titanData.intel_level
          };
        } catch (e) {
          console.error("Titan AI Processing Error:", e);
        }
      }

      const getRealImage = (title: string) => {
        const t = title.toLowerCase();
        const base = "https://images.unsplash.com/";
        if (t.includes("nvidia") || t.includes("blackwell") || t.includes("chip") || t.includes("gpu")) 
          return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("openai") || t.includes("gpt") || t.includes("altman")) 
          return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: titanData.title,
        category: titanData.category,
        excerpt: titanData.strategic_summary,
        author: "HAWKIN Intelligence",
        date: "Sincronizado Hoy",
        timestamp: new Date(item.pubDate || Date.now()).getTime(),
        image: getRealImage(item.title || ""),
        url: item.link,
        source: item.source?.name || "Radar Global",
        intelLevel: titanData.intel_level
      };
    }));

    return NextResponse.json({
      news: processedNews,
      status: "Titan Engine Live"
    });
  } catch (error) {
    console.error("Titan Engine Critical Failure:", error);
    return new NextResponse("Error en el Motor de Inteligencia", { status: 500 });
  }
}
