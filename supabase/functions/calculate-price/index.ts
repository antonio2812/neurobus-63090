import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa as chaves de API
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

// Definições de taxas (Mockadas para simular a lógica de precificação)
const MARKETPLACE_FEES: { [key: string]: { commission: number, fixedFee: number, freightFee: number } } = {
  'Mercado Livre': { commission: 0.14, fixedFee: 6.99, freightFee: 10.00 }, // Clássico (14%)
  'Shopee': { commission: 0.12, fixedFee: 3.00, freightFee: 8.00 },
  'Amazon': { commission: 0.15, fixedFee: 5.00, freightFee: 12.00 },
  'Magalu': { commission: 0.16, fixedFee: 0.00, freightFee: 10.00 },
  'Shein': { commission: 0.10, fixedFee: 0.00, freightFee: 7.00 },
  'Facebook': { commission: 0.00, fixedFee: 0.00, freightFee: 0.00 }, // Sem taxas
};

// Função principal de cálculo
const calculatePrice = (
  marketplace: string, 
  cost: number, 
  margin: number, 
  adType: string | null, 
  additionalCost: number
) => {
  let fees = MARKETPLACE_FEES[marketplace] || MARKETPLACE_FEES['Mercado Livre'];
  let commissionRate = fees.commission;
  
  // Ajuste para Mercado Livre baseado no tipo de anúncio
  if (marketplace === 'Mercado Livre' && adType === 'Premium') {
    commissionRate = 0.18;
  }

  const desiredMarginRate = margin / 100;
  
  // Custo total do produto (fornecedor + adicionais)
  const productCost = cost + additionalCost;
  
  // Taxas fixas e de frete
  const fixedFee = fees.fixedFee;
  const freightFee = fees.freightFee;
  
  const denominator = 1 - commissionRate - desiredMarginRate;
  
  if (denominator <= 0.05) { // Evita divisão por zero ou margem irrealista
    const minMarginRate = 0.05;
    const minDenominator = 1 - commissionRate - minMarginRate;
    
    if (minDenominator <= 0) {
        const idealSalePrice = (productCost + fixedFee + freightFee) / (1 - commissionRate);
        const commissionValue = idealSalePrice * commissionRate;
        const totalCosts = productCost + fixedFee + freightFee + commissionValue;
        const netProfit = idealSalePrice - totalCosts;
        const netMargin = (netProfit / idealSalePrice) || 0;
        
        return {
            idealSalePrice: parseFloat(idealSalePrice.toFixed(2)),
            netProfit: parseFloat(netProfit.toFixed(2)),
            netMargin: parseFloat(netMargin.toFixed(4)),
            details: {
                marketplace,
                cost,
                desiredMargin: margin,
                fixedFee,
                freightFee,
                commissionRate: commissionRate * 100,
                commissionValue: parseFloat(commissionValue.toFixed(2)),
                totalCosts: parseFloat(totalCosts.toFixed(2)),
                commissionLimit: true,
                adType,
                additionalCost,
            }
        };
    }
    
    const idealSalePrice = (productCost + fixedFee + freightFee) / minDenominator;
    const commissionValue = idealSalePrice * commissionRate;
    const totalCosts = productCost + fixedFee + freightFee + commissionValue;
    const netProfit = idealSalePrice - totalCosts;
    const netMargin = (netProfit / idealSalePrice) || 0;
    
    return {
        idealSalePrice: parseFloat(idealSalePrice.toFixed(2)),
        netProfit: parseFloat(netProfit.toFixed(2)),
        netMargin: parseFloat(netMargin.toFixed(4)),
        details: {
            marketplace,
            cost,
            desiredMargin: margin,
            fixedFee,
            freightFee,
            commissionRate: commissionRate * 100,
            commissionValue: parseFloat(commissionValue.toFixed(2)),
            totalCosts: parseFloat(totalCosts.toFixed(2)),
            commissionLimit: true,
            adType,
            additionalCost,
        }
    };
  }
  
  // Cálculo normal
  const idealSalePrice = (productCost + fixedFee + freightFee) / denominator;
  
  // Recalculando valores finais com o preço ideal
  const commissionValue = idealSalePrice * commissionRate;
  const totalCosts = productCost + fixedFee + freightFee + commissionValue;
  const netProfit = idealSalePrice - totalCosts;
  const netMargin = (netProfit / idealSalePrice) || 0;

  return {
    idealSalePrice: parseFloat(idealSalePrice.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    netMargin: parseFloat(netMargin.toFixed(4)),
    details: {
      marketplace,
      cost,
      desiredMargin: margin,
      fixedFee,
      freightFee,
      commissionRate: commissionRate * 100,
      commissionValue: parseFloat(commissionValue.toFixed(2)),
      totalCosts: parseFloat(totalCosts.toFixed(2)),
      commissionLimit: false,
      adType,
      additionalCost,
    }
  };
};

// Função para chamar a IA (OpenRouter ou Gemini)
const callAI = async (prompt: string, isJson: boolean = false) => {
    if (OPENROUTER_API_KEY) {
        const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
        const MODEL = 'openai/gpt-3.5-turbo'; 

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://urbbngcarxdqesenfvsb.supabase.co', 
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                ...(isJson && { response_format: { type: "json_object" } }),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);
            throw new Error(`Erro da API do OpenRouter: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "A IA não gerou conteúdo.";

    } else if (GOOGLE_GEMINI_API_KEY) {
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.5,
                    ...(isJson && { responseMimeType: "application/json" })
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Gemini API error:", response.status, errorText);
            throw new Error(`Erro da API do Google Gemini: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não gerou conteúdo.";
    } else {
        throw new Error('Nenhuma chave de API (OpenRouter ou Gemini) configurada.');
    }
}


// Função para gerar a explicação da IA (usando callAI)
const generateExplanation = async (calculation: ReturnType<typeof calculatePrice>) => {
    const { idealSalePrice, netProfit, netMargin, details } = calculation;
    
    const prompt = `
        Você é a IA de Precificação da LucraAI. Sua tarefa é analisar o resultado do cálculo de preço de venda ideal e fornecer uma explicação amigável e estratégica para o usuário.
        
        **Dados do Cálculo:**
        - Marketplace: ${details.marketplace}
        - Custo do Produto: R$ ${details.cost.toFixed(2)}
        - Custos Adicionais: R$ ${details.additionalCost.toFixed(2)}
        - Margem Desejada: ${details.desiredMargin}%
        - Taxa de Comissão: ${details.commissionRate.toFixed(2)}%
        - Custo Fixo: R$ ${details.fixedFee.toFixed(2)}
        - Custo de Frete: R$ ${details.freightFee.toFixed(2)}
        
        **Resultado Final:**
        - Preço de Venda Ideal: R$ ${idealSalePrice.toFixed(2)}
        - Lucro Líquido: R$ ${netProfit.toFixed(2)}
        - Margem Líquida: ${(netMargin * 100).toFixed(2)}%
        
        **Instruções para a Resposta:**
        1. Comece com uma saudação e a conclusão principal.
        2. Explique de forma clara e concisa como o preço ideal foi calculado, mencionando os principais custos (comissão, frete, custo do produto).
        3. Se o lucro for negativo (R$ ${netProfit.toFixed(2)} < 0), use um tom de alerta e sugira aumentar o preço ou reduzir custos.
        4. Se a margem líquida for muito diferente da margem desejada, explique brevemente o porquê (geralmente devido a taxas fixas e frete).
        5. Use negrito (**) para destacar valores importantes.
        
        Formato de Saída: Retorne apenas o texto da explicação.
    `;

    try {
        return await callAI(prompt, false); // Não é JSON
    } catch (e) {
        console.error("Erro ao gerar explicação da IA:", e);
        return "Cálculo concluído! O preço ideal foi determinado com base nas taxas do marketplace e sua margem desejada. Veja os detalhes abaixo.";
    }
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'calculate-price' started execution.");

  // 1. Verificação da Chave do Google Gemini / OpenRouter
  if (!GOOGLE_GEMINI_API_KEY && !OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: Nenhuma chave de API (OpenRouter ou Gemini) está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { marketplace, cost, margin, adType, additionalCost } = body;

    if (typeof cost !== 'number' || typeof margin !== 'number' || typeof additionalCost !== 'number') {
        return new Response(JSON.stringify({ error: 'Dados de entrada inválidos. Certifique-se de que custo, margem e custo adicional são números.' }), { status: 400, headers: corsHeaders });
    }

    // 2. Executa o cálculo
    const calculation = calculatePrice(marketplace, cost, margin, adType, additionalCost);
    
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