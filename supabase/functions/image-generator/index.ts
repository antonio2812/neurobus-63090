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
const GOOGLE_GEMINI_IMAGE_API_KEY = Deno.env.get('GOOGLE_GEMINI_IMAGE_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY'); // Mantido para consistência

// Função para chamar a API de Geração de Imagens (usando Gemini)
const generateImage = async (prompt: string) => {
    // Prioriza a chave específica para imagem, senão usa a chave geral do Gemini
    const apiKey = GOOGLE_GEMINI_IMAGE_API_KEY || GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('Chave GOOGLE_GEMINI_API_KEY ou GOOGLE_GEMINI_IMAGE_API_KEY não configurada para geração de imagens.');
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            config: {
                numberOfImages: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: "1:1", // Quadrado
            },
            prompt: `Crie uma imagem de alta qualidade para e-commerce no Brasil. O tema é: ${prompt}. Foco em iluminação profissional e fundo limpo.`,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Gemini Image API error:", response.status, errorText);
        throw new Error(`Erro da API do Google Gemini: ${response.status}. Detalhes: ${errorText}`);
    }

    const data = await response.json();
    
    const base64Image = data.generatedImages?.[0]?.image?.imageBytes;

    if (!base64Image) {
        throw new Error("A IA não conseguiu gerar a imagem. Tente um prompt diferente.");
    }
    
    // Retorna a imagem em formato base64
    return base64Image;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'image-generator' started execution.");

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt de imagem não fornecido.' }), { status: 400, headers: corsHeaders })
    }
    
    const base64Image = await generateImage(prompt);

    return new Response(
      JSON.stringify({
        success: true,
        image: base64Image,
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
            errorMessage = "Chave API inválida ou erro de comunicação com a IA. Por favor, verifique a configuração da chave GOOGLE_GEMINI_API_KEY.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
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