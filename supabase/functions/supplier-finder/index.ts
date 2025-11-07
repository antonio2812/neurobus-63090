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
interface Supplier {
  name: string;
  type: 'Nacional' | 'Importadora';
  productFocus: string;
  contact: string;
  minOrder: number;
  focus: 'Atacado' | 'Varejo' | 'Ambos'; // Novo campo
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

  if (!GOOGLE_GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: A chave GOOGLE_GEMINI_API_KEY não está definida.' }),
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