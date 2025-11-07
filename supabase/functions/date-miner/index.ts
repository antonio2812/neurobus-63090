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
interface MinedProduct {
  name: string;
  reason: string;
  niche: string;
}

// Função para gerar o prompt principal
const generateDateMinerPrompt = (dateName: string): string => {
  return `
    Você é um especialista em e-commerce e mineração de produtos sazonais no Brasil.
    Sua tarefa é identificar 5 produtos com alto potencial de venda e lucro para a data comemorativa: "${dateName}".
    
    **INSTRUÇÕES CRÍTICAS:**
    1. **SAZONALIDADE:** Os produtos devem ser altamente relevantes para a data "${dateName}" no contexto brasileiro.
    2. **LUCRO:** O foco deve ser em produtos que permitam uma boa margem de lucro e que sejam fáceis de vender em marketplaces (Mercado Livre, Shopee, Amazon).
    3. Gere 5 produtos. Para cada produto, forneça:
        a. O nome do produto (name).
        b. O motivo pelo qual ele é lucrativo para esta data (reason).
        c. O nicho de mercado (niche).
    
    Formato de Saída: Retorne um objeto JSON com a chave 'minedProducts' contendo um array de objetos, cada um com as chaves 'name', 'reason', e 'niche'.
    Exemplo: {"minedProducts": [{"name": "...", "reason": "...", "niche": "..."}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'date-miner' started execution.");

  if (!GOOGLE_GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: A chave GOOGLE_GEMINI_API_KEY não está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { dateName } = body;

    if (!dateName) {
      return new Response(JSON.stringify({ error: 'Nome da data comemorativa não fornecido.' }), { status: 400, headers: corsHeaders })
    }
    
    const prompt = generateDateMinerPrompt(dateName);
    
    console.log(`Generating mined products for: ${dateName}`);

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
        console.error("Failed to parse JSON response from AI:", rawContent, e);
        throw new Error(`Erro de formato da IA. Resposta bruta: ${rawContent.substring(0, 100)}...`);
    }
    
    const minedProducts: MinedProduct[] = jsonResponse.minedProducts || [];

    if (minedProducts.length === 0) {
        throw new Error("A IA não conseguiu minerar produtos para esta data.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        minedProducts: minedProducts,
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