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

// Tipos de dados
interface CalculationResult {
  idealSalePrice: number;
  netProfit: number;
  netMargin: number;
  details: {
    marketplace: string;
    cost: number;
    desiredMargin: number;
    fixedFee: number;
    freightFee: number;
    commissionRate: number;
    commissionValue: number;
    totalCosts: number;
    commissionLimit: boolean;
    adType: string | null;
    additionalCost: number;
    category: string | null; // NOVO
    weight: number | null; // NOVO
  };
}

// Função para chamar a IA (OpenRouter ou Gemini) - Mantida
const callAI = async (prompt: string, isJson: boolean = false) => {
    // Prioriza OpenRouter se a chave estiver presente
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

// Função auxiliar para calcular o preço dado um conjunto de custos e taxas
const solveForPrice = (
  productCost: number, 
  fixedFee: number, 
  freightFee: number, 
  commissionRate: number, 
  desiredMarginRate: number
) => {
  const denominator = 1 - commissionRate - desiredMarginRate;
  
  if (denominator <= 0.0001) { 
    // Se a margem desejada for muito alta, calculamos o preço que resulta em 0% de lucro
    const priceForZeroProfit = (productCost + fixedFee + freightFee) / (1 - commissionRate);
    return { idealSalePrice: priceForZeroProfit, commissionLimit: true };
  }
  
  const idealSalePrice = (productCost + fixedFee + freightFee) / denominator;
  return { idealSalePrice, commissionLimit: false };
};

// Função principal de cálculo refatorada
const calculatePrice = (
  marketplace: string, 
  cost: number, 
  margin: number, 
  adType: string | null, 
  additionalCost: number,
  category: string | null, // NOVO
  weight: number | null // NOVO
): CalculationResult => {
  const desiredMarginRate = margin / 100;
  const productCost = cost + additionalCost;
  
  let commissionRate = 0;
  let fixedFee = 0;
  let freightFee = 0;
  let commissionLimit = false;
  let finalIdealSalePrice = 0;
  
  // --- Lógica de Precificação por Marketplace ---

  if (marketplace === 'Mercado Livre') {
    // 1. Define a comissão baseada no adType
    commissionRate = adType === 'Premium' ? 0.18 : 0.14;
    
    // 2. TIER 1: Preço < R$19.00
    // Custo Fixo: R$6.50. Frete: R$10.00 (Comprador paga parte)
    let currentFixedFee = 6.50;
    let currentFreightFee = 10.00;
    let { idealSalePrice: price1 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
    
    if (price1 < 19.00) {
      finalIdealSalePrice = price1;
      fixedFee = currentFixedFee;
      freightFee = currentFreightFee;
    } else {
      // TIER 2: Preço R$19.00 to R$78.99
      // Fixed Fee: R$0.00. Frete: R$25.00 (Frete Grátis para o Comprador e Vendedor isento da taxa de envio)
      currentFixedFee = 0.00;
      currentFreightFee = 25.00;
      let { idealSalePrice: price2 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
      
      if (price2 >= 19.00 && price2 <= 78.99) {
        finalIdealSalePrice = price2;
        fixedFee = currentFixedFee;
        freightFee = currentFreightFee;
      } else {
        // TIER 3: Preço > R$78.99
        // Fixed Fee: R$0.00. Frete: R$50.00 (Comprador paga uma parte do frete R$50)
        currentFixedFee = 0.00;
        currentFreightFee = 50.00;
        let { idealSalePrice: price3 } = solveForPrice(productCost, currentFixedFee, currentFreightFee, commissionRate, desiredMarginRate);
        
        finalIdealSalePrice = price3;
        fixedFee = currentFixedFee;
        freightFee = currentFreightFee;
      }
    }

  } else if (marketplace === 'Shopee') {
    // Comissão: 20% (incluindo frete/serviço)
    commissionRate = 0.20;
    // Custo Fixo: R$4.00 por item vendido
    fixedFee = 4.00;
    freightFee = 0.00; 
    
    let { idealSalePrice: initialPrice } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    
    // Lógica de Limite de Comissão (R$100.00)
    const maxCommission = 100.00;
    const commissionValue = initialPrice * commissionRate;
    
    if (commissionValue > maxCommission) {
        // Recalcula o preço usando o valor fixo da comissão (R$100.00)
        const denominator = 1 - desiredMarginRate;
        if (denominator <= 0.0001) {
            finalIdealSalePrice = initialPrice; 
            commissionLimit = true;
        } else {
            // Novo preço = (Custo + Fixo + Frete + Comissão Máxima) / (1 - Margem Desejada)
            finalIdealSalePrice = (productCost + fixedFee + freightFee + maxCommission) / denominator;
            commissionRate = (maxCommission / finalIdealSalePrice) || 0; // Atualiza a taxa efetiva
            commissionLimit = true;
        }
    } else {
        finalIdealSalePrice = initialPrice;
    }

  } else if (marketplace === 'Amazon') {
    // Comissão: 16% Geral
    commissionRate = 0.16;
    freightFee = 0.00; 
    
    // TIER 1: Preço < R$30.00
    let currentFixedFee = 4.50;
    let { idealSalePrice: price1 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
    
    if (price1 < 30.00) {
      finalIdealSalePrice = price1;
      fixedFee = currentFixedFee;
    } else {
      // TIER 2: Preço R$30.00 to R$78.99
      currentFixedFee = 8.00;
      let { idealSalePrice: price2 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
      
      if (price2 >= 30.00 && price2 <= 78.99) {
        finalIdealSalePrice = price2;
        fixedFee = currentFixedFee;
      } else {
        // TIER 3: Preço > R$79.00
        // Custo fixo varia dependendo do peso. Usamos R$15.00 como placeholder.
        currentFixedFee = 15.00; 
        let { idealSalePrice: price3 } = solveForPrice(productCost, currentFixedFee, freightFee, commissionRate, desiredMarginRate);
        
        finalIdealSalePrice = price3;
        fixedFee = currentFixedFee;
      }
    }

  } else if (marketplace === 'Magalu') {
    // Simplificação: Comissão média de 15% (entre 10% e 20%) + R$5,00 fixo
    commissionRate = 0.15; 
    fixedFee = 5.00;
    
    // Frete: Abaixo de R$79,00 o Vendedor não paga nada (R$0.00)
    // Acima de R$79,00, assumimos o cenário de 50% de frete pago pelo vendedor (R$15.00)
    let currentFreightFee = 0.00;
    
    let { idealSalePrice: initialPrice } = solveForPrice(productCost, fixedFee, currentFreightFee, commissionRate, desiredMarginRate);
    
    if (initialPrice > 79.00) {
        // Se o preço ideal for acima de R$79,00, o frete é cobrado.
        // Assumimos um custo de frete médio de R$30.00, com 50% pago pelo vendedor (R$15.00)
        currentFreightFee = 15.00; 
        let { idealSalePrice: finalPriceWithFreight } = solveForPrice(productCost, fixedFee, currentFreightFee, commissionRate, desiredMarginRate);
        finalIdealSalePrice = finalPriceWithFreight;
        freightFee = currentFreightFee;
    } else {
        finalIdealSalePrice = initialPrice;
        freightFee = currentFreightFee;
    }

  } else if (marketplace === 'Shein') {
    // Comissão padrão de 16% (ignorando isenção do primeiro mês para cálculo sustentável)
    commissionRate = 0.16;
    fixedFee = 0.00; 
    
    // Lógica de Frete por Peso (em kg)
    let currentFreightFee = 0.00;
    const w = weight || 0.5; // Default para 0.5kg se não informado
    
    if (w <= 0.3) {
        currentFreightFee = 4.00;
    } else if (w <= 1) { // De 0,3kg a 1kg
        currentFreightFee = 5.00;
    } else if (w <= 2) {
        currentFreightFee = 5.00;
    } else if (w <= 5) {
        currentFreightFee = 15.00;
    } else if (w <= 9) {
        currentFreightFee = 32.00;
    } else if (w <= 13) {
        currentFreightFee = 63.00;
    } else if (w <= 17) {
        currentFreightFee = 73.00;
    } else if (w <= 23) {
        currentFreightFee = 89.00;
    } else if (w <= 30) {
        currentFreightFee = 106.00;
    } else {
        currentFreightFee = 120.00; // Fallback para peso muito alto
    }
    
    freightFee = currentFreightFee;
    
    let { idealSalePrice: price } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    finalIdealSalePrice = price;

  } else if (marketplace === 'Facebook') {
    // Regra do Facebook: Não tem taxas/custos de comissão ou fixos.
    commissionRate = 0.00;
    fixedFee = 0.00;
    freightFee = 0.00;
    
    let { idealSalePrice: price } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    finalIdealSalePrice = price;

  } else {
    // Fallback para marketplaces não mapeados
    commissionRate = 0.14;
    fixedFee = 6.99;
    freightFee = 10.00;
    
    let { idealSalePrice: price } = solveForPrice(productCost, fixedFee, freightFee, commissionRate, desiredMarginRate);
    finalIdealSalePrice = price;
  }
  
  // --- Finalização do Cálculo ---
  
  // Recalculando valores finais com o preço ideal
  const finalCommissionRate = commissionRate;
  let commissionValue = finalIdealSalePrice * finalCommissionRate;
  
  // Se Shopee atingiu o limite, a comissão é R$100.00
  const actualCommissionValue = commissionLimit && marketplace === 'Shopee' ? 100.00 : commissionValue;
  
  const totalCosts = productCost + fixedFee + freightFee + actualCommissionValue;
  const netProfit = finalIdealSalePrice - totalCosts;
  const netMargin = (netProfit / finalIdealSalePrice) || 0;

  return {
    idealSalePrice: parseFloat(finalIdealSalePrice.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    netMargin: parseFloat(netMargin.toFixed(4)),
    details: {
      marketplace,
      cost,
      desiredMargin: margin,
      fixedFee: parseFloat(fixedFee.toFixed(2)),
      freightFee: parseFloat(freightFee.toFixed(2)),
      commissionRate: parseFloat((finalCommissionRate * 100).toFixed(2)),
      commissionValue: parseFloat(actualCommissionValue.toFixed(2)),
      totalCosts: parseFloat(totalCosts.toFixed(2)),
      commissionLimit: commissionLimit,
      adType,
      additionalCost,
      category,
      weight,
    }
  };
};

// Função para gerar a explicação da IA (usando callAI)
const generateExplanation = async (calculation: CalculationResult) => {
    const { idealSalePrice, netProfit, netMargin, details } = calculation;
    
    let amazonNote = '';
    if (details.marketplace === 'Amazon' && details.fixedFee === 15.00) {
        amazonNote = ' (Nota: O custo fixo de R$15,00 foi usado como estimativa para produtos acima de R$79,00, pois o valor real depende do peso do produto).';
    }
    
    let shopeeNote = '';
    if (details.marketplace === 'Shopee' && details.commissionLimit) {
        shopeeNote = ' (Nota: A comissão foi limitada ao teto de R$100,00, tornando a taxa efetiva menor que 20%).';
    }
    
    let mlNote = '';
    if (details.marketplace === 'Mercado Livre') {
        let tier = '';
        if (details.idealSalePrice < 19.00) {
            tier = 'abaixo de R$19,00';
        } else if (details.idealSalePrice >= 19.00 && details.idealSalePrice <= 78.99) {
            tier = 'entre R$19,00 e R$78,99';
        } else {
            tier = 'acima de R$78,99';
        }
        mlNote = ` (Regra ML: O cálculo usou a faixa de preço ${tier} e o tipo de anúncio ${details.adType}).`;
    }
    
    let magaluNote = '';
    if (details.marketplace === 'Magalu') {
        if (details.freightFee > 0) {
            magaluNote = ' (Regra Magalu: Assumimos que o preço final exige que o vendedor pague 50% do frete, com custo de R$15,00).';
        } else {
            magaluNote = ' (Regra Magalu: O preço final está abaixo de R$79,00, isentando o vendedor do custo de frete).';
        }
    }
    
    let sheinNote = '';
    if (details.marketplace === 'Shein') {
        sheinNote = ` (Regra Shein: A comissão de 16% foi aplicada. O custo de frete de R$${details.freightFee.toFixed(2)} foi baseado no peso de ${details.weight?.toFixed(2) || '0.50'} kg).`;
    }
    
    let facebookNote = '';
    if (details.marketplace === 'Facebook') {
        facebookNote = ' (Regra Facebook: Não há taxas de comissão ou custos fixos por venda).';
    }


    const prompt = `
        Você é a IA de Precificação da LucraAI. Sua tarefa é analisar o resultado do cálculo de preço de venda ideal e fornecer uma explicação amigável e estratégica para o usuário.
        
        **Dados do Cálculo:**
        - Marketplace: ${details.marketplace}
        - Categoria: ${details.category}
        - Peso (kg): ${details.weight?.toFixed(2) || 'N/A'}
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
        3. Mencione a regra específica do marketplace que foi aplicada.
        4. Se o lucro for negativo (R$ ${netProfit.toFixed(2)} < 0), use um tom de alerta e sugira aumentar o preço ou reduzir custos.
        5. Se a margem líquida for muito diferente da margem desejada, explique brevemente o porquê (geralmente devido a taxas fixas e frete).
        6. Inclua as notas específicas de marketplace se aplicável: "${mlNote}${shopeeNote}${amazonNote}${magaluNote}${sheinNote}${facebookNote}".
        7. Use negrito (**) para destacar valores importantes.
        
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
    const { marketplace, cost, margin, adType, additionalCost, category, weight } = body;

    if (typeof cost !== 'number' || typeof margin !== 'number' || typeof additionalCost !== 'number' || !category || typeof weight !== 'number') {
        return new Response(JSON.stringify({ error: 'Dados de entrada inválidos. Certifique-se de que custo, margem, custo adicional e peso são números, e a categoria foi selecionada.' }), { status: 400, headers: corsHeaders });
    }

    // 2. Executa o cálculo
    const calculation = calculatePrice(marketplace, cost, margin, adType, additionalCost, category, weight);
    
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