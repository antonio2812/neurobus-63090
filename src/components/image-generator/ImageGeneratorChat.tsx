import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send, ImagePlus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface GeneratedImage {
  base64Image: string;
  mimeType: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  generatedImage?: GeneratedImage;
  isTyping?: boolean;
}

interface ImageGeneratorChatProps {
  onBack: () => void;
}

type ChatStep = 'prompt' | 'done';

const ImageGeneratorChat = ({ onBack }: ImageGeneratorChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('prompt');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Gerador de Imagens com IA** da LucraAI. Descreva a imagem que você deseja criar para o seu produto (ex: 'Tênis esportivo em um fundo futurista').`,
  };
  
  const tipMessage: ChatMessage = {
    id: 0.1,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Seja detalhado! Inclua estilo, cores, iluminação e o que o produto deve estar fazendo.`,
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage, tipMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Componente auxiliar para renderizar a imagem
  const ImageDisplay = ({ image }: { image: GeneratedImage }) => {
    const imageUrl = `data:${image.mimeType};base64,${image.base64Image}`;
    
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'lucraai_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Concluído",
        description: "A imagem foi baixada com sucesso.",
      });
    };

    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
          <ImagePlus className="h-6 w-6" /> Imagem Gerada
        </h3>
        
        <Card className="p-2 bg-background border-accent/30 shadow-inner space-y-2">
          <img 
            src={imageUrl} 
            alt="Imagem gerada por IA" 
            className="w-full h-auto object-cover rounded-lg"
          />
          <Button 
            onClick={handleDownload}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar Imagem
          </Button>
        </Card>
      </div>
    );
  };

  const handleGenerateImage = async (prompt: string) => {
    if (!prompt) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: `Gerando imagem para o prompt: **${prompt}**... Isso pode levar alguns segundos.`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('image-generator', {
        body: { prompt },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.generatedImage) {
        throw new Error(data?.error || 'Erro ao processar a geração de imagem.');
      }
      
      const generatedImage: GeneratedImage = data.generatedImage;
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Adiciona a resposta final com a imagem
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `Sua imagem está pronta! Use-a para turbinar seus anúncios.`,
            generatedImage: generatedImage,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao gerar imagem:", e);
      
      let errorMessage = "Erro desconhecido na comunicação com a IA.";
      
      const errorObject = e as any; 
      
      if (errorObject.context && errorObject.context.body) {
          try {
              const errorBody = JSON.parse(errorObject.context.body);
              if (errorBody.error) {
                  errorMessage = errorBody.error;
              }
          } catch (parseError) {
              console.error("Failed to parse error body:", parseError);
          }
      }
      
      if (e instanceof Error) {
          errorMessage = errorMessage.includes("Erro desconhecido") ? e.message : errorMessage;
          if (errorMessage.includes("Edge Function returned a non-2xx status code")) {
              errorMessage = "Ocorreu um erro interno no servidor da IA. Por favor, verifique se a chave GOOGLE_GEMINI_IMAGE_API_KEY está configurada corretamente.";
          }
      }
      
      // Remove a mensagem de carregamento e adiciona uma mensagem de erro
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        return [
          ...newMessages,
          {
            id: Date.now() + 3,
            sender: 'ai',
            content: `❌ Erro: Não foi possível gerar a imagem. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('prompt');
      
      toast({
        title: "Erro de Geração de Imagem",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || step === 'done') return;

    const prompt = input.trim();
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: prompt,
    };
    
    setInput(""); 

    setMessages((prev) => [...prev, userMessage]);

    await handleGenerateImage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleNewSearch = () => {
    setStep('prompt');
    setInput("");
    setMessages([initialMessage, tipMessage]);
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // ESTILO ATUALIZADO: Borda transparente, fundo transparente, hover:bg-accent, hover:text-black
          className="text-muted-foreground hover:text-black transition-colors duration-300 border-transparent hover:bg-accent" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          Gerador de Imagens com IA
        </h3>
        <div className="w-10 h-10"></div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] p-3 shadow-none transition-all duration-300",
                msg.sender === 'ai'
                  ? 'bg-transparent text-foreground text-lg leading-relaxed'
                  : 'bg-card text-foreground rounded-xl rounded-br-sm text-base'
              )}
            >
              {msg.isTyping ? (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              ) : (
                // Renderiza o conteúdo usando a função segura
                msg.sender === 'ai' ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /> : msg.content
              )}
              
              {msg.generatedImage && <ImageDisplay image={msg.generatedImage} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Botão Nova Busca (Aparece após a conclusão) */}
        {step === 'done' && !isLoading && (
          <div className="flex justify-center pt-4 pb-2">
            <Button
              variant="outline"
              className="bg-card border-accent text-white hover:bg-accent hover:text-black transition-all duration-300" 
              onClick={handleNewSearch}
              disabled={isLoading}
            >
              Gerar Nova Imagem
            </Button>
          </div>
        )}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step === 'done' ? "Geração concluída." : "Descreva a imagem que você deseja..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || step === 'done'}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4" 
          />
          
          <Button 
            onClick={handleSend} 
            disabled={isLoading || step === 'done' || !input.trim()}
            size="icon"
            className="h-10 w-10 mr-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorChat;