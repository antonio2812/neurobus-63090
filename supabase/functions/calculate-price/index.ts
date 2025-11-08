import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { calculatePrice } from "./lib/pricing.ts";
import { generateExplanation } from "./lib/ai.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa as chaves de API (para verificação de configuração)
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

// --- Main Server Handler ---

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'calculate-price' started execution.");

  // 1. Verificação da Chave do Google Gemini / OpenRouter
  if (!GOOGLE_GEMINI_API_KEY && !OPENROUTER_API_KEY) {
    console.warn('Aviso: Nenhuma chave de API (OpenRouter ou Gemini) está definida. A explicação da IA pode falhar.');
  }

  try {
    const body = await req.json();
    const { marketplace, cost, margin, adType, additionalCost, category, weight, weightUnit, rawWeightValue } = body;

    if (typeof cost !== 'number' || typeof margin !== 'number' || typeof additionalCost !== 'number' || !category || typeof weight !== 'number' || !weightUnit || typeof rawWeightValue !== 'number') {
        return new Response(JSON.stringify({ error: 'Dados de entrada inválidos. Certifique-se de que custo, margem, custo adicional, peso e rawWeightValue são números, a categoria foi selecionada e a unidade de peso foi fornecida.' }), { status: 400, headers: corsHeaders });
    }
    
    // Se for Mercado Livre, adType é obrigatório
    if (marketplace === 'Mercado Livre' && !adType) {
        return new Response(JSON.stringify({ error: 'Tipo de anúncio (adType) é obrigatório para o Mercado Livre.' }), { status: 400, headers: corsHeaders });
    }

    // 2. Executa o cálculo
    const calculation = calculatePrice(marketplace, cost, margin, adType, additionalCost, category, weight, weightUnit, rawWeightValue);
    
    // 3. Gera a explicação da IA
    const explanation = await generateExplanation(calculation);

    return new Response(
      JSON.stringify({
        success: true,
        explanation: explanation,
        calculation: calculation,
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
        
        if (errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("OpenRouter")) {
            errorMessage = "Chave API inválida ou erro de comunicação com a IA. Por favor, verifique a configuração da chave OPENROUTER_API_KEY ou GOOGLE_GEMINI_API_KEY.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
        } else if (errorMessage.includes("Erro de formato da IA")) {
            // Mantém a mensagem de erro de formato
        } else if (errorMessage.includes("Erro da API do Google Gemini")) {
            // Mantém a mensagem de erro da API
        } else {
            errorMessage = "Falha na comunicação com a IA. Verifique sua conexão ou tente novamente.";
        }
    }
    
    // Retorna o erro no corpo da resposta para que o cliente possa capturá-lo
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: corsHeaders,
        status: 500,
      }
    )
  }
});