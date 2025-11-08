import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Calendar, Gift, TrendingUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getUpcomingDates, SpecialDate } from "@/lib/date-utils"; // Importando o utilitário

interface MinedProduct {
  name: string;
  reason: string;
  niche: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  minedProducts?: MinedProduct[];
  isTyping?: boolean;
}

interface DateMinerChatProps {
  onBack: () => void;
}

type ChatStep = 'select_date' | 'done';

const DateMinerChat = ({ onBack }: DateMinerChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<ChatStep>('select_date');
  const [upcomingDates, setUpcomingDates] = useState<SpecialDate[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const initialMessage: ChatMessage = {
    id: 0,
    sender: 'ai',
    content: `Olá! Sou o **Alerta de Datas** da LucraAI. Estou monitorando as próximas datas comemorativas para você vender muito!`,
  };

  useEffect(() => {
    const dates = getUpcomingDates();
    setUpcomingDates(dates);
    
    // LOG DE DEBBUG
    console.log("Upcoming Dates (Ordered):", dates.map(d => ({ name: d.name, date: d.date || 'SEPARATOR' })));
    
    if (messages.length === 0) {
      setMessages([
        initialMessage,
        {
          id: 0.1,
          sender: 'ai',
          content: `Selecione uma das **próximas datas** abaixo para que eu minere os produtos mais lucrativos e com baixa concorrência para você se preparar:`,
        }
      ]);
    }
    
    // Simulação de Alerta de Data Exata (Se for hoje)
    const todayDate = dates.find(d => d.date && isToday(parseISO(d.date)));
    if (todayDate) {
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1000,
                    sender: 'ai',
                    content: `🚨 **ALERTA DE DATA!** Hoje é **${todayDate.name}**! Clique no botão abaixo para ver os produtos minerados e comece a vender agora!`,
                }
            ]);
        }, 1000);
    }
    
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Componente auxiliar para renderizar os resultados
  const MinedProductsDisplay = ({ products, dateName }: { products: MinedProduct[], dateName: string }) => (
    <div className="mt-4 space-y-6">
      <h3 className="text-xl font-bold text-accent font-space-mono flex items-center gap-2">
        <Gift className="h-6 w-6" /> Produtos para {dateName}
      </h3>
      
      {products.map((product, index) => (
        <Card key={index} className="p-4 bg-background border-accent/30 shadow-inner space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent shrink-0" />
            <h4 className="text-lg font-bold text-foreground">
              {product.name}
            </h4>
          </div>
          
          <div className="space-y-1 ml-7">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nicho:</strong> {product.niche}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Estratégia:</strong> {product.reason}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  const handleDateSelect = async (date: SpecialDate) => {
    if (isLoading || !date.date) return; // Ignora se for um separador de mês

    setIsLoading(true);

    // 1. Adiciona a mensagem do usuário
    const formattedDate = format(parseISO(date.date), "dd 'de' MMMM", { locale: ptBR });
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: `Data selecionada: ${date.name} (${formattedDate})`,
    };
    
    // 2. Adiciona a mensagem de carregamento
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      sender: 'ai',
      content: `Minerando produtos... Buscando 5 produtos com alto potencial de lucro para **${date.name}**...`,
      isTyping: true,
    };
    
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      // A Edge Function 'date-miner' já está configurada para usar o Google Gemini
      const { data, error } = await supabase.functions.invoke('date-miner', {
        body: { dateName: date.name },
      });

      if (error) throw error;
      
      if (!data || !data.success || !data.minedProducts) {
        throw new Error(data?.error || 'Erro ao processar a mineração de produtos.');
      }
      
      const minedProducts: MinedProduct[] = data.minedProducts;
      
      setMessages((prev) => {
        // Remove a mensagem de carregamento
        const newMessages = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Adiciona a resposta final com os produtos
        return [
          ...newMessages,
          {
            id: Date.now() + 2,
            sender: 'ai',
            content: `Pronto! Encontrei ${minedProducts.length} produtos com **alto potencial de venda** para **${date.name}**. Prepare seu estoque!`,
            minedProducts: minedProducts,
          },
        ];
      });
      
      setStep('done');
      
    } catch (e) {
      console.error("Erro ao minerar produtos:", e);
      
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
            content: `❌ Erro: Não foi possível minerar os produtos. ${errorMessage}. Por favor, tente novamente.`,
          },
        ];
      });
      
      setStep('select_date'); // Volta para a seleção
      
      toast({
        title: "Erro de Mineração",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewSearch = () => {
    setStep('select_date');
    setMessages([initialMessage, {
      id: 0.1,
      sender: 'ai',
      content: `Selecione uma das **próximas datas** abaixo para que eu minere os produtos mais lucrativos e com baixa concorrência para você se preparar:`,
    }]);
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px] bg-background rounded-lg border border-border/50">
      
      {/* Header do Chat */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          // CLASSE ATUALIZADA: border-transparent hover:border-accent hover:bg-accent hover:text-black transition-all duration-300
          className="text-muted-foreground hover:text-accent-foreground transition-all duration-300 border-transparent hover:bg-accent hover:border-accent hover:text-black" 
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-bold text-foreground font-space-mono text-center flex-1 flex items-center justify-center gap-2">
          Datas Especiais + Produtos Minerados
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
                <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              )}
              
              {msg.minedProducts && <MinedProductsDisplay products={msg.minedProducts} dateName={msg.minedProducts?.[0]?.niche || "Data Especial"} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
        
        {/* Seleção de Data (Aparece apenas no passo 1) */}
        {step === 'select_date' && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {upcomingDates.map((date) => {
                // Se for um separador de mês
                if (!date.date) {
                    return (
                        <div key={date.name} className="col-span-1 sm:col-span-2 text-center py-2 mt-4">
                            <h4 className="text-xl font-bold text-accent font-space-mono border-b border-accent/50 pb-1">
                                {date.name}
                            </h4>
                        </div>
                    );
                }
                
                const isTodayDate = isToday(parseISO(date.date));
                // Formata a data para exibição (ex: 01 de Janeiro)
                const formattedDate = format(parseISO(date.date), "dd 'de' MMMM", { locale: ptBR });
                
                return (
                    <Button
                        key={date.name}
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left h-auto py-3 px-4 border-border text-foreground transition-all duration-300 group",
                            // Estilo de hover: fundo amarelo, borda amarela
                            "hover:bg-accent hover:border-accent",
                            isTodayDate && "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30 hover:text-white"
                        )}
                        onClick={() => handleDateSelect(date)}
                        disabled={isLoading}
                    >
                        <Calendar className={cn(
                            "h-5 w-5 mr-3 shrink-0",
                            isTodayDate ? "text-destructive" : "text-accent group-hover:text-black" // Ícone preto no hover
                        )} />
                        <div className="flex flex-col items-start">
                            <span className={cn(
                                "font-semibold transition-colors duration-300",
                                isTodayDate ? "text-destructive" : "text-foreground group-hover:text-black" // Texto do nome da data (preto no hover)
                            )}>
                                {date.name}
                            </span>
                            <span className={cn(
                                "text-xs text-muted-foreground transition-colors duration-300",
                                isTodayDate ? "text-destructive" : "group-hover:text-black/80" // Texto da data formatada (preto no hover)
                            )}>
                                {isTodayDate ? 
                                    <strong className="text-destructive">HOJE! (ALERTA)</strong> : 
                                    formattedDate
                                }
                            </span>
                        </div>
                    </Button>
                );
            })}
          </div>
        )}
        
        {/* Botão Nova Busca (Aparece após a conclusão) */}
        {step === 'done' && !isLoading && (
          <div className="flex justify-center pt-4 pb-2">
            <Button
              variant="outline"
              className="bg-card border-accent text-white hover:bg-accent hover:text-black transition-all duration-300" 
              onClick={handleNewSearch}
              disabled={isLoading}
            >
              Ver Outras Datas
            </Button>
          </div>
        )}
      </div>

      {/* Input (Oculto ou desabilitado) */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center w-full bg-card rounded-3xl border border-border/50 shadow-lg">
          <input
            placeholder={step === 'select_date' ? "Selecione uma data acima..." : "Busca concluída."}
            disabled={true}
            className="flex-grow h-12 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground pl-4 cursor-default" 
          />
          <Button 
            disabled={true}
            size="icon"
            className="h-10 w-10 mr-2 rounded-full bg-muted text-muted-foreground cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateMinerChat;