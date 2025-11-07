import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface ForbiddenWord {
  word: string;
  reason: string;
  suggestion: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  forbiddenWords?: ForbiddenWord[];
  isTyping?: boolean;
}

interface ForbiddenWordsChatProps {
  onBack: () => void;
}

type ChatStep = 'product_name' | 'done';

const ForbiddenWordsChat = ({ onBack }: ForbiddenWordsChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('product_name');
  const [productName, setProductName] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const accentColor = "#ffc800";

  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Detector de Palavras Proibidas** da LucraAI. Para evitar bloqueios e reprovações, por favor, digite o **nome do produto** que você deseja anunciar.`,
  };
  
  const tipMessage: ChatMessage = {
    id: 0.1,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Quanto mais detalhes você informar como marca, modelo e características — mais preciso e estratégico serão os resultados gerados pela IA da LucraAI.`,
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage, tipMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Componente auxiliar para renderizar os resultados
  const ForbiddenWordsDisplay = ({ words }: { words: ForbiddenWord[] }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-destructive font-space-mono flex items-center gap-2">
        <AlertTriangle className="h-6 w-6" /> Palavras de Alto Risco
      </h3>
      
      {words.map((word, index) => (
        <Card key={index} className="p-4 bg-background border-destructive/30 shadow-inner space-y-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive shrink-0" />
            <h4 className="text-lg font-bold text-foreground">
              {word.word}
            </h4>
          </div>
          
          <div className="space-y-1 ml-7">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Motivo do Risco:</strong> {word.reason}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sugestão Segura:</strong> <span className="text-accent font-semibold">{word.suggestion}</span>
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const handleDetectWords = async (product: string) => {
    if (!product) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: `Analisando políticas de marketplaces... Buscando palavras proibidas para o produto **${product}**...`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('forbidden-words-detector', {
        body: { productName: product },
      });

      if (error) throw error;
      
      if (!data || !data.success) {
        throw new Error(data?.error || 'Erro ao processar a detecção de palavras.');
      }
      
      const forbiddenWords: ForbiddenWord[] = data.forbiddenWords || [];
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        let finalMessage: ChatMessage;
        
        if (forbiddenWords.length > 0) {
            finalMessage = {
                id: Date.now() + 2,
                sender: 'ai',
                content: `Atenção! Encontrei ${forbiddenWords.length} palavras de **alto risco** para o produto **${product}**. Evite-as para não ter seu anúncio reprovado ou sua conta bloqueada.`,
                forbiddenWords: forbiddenWords,
            };
        } else {
            finalMessage = {
                id: Date.now() + 2,
                sender: 'ai',
                content: data.message || `Análise concluída! Não encontramos palavras de alto risco para o produto **${product}**. Continue assim!`,
            };
        }

        return [
          ...newMessages,
          finalMessage,
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao detectar palavras proibidas:", e);
      
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
              errorMessage = "Ocorreu um erro interno no servidor da IA. Por favor, verifique se a chave GOOGLE_GEMINI_API_KEY está configurada corretamente.";
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
            content: `❌ Erro: Não foi possível detectar as palavras. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('product_name');
      setProductName(null);
      
      toast({
        title: "Erro de Detecção",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || step === 'done') return;

    const name = input.trim();
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: name,
    };
    
    setProductName(name);
    setInput(""); 

    setMessages((prev) => [...prev, userMessage]);

    await handleDetectWords(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleNewSearch = () => {
    setStep('product_name');
    setProductName(null);
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
          className="text-muted-foreground hover:text-black hover:bg-accent transition-colors duration-300 border-transparent" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          Detector de Palavras Proibidas
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
              
              {msg.forbiddenWords && <ForbiddenWordsDisplay words={msg.forbiddenWords} />}
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
              Nova Análise
            </Button>
          </div>
        )}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step === 'done' ? "Análise concluída." : "Digite o nome do produto..."}
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

export default ForbiddenWordsChat;