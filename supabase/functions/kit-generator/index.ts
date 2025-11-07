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

// Função para gerar o prompt principal
const generateKitPrompt = (productName: string): string => {
  return `
    Você é um especialista em e-commerce e criação de kits de produtos lucrativos no Brasil.
    Sua tarefa é gerar 3 sugestões de kits de produtos complementares para o produto principal: "${productName}".
    
    **INSTRUÇÕES CRÍTICAS:**
    1. **COMPLEMENTARIDADE:** Os produtos no kit devem ser altamente complementares ao produto principal, aumentando o valor percebido e o ticket médio.
    2. **PREÇO REALISTA:** O preço sugerido (suggestedPrice) deve ser um valor realista e atrativo para o kit completo no mercado brasileiro (Mercado Livre, Shopee, Amazon). O preço deve ser um número (float) sem formatação de moeda.
    3. **LUCRO:** O motivo (reason) deve focar em como o kit aumenta o lucro e a conversão.
    4. Gere 3 kits. Para cada kit, forneça:
        a. O nome do kit (kitName).
        b. Uma lista de 3 a 5 produtos complementares (products).
        c. O preço de venda sugerido (suggestedPrice) em Reais (R$).
        d. O motivo pelo qual o kit é lucrativo (reason).
    
    Formato de Saída: Retorne um objeto JSON com a chave 'kits' contendo um array de objetos, cada um com as chaves 'kitName', 'products' (array de strings), 'suggestedPrice' (number) e 'reason' (string).
    Exemplo: {"kits": [{"kitName": "...", "products": ["...", "..."], "suggestedPrice": 199.90, "reason": "..."}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'kit-generator' started execution.");

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
    
    const prompt = generateKitPrompt(productName);
    
    console.log(`Generating kits for: ${productName}`);

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
    
    const kits: any[] = jsonResponse.kits || [];

    if (kits.length === 0) {
        throw new Error("A IA não conseguiu gerar kits para este produto.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        kits: kits,
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