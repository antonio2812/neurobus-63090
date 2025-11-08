import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import OpenAI from 'https://esm.sh/openai@4.52.7';

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa as chaves de API
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

// Função para gerar a imagem
const generateImage = async (prompt: string) => {
    let apiKey = OPENAI_API_KEY;
    let baseURL = 'https://api.openai.com/v1';
    let headers = {};

    // Se a chave OpenRouter estiver disponível, usaremos ela, pois ela pode rotear para DALL-E 3
    if (OPENROUTER_API_KEY) {
        apiKey = OPENROUTER_API_KEY;
        baseURL = 'https://openrouter.ai/api/v1';
        headers = {
            'HTTP-Referer': 'https://urbbngcarxdqesenfvsb.supabase.co',
        };
    } else if (!OPENAI_API_KEY) {
        throw new Error('Nenhuma chave de API (OPENAI_API_KEY ou OPENROUTER_API_KEY) configurada para geração de imagens.');
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
        defaultHeaders: headers,
    });

    // Prompt de engenharia para garantir qualidade e estilo de marketplace
    const finalPrompt = `Crie uma imagem de alta qualidade, ultra realista, com iluminação profissional e fundo limpo (branco ou gradiente sutil) para um anúncio de marketplace. O produto é: "${prompt}". Foco em detalhes e conversão.`;

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json", // Solicita a imagem em base64
    });

    if (!response.data || response.data.length === 0) {
        throw new Error("A API não retornou dados de imagem.");
    }

    const image = response.data[0];
    
    return {
        base64Image: image.b64_json,
        mimeType: 'image/png', // DALL-E 3 geralmente retorna PNG
    };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'image-generator' started execution.");

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'O prompt da imagem não foi fornecido.' }), { status: 400, headers: corsHeaders })
    }
    
    const generatedImage = await generateImage(prompt);

    return new Response(
      JSON.stringify({
        success: true,
        generatedImage: generatedImage,
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
            errorMessage = "Chave API inválida ou erro de autenticação. Verifique se a chave OPENAI_API_KEY ou OPENROUTER_API_KEY está configurada corretamente.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
        } else if (errorMessage.includes("A API não retornou dados de imagem")) {
            errorMessage = "A IA não conseguiu gerar a imagem com o prompt fornecido. Tente ser mais específico.";
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