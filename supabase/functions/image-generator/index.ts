import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Inicializa a chave de API correta para Imagens
const GEMINI_IMAGE_API_KEY = Deno.env.get('GOOGLE_GEMINI_IMAGE_API_KEY'); 

// Função para gerar a imagem usando a API do Google Gemini
const generateImage = async (prompt: string) => {
    const apiKey = GEMINI_IMAGE_API_KEY;
    // Endpoint da API de Geração de Imagens do Google Gemini (DALL-E 3 é da OpenAI)
    // Usaremos o modelo Imagen 2 (ou similar) via API do Google.
    const GEMINI_IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;
    
    if (!apiKey) {
        throw new Error('Nenhuma chave de API (GOOGLE_GEMINI_IMAGE_API_KEY) configurada para geração de imagens.');
    }

    // Prompt de engenharia para garantir qualidade e estilo de marketplace
    const finalPrompt = `Crie uma imagem de alta qualidade, ultra realista, com iluminação profissional e fundo limpo (branco ou gradiente sutil) para um anúncio de marketplace. O produto é: "${prompt}". Foco em detalhes e conversão.`;

    try {
        const response = await fetch(GEMINI_IMAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: finalPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: "image/png",
                    aspectRatio: "1:1",
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Imagen API error:", response.status, errorText);
            throw new Error(`Erro da API do Google Imagen: ${response.status}. Resposta: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.generatedImages || data.generatedImages.length === 0) {
            throw new Error("A API do Google Imagen não retornou dados de imagem.");
        }

        const image = data.generatedImages[0];
        
        return {
            base64Image: image.image.imageBytes, // O Gemini retorna a imagem em imageBytes
            mimeType: image.image.mimeType,
        };
    } catch (e) {
        console.error("Erro ao chamar a API de Imagem:", e);
        throw e;
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'image-generator' started execution.");

  // Verificação explícita da chave correta
  if (!GEMINI_IMAGE_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Erro de Configuração: Nenhuma chave de API (GOOGLE_GEMINI_IMAGE_API_KEY) está definida nos segredos do Supabase.' }),
      { status: 500, headers: corsHeaders }
    );
  }

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
            errorMessage = "Chave API inválida ou erro de autenticação. Verifique se a chave GOOGLE_GEMINI_IMAGE_API_KEY está configurada corretamente.";
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Limite de taxa excedido. Tente novamente em breve.";
        } else if (errorMessage.includes("A API do Google Imagen não retornou dados de imagem")) {
            errorMessage = "A IA não conseguiu gerar a imagem com o prompt fornecido. Tente ser mais específico.";
        } else if (errorMessage.includes("Nenhuma chave de API")) {
            errorMessage = "Erro de Configuração: Nenhuma chave de API (GOOGLE_GEMINI_IMAGE_API_KEY) está definida nos segredos do Supabase.";
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