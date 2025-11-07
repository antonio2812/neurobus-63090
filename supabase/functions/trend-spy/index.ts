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
interface TrendProduct {
  name: string;
  reason: string;
  potential: string;
}

// Função para gerar o prompt principal
const generateTrendPrompt = (category: string): string => {
  return `
    Você é um especialista em mineração de produtos e tendências de e-commerce no Brasil.
    Sua tarefa é identificar 5 produtos que estão em alta (tendência) ou são best-sellers na categoria "${category}", mas que ainda possuem POUCA CONCORRÊNCIA e um POTENCIAL GIGANTESCO de lucro para novos vendedores em marketplaces (Mercado Livre, Shopee, Amazon).
    
    **INSTRUÇÕES CRÍTICAS:**
    1. Use a API da OpenAI para pesquisar dados de mercado e tendências reais no Brasil para a categoria "${category}".
    2. Gere 5 produtos. Para cada produto, forneça:
        a. O nome exato do produto (name).
        b. O motivo da tendência/baixo concorrente (reason).
        c. O potencial de lucro/venda (potential).
    3. O foco deve ser em produtos que um pequeno ou médio vendedor possa começar a vender imediatamente.
    
    Formato de Saída: Retorne um objeto JSON com a chave 'products' contendo um array de objetos, cada um com as chaves 'name', 'reason', e 'potential'.
    Exemplo: {"products": [{"name": "...", "reason": "...", "potential": "..."}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'trend-spy' started execution.");

  if (!GOOGLE_GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: A chave GOOGLE_GEMINI_API_KEY não está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { category } = body;

    if (!category) {
      return new Response(JSON.stringify({ error: 'Categoria não fornecida.' }), { status: 400, headers: corsHeaders })
    }
    
    const prompt = generateTrendPrompt(category);
    
    console.log(`Generating trends for: ${category}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
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
    
    const products: TrendProduct[] = jsonResponse.products || [];

    if (products.length === 0) {
        throw new Error("A IA não conseguiu identificar produtos em tendência para esta categoria.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        products: products,
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