import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send, Image, Download, ThumbsUp, ThumbsDown, Share2, Plus } from "lucide-react"; // Alterado ImagePlus para Image
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
  isImagePrompt?: boolean; // Novo: indica que a mensagem do usuário é um prompt de imagem
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";
  
  // Prompt mais usado
  const mostUsedPrompt = "Vou te enviar uma imagem e preciso que você recrie essa imagem deixando ultra realista, com alta qualidade, melhorando a resolução da imagem, para ficar mais realista, o resto mantenha tudo igual com consistência e qualidade, ok?";

  // Componente auxiliar para renderizar a imagem
  const ImageDisplay = ({ image }: { image: GeneratedImage }) => {
    const imageUrl = `data:${image.mimeType};base64,${image.base64Image}`;
    
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'lucraai_image.png'; // Alterado para PNG
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Concluído",
        description: "A imagem foi baixada com sucesso.",
      });
    };
    
    const handleAction = (action: string) => {
        toast({
            title: "Ação Registrada",
            description: `Você clicou em ${action}. Funcionalidade em desenvolvimento.`,
        });
    };

    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
          <Image className="h-6 w-6" /> Imagem Gerada
        </h3>
        
        <Card className="p-2 bg-background border-accent/30 shadow-inner space-y-2">
          <img 
            src={imageUrl} 
            alt="Imagem gerada por IA" 
            className="w-full h-auto object-cover rounded-lg"
          />
          
          {/* Botões de Ação */}
          <div className="flex justify-between p-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleAction("Curtir")} className="text-muted-foreground hover:text-green-500">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleAction("Não Curtir")} className="text-muted-foreground hover:text-red-500">
                <ThumbsDown className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleAction("Compartilhar")} className="text-muted-foreground hover:text-blue-500">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              onClick={handleDownload}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Download className="h-5 w-5 mr-2" />
              Baixar
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // REMOVIDO: useEffect para adicionar mensagens iniciais

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
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
      
      // Se for um erro de Edge Function, usa a mensagem de erro retornada
      if (e instanceof Error) {
          errorMessage = errorMessage.includes("Erro desconhecido") ? e.message : errorMessage;
          
          // Simplifica a mensagem de erro para o usuário final
          if (errorMessage.includes("API key") || errorMessage.includes("401") || errorMessage.includes("Edge Function returned a non-2xx status code")) {
              errorMessage = "Ocorreu um erro de autenticação com a API de Imagens. Por favor, verifique se a chave OPENAI_API_KEY ou OPENROUTER_API_KEY está configurada corretamente no painel de segredos do Supabase.";
          } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
              errorMessage = "Limite de uso excedido. Tente novamente em breve.";
          } else if (errorMessage.includes("A API não retornou dados de imagem")) {
              errorMessage = "A IA não conseguiu gerar a imagem com o prompt fornecido. Tente ser mais específico.";
          } else {
              errorMessage = "Falha na comunicação com a IA. Verifique sua conexão ou tente novamente.";
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
            content: `❌ Erro: Não foi possível gerar a imagem. ${errorMessage}`,
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
      isImagePrompt: true, // Marca como prompt de imagem
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
    // Reinicia com mensagens vazias
    setMessages([]);
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Simulação de processamento de imagem
    toast({
        title: "Imagem Anexada",
        description: `A imagem '${file.name}' foi carregada. Agora, envie o prompt para recriá-la.`,
    });
    
    // Adiciona uma mensagem de usuário simulando o upload
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now(),
            sender: 'user',
            content: `[Imagem anexada: ${file.name}]`,
        }
    ]);
    
    // Limpa o input de arquivo para permitir novo upload
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat (Novo Design) */}
      <div className="p-4 border-b border-border flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center justify-between w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              // CLASSE ATUALIZADA: Borda transparente por padrão, borda amarela no hover
              className="text-muted-foreground transition-all duration-300 border-transparent hover:border-accent hover:bg-transparent hover:text-foreground" 
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1">
              Gerador de Imagens com IA
            </h3>
            <div className="w-10 h-10"></div>
        </div>
        
        {/* Ícone e Prompt Mais Usado - ESTILO NEON ATUALIZADO */}
        <div className="flex flex-col items-center space-y-4 pt-4">
            <div 
                className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center border-2 border-accent/50", // Aumentado para border-2
                    "relative overflow-hidden bg-transparent" // Fundo transparente
                )}
            >
                {/* Efeito Neon no Fundo (Ajustado para ser mais forte e apenas o glow) */}
                <div 
                    className="absolute inset-0 rounded-full opacity-100 transition-all duration-500"
                    style={{ 
                        // Aumentando o glow e o spread para um efeito mais forte e chamativo
                        boxShadow: `0 0 100px 30px ${accentColor}`, // Aumentado o glow
                        backgroundColor: 'transparent' // Fundo transparente
                    }} 
                />
                <Image className="h-8 w-8 text-accent relative z-10" /> {/* Ícone na cor accent */}
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs pt-4">
                <span className="text-white font-bold">Prompt mais usado:</span> {mostUsedPrompt}
            </p>
        </div>
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
          
          {/* Botão de Anexar Imagem (Plus) - Círculo Perfeito no Hover */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
            disabled={isLoading || step === 'done'}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || step === 'done'}
            className={cn(
                "h-10 w-10 ml-2 rounded-full text-muted-foreground transition-all duration-300",
                // Mantido: hover:bg-transparent hover:text-accent hover:rounded-full
                "hover:bg-transparent hover:text-accent hover:rounded-full", 
                (isLoading || step === 'done') && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
            )}
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder={step === 'done' ? "Geração concluída." : "Descreva a imagem que você deseja..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || step === 'done'}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-2" 
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
        
        {step === 'done' && (
          <Button 
            variant="link" 
            onClick={handleNewSearch}
            className="w-full mt-2 text-accent hover:text-accent/80"
          >
            Novo Produto
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageGeneratorChat;