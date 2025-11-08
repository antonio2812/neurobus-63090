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
interface GeneratedContent {
  title: string;
  description: string;
}

// Função para chamar a IA (OpenRouter ou Gemini)
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
                temperature: 0.7,
                ...(isJson && { response_format: { type: "json_object" } }),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);
            throw new Error(`Erro da API do OpenRouter: ${response.status}. Resposta: ${errorText}`);
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
            throw new Error(`Erro da API do Google Gemini: ${response.status}. Resposta: ${errorText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "A IA não retornou conteúdo.";
    } else {
        throw new Error('Nenhuma chave de API (OpenRouter ou Gemini) configurada.');
    }
}


// Função para gerar o prompt principal
const generatePrompt = (productName: string, count: number): string => {
  // ALTERADO: Instrução de título mais forte em SEO
  const titleFormat = "Gere um título de NO MÁXIMO 100 CARACTERES, focado em SEO para Google e Marketplaces (Mercado Livre, Shopee, Amazon). O título deve ser uma combinação estratégica de: [NOME DO PRODUTO] + [MARCA/MODELO] + [BENEFÍCIO PRINCIPAL] + [PALAVRAS-CHAVE DE ALTO VALOR (ex: Original, Melhor Preço, Envio Rápido, Lançamento, Oferta, Promoção, Frete Grátis)].";
  
  return `
    Você é um especialista em SEO e Copywriting para e-commerce e marketplaces (Mercado Livre, Shopee, Amazon).
    Sua tarefa é gerar ${count} opções de títulos e ${count} opções de descrições para o produto: "${productName}".
    
    **INSTRUÇÕES CRÍTICAS GERAIS:**
    1. O nome do produto fornecido ("${productName}") pode conter Marca, Modelo e Características. Use todas essas informações para tornar o conteúdo o mais preciso e estratégico possível.
    
    **INSTRUÇÕES CRÍTICAS PARA TÍTULOS:**
    1. Pesquise e estude o produto "${productName}" na internet para identificar as melhores palavras-chave de alto volume de busca e os principais benefícios.
    2. Gere ${count} TÍTULOS. Cada título deve ter NO MÁXIMO 100 CARACTERES.
    3. Cada título deve ser ÚNICO e usar um conjunto de PALAVRAS-CHAVE DIFERENTES dos outros títulos para maximizar a cobertura de busca.
    4. Siga o formato de SEO: ${titleFormat}.
    
    **INSTRUÇÕES CRÍTICAS PARA DESCRIÇÕES:**
    1. Gere ${count} DESCRIÇÕES. Cada descrição deve ser **única, completa, persuasiva, de alto valor/peso e de alta conversão**.
    2. Use a API da OpenAI para buscar e estudar na internet sobre o produto "${productName}" para preencher o template com informações reais e convincentes.
    3. Siga EXATAMENTE o template de estrutura fornecido abaixo, incluindo o espaçamento de 3 linhas entre as seções principais.
    
    --- TEMPLATE DE DESCRIÇÃO OBRIGATÓRIO ---
    
    *** ATENÇÃO ***
    DESCONTÃO por tempo limitado. Aproveite Logo!
    
    
    
    
    *** ATENÇÃO ***
    POUCAS UNIDADES RESTANTES | GARANTA O SEU ANTES QUE ACABE!
    
    
    
    
    *** LANÇAMENTO 2025 ***
    
    
    
    
    *** CUSTO BENEFÍCIO COM ÓTIMA QUALIDADE ***
    
    
    
    
    DESCRIÇÃO:
    CRIE UMA DESCRIÇÃO COMPLETA.
    
    CRIE UMA DESCRIÇÃO COMPLETA.
    
    
    
    
    ITENS INCLUSOS:
    1x (COLOQUE OS ITENS INCLUSOS AQUI).
    
    
    
    
    INFORMAÇÕES TÉCNICAS:
    (COLOQUE AS INFORMAÇÕES TÉCNICAS AQUI).
    
    
    
    
    PRINCIPAIS BENEFÍCIOS:
    *** CRIE UM TÍTULO DO PRINCIPAL BENEFÍCIO EM MAIÚSCULO ***: Crie uma breve descrição desse principal benefício.
    
    *** CRIE UM TÍTULO DO PRINCIPAL BENEFÍCIO EM MAIÚSCULO ***: Crie uma breve descrição desse principal benefício.
    
    *** CRIE UM TÍTULO DO PRINCIPAL BENEFÍCIO EM MAIÚSCULO ***: Crie uma breve descrição desse principal benefício.
    
    *** CRIE UM TÍTULO DO PRINCIPAL BENEFÍCIO EM MAIÚSCULO ***: Crie uma breve descrição desse principal benefício.
    
    
    
    
    DÚVIDAS FREQUENTES
    *** ELE TEM GARANTIA? ***
    Sim! Garantia de (30) dias.
    
    *** CRIE UMA DÚVIDA REAL FREQUENTE EM MAIÚSCULO ***
    Crie uma resposta para essa dúvida real frequente.
    
    *** CRIE UMA DÚVIDA REAL FREQUENTE EM MAIÚSCULO ***
    Crie uma resposta para essa dúvida real frequente.
    
    *** CRIE UMA DÚVIDA REAL FREQUENTE EM MAIÚSCULO ***
    Crie uma resposta para essa dúvida real frequente.
    
    *** CRIE UMA DÚVIDA REAL FREQUENTE EM MAIÚSCULO ***
    Crie uma resposta para essa dúvida real frequente.
    
    *** CRIE UMA DÚVIDA REAL FREQUENTE EM MAIÚSCULO ***
    Crie uma resposta para essa dúvida real frequente.
    
    
    
    
    ESTAMOS AQUI PARA TE AJUDAR! QUALQUER DÚVIDA, ESTAMOS À DISPOSIÇÃO PARA RESPONDER O MAIS RÁPIDO POSSÍVEL!
    
    --- FIM DO TEMPLATE ---
    
    Formato de Saída: Retorne um objeto JSON com a chave 'generatedContent' contendo um array de objetos, cada um com as chaves 'title' (string) e 'description' (string).
    Exemplo: {"generatedContent": [{"title": "...", "description": "..."}, ...]}
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'generate-content' started execution.");

  // 1. Verificação da Chave do Google Gemini / OpenRouter
  if (!GOOGLE_GEMINI_API_KEY && !OPENROUTER_API_KEY) {
    console.error("Execution failed: API key is missing.");
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: Nenhuma chave de API (OpenRouter ou Gemini) está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { productName, count } = body;

    if (!productName || typeof count !== 'number' || count <= 0) {
      console.error("Validation failed: Invalid product name or count.", body);
      return new Response(JSON.stringify({ error: 'Nome do produto ou contagem inválida.' }), { status: 400, headers: corsHeaders })
    }
    
    const actualCount = Math.min(count, 5) 
    const prompt = generatePrompt(productName, actualCount)
    
    console.log(`Generating content for: ${productName}`);

    const rawContent = await callAI(prompt, true); // Requer JSON
    
    if (!rawContent) {
      console.error("AI returned empty content.");
      throw new Error("A IA não retornou conteúdo.")
    }

    // Tenta parsear a resposta JSON
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(rawContent);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", rawContent, e);
        // Se o parsing falhar, tentamos usar a resposta bruta como string de erro
        throw new Error(`Erro de formato da IA. Resposta bruta: ${rawContent.substring(0, 100)}...`);
    }
    
    let generatedContent: GeneratedContent[] = []
    
    // Lógica de extração de conteúdo (mantida)
    if (Array.isArray(jsonResponse)) {
        generatedContent = jsonResponse
    } 
    else if (typeof jsonResponse === 'object' && jsonResponse !== null && Array.isArray(jsonResponse.generatedContent)) {
        generatedContent = jsonResponse.generatedContent
    }
    else if (typeof jsonResponse === 'object' && jsonResponse !== null) {
        const keys = Object.keys(jsonResponse)
        for (const key of keys) {
            if (Array.isArray(jsonResponse[key])) {
                generatedContent = jsonResponse[key]
                break
            }
        }
    }

    if (generatedContent.length === 0) {
        console.error("Conteúdo gerado vazio ou formato inesperado:", rawContent)
        throw new Error("A IA gerou um formato de resposta inválido ou vazio. Tente um nome de produto diferente.")
    }
    
    console.log(`Successfully generated ${generatedContent.length} items.`);

    return new Response(
      JSON.stringify({
        success: true,
        generatedContent: generatedContent,
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
        
        // Mensagens de erro mais claras para o usuário
        if (errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("OpenRouter")) {
            errorMessage = "Chave API inválida ou erro de autenticação. Por favor, verifique a configuração da chave OPENROUTER_API_KEY ou GOOGLE_GEMINI_API_KEY no painel de segredos do Supabase.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
        } else if (errorMessage.includes("Erro de formato da IA")) {
            // Mantém a mensagem de erro de formato
        } else if (errorMessage.includes("Erro da API do Google Gemini")) {
            errorMessage = "Erro na comunicação com a API do Google Gemini. Verifique se a chave GOOGLE_GEMINI_API_KEY está correta.";
        } else if (errorMessage.includes("Erro da API do OpenRouter")) {
            errorMessage = "Erro na comunicação com a API do OpenRouter. Verifique se a chave OPENROUTER_API_KEY está correta.";
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