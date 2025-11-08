import { CalculationResult } from "./types.ts";

// Inicializa as chaves de API (Acessadas via Deno.env.get no contexto da Edge Function)
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

// Função para chamar a IA (OpenRouter ou Gemini)
export const callAI = async (prompt: string, isJson: boolean = false) => {
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
        // ATUALIZADO: Usando gemini-2.5-flash
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

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
export const generateExplanation = async (calculation: CalculationResult) => {
    const { idealSalePrice, netProfit, netMargin, details } = calculation;
    
    // Formatação do peso para a explicação (usando rawWeightInputString)
    let weightDisplay = 'N/A';
    if (details.rawWeightInputString) {
        // Usa a string bruta digitada pelo usuário
        weightDisplay = details.rawWeightInputString;
    } else if (details.rawWeightValue !== null) {
        // Fallback para o valor numérico formatado com a unidade original
        weightDisplay = `${details.rawWeightValue.toFixed(details.weightUnit === 'g' ? 0 : 2).replace('.', ',')} ${details.weightUnit}`;
    }
    
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
        let fixedFeeDisplay = '';
        if (details.idealSalePrice < 19.00) {
            tier = 'abaixo de R$19,00';
            fixedFeeDisplay = ` (incluindo a taxa fixa de R$6,50)`;
        } else if (details.idealSalePrice >= 19.00 && details.idealSalePrice <= 78.99) {
            tier = 'entre R$19,00 e R$78,99';
        } else {
            tier = 'acima de R$78,99';
        }
        mlNote = ` (Regra ML: O cálculo usou a faixa de preço ${tier}${fixedFeeDisplay} e o tipo de anúncio ${details.adType}).`;
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
        // Aqui usamos o peso em KG para o cálculo da taxa, mas exibimos o peso digitado
        sheinNote = ` (Regra Shein: A comissão de 16% foi aplicada. O custo de frete de R$${details.freightFee.toFixed(2)} foi baseado no peso de ${weightDisplay}).`;
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
        - Peso: ${weightDisplay}
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