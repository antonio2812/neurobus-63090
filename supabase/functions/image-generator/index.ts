import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Removendo a inicialização da chave GOOGLE_GEMINI_IMAGE_API_KEY e a URL da API.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  console.log("Edge Function 'image-generator' started execution.");

  // Lógica de geração de imagem removida.
  
  // Retorna um erro 501 (Not Implemented) ou 503 (Service Unavailable)
  return new Response(
    JSON.stringify({ 
      success: false,
      error: 'O Gerador de Imagens com IA está temporariamente indisponível. Estamos atualizando a integração com uma nova API.',
    }),
    {
      headers: corsHeaders,
      status: 503,
    }
  );
});