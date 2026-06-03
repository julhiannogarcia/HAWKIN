import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TITAN_PROMPT = `
# PROJECT TITAN AI - GLOBAL INTELLIGENCE NETWORK
Eres una red global de inteligencia tecnológica. Tu misión es transformar noticias crudas en INTELIGENCIA ESTRATÉGICA.

IDENTIDAD: No eres un chatbot. Eres un analista de élite especializado en IA, Silicon Valley y Geopolítica Tecnológica.

INSTRUCCIONES:
1. Analiza el título y resumen de la noticia.
2. Identifica si es un rumor, filtración, nuevo producto o movimiento corporativo.
3. Genera un resumen ejecutivo de máximo 3 frases que explique la CONSECUENCIA y el IMPACTO de la noticia.
4. Asigna una de estas categorías: RUMORES & CEOS, GUERRA DE CHIPS, CARRERA AGI, BIG TECH, INVERSIÓN, SHIELD INTEL.
5. El tono debe ser serio, profesional y autoritario ("Inteligencia de HAWKIN detecta...", "Impacto crítico en...").

NOTICIA A ANALIZAR:
Título: {{TITLE}}
Resumen: {{EXCERPT}}

RESPONDE ÚNICAMENTE EN ESTE FORMATO JSON:
{
  "strategic_summary": "tu resumen aquí",
  "category": "CATEGORIA_ELEGIDA",
  "intel_level": "Nivel de importancia 1-10"
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
    // 1. OBTENER NOTICIAS MANUALES DE LA BASE DE DATOS
    const dbNews = await prisma.news.findMany({
      where: { 
        published: true,
        NOT: { title: { contains: 'Julhianno', mode: 'insensitive' } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // 2. RADAR GLOBAL RSS
    const AI_MASTER_FEED = 'https://news.google.com/rss/search?q=OpenAI+GPT-5+Sam+Altman+rumor+Elon+Musk+xAI+Jensen+Huang+NVIDIA+Blackwell+DeepMind+Anthropic+Claude+scoop+breaking&hl=es-419&gl=US&ceid=US:es-419';
    
    const feed = await parser.parseURL(AI_MASTER_FEED);
    const topItems = feed.items.slice(0, 10);

    // 3. PROCESAMIENTO CON CHATGPT (TITAN AI ENGINE)
    // Solo procesamos si hay API Key de OpenAI, si no, usamos fallback manual
    const processedNews = await Promise.all(topItems.map(async (item) => {
      const uniqueId = generateShortId(item.link || item.title || "");
      let titanIntel = {
        strategic_summary: item.contentSnippet || "Analizando impacto en el ecosistema global...",
        category: "RUMORES & CEOS",
        intel_level: "7"
      };

      if (process.env.OPENAI_API_KEY) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Rápido y económico para noticias al segundo
            messages: [
              { role: "system", content: "Eres el motor PROJECT TITAN AI de HAWKIN." },
              { role: "user", content: TITAN_PROMPT.replace('{{TITLE}}', item.title || '').replace('{{EXCERPT}}', item.contentSnippet || '') }
            ],
            response_format: { type: "json_object" }
          });
          
          const content = completion.choices[0].message.content;
          if (content) {
            const parsed = JSON.parse(content);
            titanIntel = {
              strategic_summary: parsed.strategic_summary,
              category: parsed.category,
              intel_level: parsed.intel_level
            };
          }
        } catch (e) {
          console.error("OpenAI Titan Engine Error:", e);
        }
      }

      const getRealImage = (title: string) => {
        const t = title.toLowerCase();
        const base = "https://images.unsplash.com/";
        if (t.includes("musk") || t.includes("tesla") || t.includes("xai")) return `${base}photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("altman") || t.includes("openai") || t.includes("gpt")) return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("nvidia") || t.includes("chip") || t.includes("gpu")) return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: item.title?.split(' - ')[0],
        category: titanIntel.category,
        excerpt: titanIntel.strategic_summary,
        author: "HAWKIN Intelligence",
        date: "Sincronizado Hoy",
        timestamp: new Date(item.pubDate || Date.now()).getTime(),
        image: getRealImage(item.title || ""),
        url: item.link,
        source: item.source?.name || "Radar Global",
        intelLevel: titanIntel.intel_level
      };
    }));

    const formattedDbNews = dbNews.map(n => ({
      id: n.id,
      title: n.title,
      category: n.category,
      excerpt: n.excerpt || n.content.substring(0, 250) + "...",
      author: "HAWKIN Intelligence",
      date: "Reporte Interno",
      timestamp: new Date(n.createdAt).getTime(),
      image: n.image,
      url: n.url,
      source: "HAWKIN Elite"
    }));

    return NextResponse.json({
      news: [...formattedDbNews, ...processedNews],
      status: "Titan Engine Active"
    });
  } catch (error) {
    console.error("Radar Motor Error:", error);
    return new NextResponse("Error en el Motor TITAN AI", { status: 500 });
  }
}
