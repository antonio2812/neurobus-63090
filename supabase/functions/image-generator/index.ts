import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa a chave de API do Google Gemini para Imagens
const GOOGLE_GEMINI_IMAGE_API_KEY = Deno.env.get('GOOGLE_GEMINI_IMAGE_API_KEY');

// URL da API de Geração de Imagens do Gemini
const GEMINI_IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${GOOGLE_GEMINI_IMAGE_API_KEY}`;

// Formato de saída JSON esperado pela função
interface GeneratedImage {
  base64Image: string;
  mimeType: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'image-generator' started execution.");

  if (!GOOGLE_GEMINI_IMAGE_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: A chave GOOGLE_GEMINI_IMAGE_API_KEY não está definida.' }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt de imagem não fornecido.' }), { status: 400, headers: corsHeaders })
    }
    
    console.log(`Generating image for prompt: ${prompt}`);

    const geminiBody = {
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
      prompt: {
        text: prompt,
      },
    };

    const response = await fetch(GEMINI_IMAGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Gemini Image API error:", response.status, errorText);
      throw new Error(`Erro da API do Google Gemini: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const generatedImages: GeneratedImage[] = data.generatedImages || [];

    if (generatedImages.length === 0) {
        throw new Error("A IA não conseguiu gerar a imagem. Tente um prompt diferente.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        generatedImage: generatedImages[0],
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
            errorMessage = "Chave API inválida ou erro de comunicação com a IA. Por favor, verifique a configuração da chave GOOGLE_GEMINI_IMAGE_API_KEY.";
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