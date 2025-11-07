import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Send, Box, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface GeneratedKit {
  kitName: string;
  products: string[];
  suggestedPrice: number;
  reason: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  kits?: GeneratedKit[];
  isTyping?: boolean;
}

interface KitGeneratorChatProps {
  onBack: () => void;
}

type ChatStep = 'product_name' | 'done';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const KitGeneratorChat = ({ onBack }: KitGeneratorChatProps) => {
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
    content: `Olá! Sou o **Gerador Inteligente de Kits** da LucraAI. Para começar, digite o **nome do produto principal** que você deseja combinar.`,
  };
  
  const tipMessage: ChatMessage = {
    id: 0.1,
    sender: 'ai',
    content: `<span class="text-foreground font-bold">Dica:</span> Kits aumentam o ticket médio e a conversão. A IA buscará produtos complementares para maximizar seu lucro.`,
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
  const KitDisplay = ({ kits }: { kits: GeneratedKit[] }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
        <Box className="h-6 w-6" /> Kits Sugeridos
      </h3>
      
      {kits.map((kit, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h4 className="text-lg font-bold text-foreground">
              {kit.kitName}
            </h4>
            <span className="text-xl font-extrabold text-accent flex items-center gap-1">
              <DollarSign className="h-5 w-5" /> {formatCurrency(kit.suggestedPrice)}
            </span>
          </div>
          
          <div className="space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Produtos no Kit:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
              {kit.products.map((product, i) => (
                <li key={i}>{product}</li>
              ))}
            </ul>
            
            <p className="text-sm text-muted-foreground pt-2">
              <strong className="text-foreground">Estratégia de Lucro:</strong> {kit.reason}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const handleGenerateKits = async (product: string) => {
    if (!product) return;

    setIsLoading(true);
    
    const loadingMessageId = Date.now();
    
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        sender: 'ai',
        content: `Analisando o nicho de **${product}**... Gerando 3 combinações de kits complementares e lucrativos.`,
        isTyping: true,
      },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke('kit-generator', {
        body: { productName: product },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.kits) {
        throw new Error(data?.error || 'Erro ao processar a geração de kits.');
      }
      
      const generatedKits: GeneratedKit[] = data.kits;
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Adiciona a resposta final com os kits
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `Combinações prontas! Encontrei ${generatedKits.length} kits com **alto potencial de aumento de ticket médio** para o produto **${product}**.`,
            kits: generatedKits,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao gerar kits:", e);
      
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
            content: `❌ Erro: Não foi possível gerar os kits. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('product_name');
      setProductName(null);
      
      toast({
        title: "Erro de Geração de Kits",
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

    await handleGenerateKits(name);
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
          Gerador Inteligente de Kits
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
              
              {msg.kits && <KitDisplay kits={msg.kits} />}
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
              Gerar Novo Kit
            </Button>
          </div>
        )}
      </div>

      {/* Input e Botão de Envio */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          
          <Input
            placeholder={step === 'done' ? "Geração concluída." : "Digite o nome do produto principal..."}
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

export default KitGeneratorChat;