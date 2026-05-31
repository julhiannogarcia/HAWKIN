import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching global para evitar bloqueos por rate-limit o lentitud
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutos de frescura

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. OBTENER NOTICIAS MANUALES (ESTO SIEMPRE DEBE CARGAR)
    const dbNews = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    manualIntel = dbNews.map(n => ({
      id: n.id,
      title: n.title,
      summary: n.excerpt || n.content.substring(0, 250) + "...",
      impact: n.isUrgent ? 10 : 9,
      companies: [n.category || "ALPHA"],
      people: ["Fundador HAWKIN"],
      consequence: "Inyección directa desde el núcleo de mando.",
      importance: n.isUrgent ? "CRITICO" : "ALTO",
      url: n.url || `/news/${n.id}`,
      image: n.imageUrl || null,
      timestamp: n.createdAt.toISOString()
    }));

    // 2. VERIFICAR CACHÉ (VELOCIDAD RAYO)
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ 
        ...cachedIntel, 
        topNews: merged, 
        lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') 
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ 
         topNews: manualIntel, 
         rumors: [], battles: [], trendingCEOs: [], 
         prediction: { dominance: "HAWKIN", ceo: "Socio Alpha", risk: "BAJO" },
         lastUpdate: new Date().toLocaleTimeString('es-PE') 
       });
    }

    const groq = new Groq({ apiKey });

    // 3. RECOPILAR RSS CON TIMEOUT ULTRA-ESTRICTO
    let rawItems: any[] = [];
    try {
      const FEEDS = ['https://news.google.com/rss/search?q=AI+Artificial+Intelligence+OpenAI+NVIDIA+breaking&hl=en-US&gl=US&ceid=US:en'];
      const results = await Promise.all(FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('RSS Timeout')), 3000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = results.flatMap(res => res.items || []).slice(0, 8).map(item => ({
        title: item.title,
        content: item.contentSnippet?.substring(0, 100) || item.title,
        source: item.source?.name || "Global"
      }));
    } catch (e) { console.error("RSS Error:", e); }

    // 4. MOTOR DE IA LLAMA-3 (PROMPT SIMPLIFICADO PARA JSON GARANTIZADO)
    let aiItems: any[] = [];
    let intelReport: any = { 
      topNews: [], rumors: [], battles: [], trendingCEOs: [], 
      prediction: { dominance: "AI", ceo: "Growth", risk: "Medio" } 
    };

    if (rawItems.length > 0) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "Eres el HAWKIN WAR ROOM. Analiza noticias de IA y devuelve SIEMPRE un JSON válido. No devuelvas texto fuera del JSON." 
            },
            { 
              role: "user", 
              content: `Genera un reporte JSON con estas noticias: ${JSON.stringify(rawItems)}. 
              Estructura: { 
                "topNews": [{"title":"", "summary":"", "impact":10, "companies":[], "people":[], "consequence":"", "importance":"ALTO"}],
                "rumors": [{"text":"", "source":"", "probability":"80%"}],
                "battles": [{"competitors":"", "motive":"", "status":"", "winners":""}],
                "trendingCEOs": [{"name":"", "company":"", "reason":""}],
                "prediction": {"dominance":"", "ceo":"", "risk":""}
              }` 
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.1,
          response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        
        // Validar campos críticos
        intelReport = {
          rumors: parsed.rumors || [],
          battles: parsed.battles || [],
          trendingCEOs: parsed.trendingCEOs || [],
          prediction: parsed.prediction || { dominance: "IA", ceo: "Altman", risk: "Bajo" }
        };

        aiItems = (parsed.topNews || [])
          .filter((n: any) => n.title && n.summary)
          .map((n: any) => ({
            ...n,
            id: generateId(n.title),
            timestamp: new Date().toISOString()
          }));

        if (aiItems.length > 0) {
          cachedIntel = { ...intelReport, aiItems };
          lastUpdate = now;
        }
      } catch (aiErr) {
        console.error("AI Generation Error:", aiErr);
      }
    }

    // SIEMPRE MERGEAR CON MANUALES PARA QUE NUNCA ESTÉ VACÍO
    const finalTopNews = [...manualIntel, ...aiItems].slice(0, 10);

    return NextResponse.json({ 
      ...intelReport, 
      topNews: finalTopNews, 
      lastUpdate: new Date(now).toLocaleTimeString('es-PE') 
    });

  } catch (error: any) {
    console.error("Critical API Error:", error);
    // FALLBACK DE EMERGENCIA TOTAL: SOLO MANUALES
    return NextResponse.json({ 
       topNews: manualIntel, 
       rumors: [], battles: [], trendingCEOs: [],
       prediction: { dominance: "HAWKIN", ceo: "Fundador", risk: "Bajo" },
       lastUpdate: new Date().toLocaleTimeString('es-PE'),
       emergency: true
    });
  }
}
