import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa a API do Google Gemini
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
if (!GOOGLE_GEMINI_API_KEY) {
  console.error("GOOGLE_GEMINI_API_KEY not set in environment.");
}

// Formato de saída JSON esperado pela função
interface CompetitorInsight {
  competitorName: string;
  price: number;
  strategy: string;
}

// Função para gerar o prompt principal
const generateCompetitionPrompt = (productName: string): string => {
  return `
    Você é um especialista em inteligência de mercado e espionagem de concorrência para e-commerce no Brasil.
    Sua tarefa é simular uma análise em tempo real para o produto: "${productName}".
    
    **INSTRUÇÕES CRÍTICAS:**
    1. **SIMULE CONCORRENTES REAIS E ATUAIS:** Pesquise e simule 3 a 5 concorrentes que pareçam ser lojas ou vendedores reais e ativos, vendendo o produto "${productName}" em marketplaces brasileiros (Mercado Livre, Shopee, Amazon) HOJE.
    2. **PREÇOS REALISTAS:** O preço de venda simulado (price) deve ser realista para o mercado brasileiro atual e competitivo.
    3. Para cada concorrente, forneça:
        a. O nome do concorrente (competitorName).
        b. O preço de venda simulado (price) em Reais (R$).
        c. A principal estratégia de venda que eles estão usando (strategy). Exemplos: "Foco em frete grátis e parcelamento sem juros", "Preço agressivo para ganhar volume", "Anúncio Premium com alta visibilidade", "Venda em kit com produto complementar".
    4. O preço (price) deve ser um número (float) sem formatação de moeda.
    
    Formato de Saída: Retorne um objeto JSON com a chave 'insights' contendo um array de objetos, cada um com as chaves 'competitorName', 'price' (number) e 'strategy' (string).
    Exemplo: {"insights": [{"competitorName": "Loja X", "price": 199.90, "strategy": "..."}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'competition-spy' started execution.");

  if (!GOOGLE_GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: A chave GOOGLE_GEMINI_API_KEY não está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { productName } = body;

    if (!productName) {
      return new Response(JSON.stringify({ error: 'Nome do produto não fornecido.' }), { status: 400, headers: corsHeaders })
    }
    
    const prompt = generateCompetitionPrompt(productName);
    
    console.log(`Generating competition insights for: ${productName}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Gemini API error:", response.status, errorText);
      throw new Error(`Erro da API do Google Gemini: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!rawContent) {
      throw new Error("A IA não retornou conteúdo.");
    }

    let jsonResponse;
    try {
        jsonResponse = JSON.parse(rawContent);
    } catch (e) {
        console.error("Failed to parse JSON response from OpenAI:", rawContent, e);
        throw new Error(`Erro de formato da IA. Resposta bruta: ${rawContent.substring(0, 100)}...`);
    }
    
    const insights: CompetitorInsight[] = jsonResponse.insights || [];

    if (insights.length === 0) {
        throw new Error("A IA não conseguiu identificar concorrentes para este produto.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        insights: insights,
      }),
      {
        headers: corsHeaders,
        status: 200,
      }
    )

  } catch (error) {
    console.error("Erro na Edge Function:", error)
    let errorMessage = "Erro interno do servidor."
    
    if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes("API key") || errorMessage.includes("401")) {
            errorMessage = "Chave API do Google Gemini inválida. Por favor, verifique a configuração.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
        } else if (errorMessage.includes("Erro de formato da IA")) {
            // Mantém a mensagem de erro de formato
        } else if (errorMessage.includes("Erro da API do Google Gemini")) {
            // Mantém a mensagem de erro da API
        } else {
            errorMessage = "Falha na comunicação com o Google Gemini. Verifique sua conexão ou tente novamente.";
        }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: corsHeaders,
        status: 500,
      }
    )
  }
});