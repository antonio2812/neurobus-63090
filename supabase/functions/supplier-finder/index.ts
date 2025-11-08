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

// Formato de saída JSON esperado pela função
interface Supplier {
  name: string;
  type: 'Nacional' | 'Importadora';
  productFocus: string;
  contact: string;
  minOrder: number;
  focus: 'Atacado' | 'Varejo' | 'Ambos'; // Novo campo
}

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
                temperature: 0.7,
                ...(isJson && { response_format: { type: "json_object" } }),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);
            throw new Error(`Erro da API do OpenRouter: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "A IA não retornou conteúdo.";

    } else if (GOOGLE_GEMINI_API_KEY) {
        // ATUALIZADO: Usando gemini-2.5-flash
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.7,
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
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou conteúdo.";
    } else {
        throw new Error('Nenhuma chave de API (OpenRouter ou Gemini) configurada.');
    }
}


// Função para gerar o prompt principal
const generateSupplierPrompt = (category: string, supplierType: 'Nacional' | 'Importadora'): string => {
  return `
    Você é um especialista em sourcing e logística de e-commerce no Brasil.
    Sua tarefa é simular a busca e identificação de 5 fornecedores (Atacado e Varejo) ideais para a categoria de produtos: "${category}", focando em fornecedores do tipo "${supplierType}".
    
    **INSTRUÇÕES CRÍTICAS:**
    1. **REALISMO E ATUALIDADE:** Simule 5 fornecedores que pareçam reais e sejam adequados para o mercado brasileiro (Mercado Livre, Shopee, Amazon). Os dados devem ser recentes (2024/2025).
    2. **FOCO:** Todos os fornecedores devem ser do tipo "${supplierType}".
    3. **ATACADO/VAREJO:** Inclua fornecedores que atendam Atacado, Varejo ou Ambos.
    4. Para cada fornecedor, forneça:
        a. O nome da empresa (name).
        b. O tipo ('Nacional' ou 'Importadora') (type).
        c. O foco principal de produtos (productFocus).
        d. Um contato simulado (ex: site, email ou telefone fictício) (contact).
        e. O valor mínimo de pedido (minOrder) em Reais (R$). O valor deve ser um número (float) sem formatação de moeda.
        f. O foco de venda ('Atacado', 'Varejo' ou 'Ambos') (focus).
    
    Formato de Saída: Retorne um objeto JSON com a chave 'suppliers' contendo um array de objetos, cada um com as chaves 'name', 'type', 'productFocus', 'contact', 'minOrder' (number) e 'focus' (string).
    Exemplo: {"suppliers": [{"name": "...", "type": "Nacional", "productFocus": "...", "contact": "...", "minOrder": 500.00, "focus": "Atacado"}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'supplier-finder' started execution.");

  if (!GOOGLE_GEMINI_API_KEY && !OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: Nenhuma chave de API (OpenRouter ou Gemini) está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { category, supplierType } = body;

    if (!category || !supplierType) {
      return new Response(JSON.stringify({ error: 'Categoria e Tipo de Fornecedor são obrigatórios.' }), { status: 400, headers: corsHeaders })
    }
    
    const prompt = generateSupplierPrompt(category, supplierType);
    
    console.log(`Generating suppliers for: ${category} (${supplierType})`);

    const rawContent = await callAI(prompt, true); // Requer JSON
    
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
    
    const suppliers: Supplier[] = jsonResponse.suppliers || [];

    if (suppliers.length === 0) {
        throw new Error("A IA não conseguiu identificar fornecedores para este produto.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        suppliers: suppliers,
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
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: corsHeaders,
        status: 500,
      }
    )
  }
});